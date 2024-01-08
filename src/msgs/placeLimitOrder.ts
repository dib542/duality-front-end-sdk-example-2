import { assertIsDeliverTxSuccess } from "@cosmjs/stargate";
import { duality } from "@duality-labs/dualityjs";
import {
  MsgPlaceLimitOrderResponse,
  MsgPlaceLimitOrder,
} from "@duality-labs/dualityjs/types/codegen/duality/dex/tx";

import { frameClient } from "../hooks/useFrameClient";

// create stateful hook version of swap
export default async function placeLimitOrder(
  msgPlaceLimitOrder: MsgPlaceLimitOrder,
): Promise<MsgPlaceLimitOrderResponse> {
  // show loading state
  // use random notification ID to replace loading notification with result
  const id = Math.random().toString();
  frameClient.showNotification({
    id,
    style: "loading",
    heading: "Transaction in progress...",
    body: "Confirming Mars Trade",
    dismissable: false,
    duration: Number.POSITIVE_INFINITY,
  });

  return frameClient
    .signAndBroadcast(
      msgPlaceLimitOrder.creator,
      [
        duality.dex.MessageComposer.withTypeUrl.placeLimitOrder(
          msgPlaceLimitOrder,
        ),
      ],
      {
        // use shortcut default instead of using simulate method
        gas: "200000",
        amount: [],
      },
    )
    .then(
      (response) => {
        try {
          assertIsDeliverTxSuccess(response);
          // attempt to decode the successful msgResponses
          const msgPlaceLimitOrderResponse = response?.msgResponses?.find(
            ({ typeUrl, value }) => {
              return typeUrl === "/duality.dex.MsgPlaceLimitOrderResponse";
            },
          );
          const decodedMsgResponse: MsgPlaceLimitOrderResponse | undefined =
            msgPlaceLimitOrderResponse &&
            duality.dex.MsgPlaceLimitOrderResponse.decode(
              msgPlaceLimitOrderResponse.value,
            );
          if (decodedMsgResponse) {
            const { coinIn, takerCoinOut } = decodedMsgResponse;
            frameClient.showNotification({
              id,
              style: "success",
              heading: "Mars Trade Successful!",
              body: `Traded ${coinIn.amount}${coinIn.denom} for  ${takerCoinOut.amount}${takerCoinOut.denom}`,
              dismissable: true,
            });
            return decodedMsgResponse;
          }
        } catch (e: unknown) {
          switch (response.code) {
            case 1143: {
              frameClient.showNotification({
                id,
                style: "error",
                heading: "Insufficient Liquidity",
                body: (e as Error)?.message,
                dismissable: true,
              });
              break;
            }
            default: {
              frameClient.showNotification({
                id,
                style: "error",
                heading: "An unknown response error occurred",
                body: (e as Error)?.message,
                dismissable: true,
              });
            }
          }
        }
        throw new Error(`Delivery failure (code: ${response.code}`);
      },
      (e) => {
        // show request errors
        switch (e?.message?.toLowerCase()) {
          case "request rejected":
            frameClient.showNotification({
              id,
              style: "error",
              heading: "Transaction cancelled",
              body: "You declined the transaction",
              dismissable: true,
            });
            break;
          default:
            frameClient.showNotification({
              id,
              style: "error",
              heading: "An unknown request error occurred",
              body: (e as Error)?.message,
              dismissable: true,
            });
        }
        // rethrow error
        throw e;
      },
    );
}
