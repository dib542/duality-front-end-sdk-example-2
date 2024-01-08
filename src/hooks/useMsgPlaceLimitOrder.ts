import { useMutation } from "@tanstack/react-query";
import {
  MsgPlaceLimitOrder,
  MsgPlaceLimitOrderResponse,
} from "@duality-labs/dualityjs/types/codegen/duality/dex/tx";

import placeLimitOrder from "../msgs/placeLimitOrder";

// create stateful hook version of swap
export default function useMsgPlaceLimitOrder() {
  // Mutations
  return useMutation<MsgPlaceLimitOrderResponse, Error, MsgPlaceLimitOrder>({
    mutationFn: async (msgPlaceLimitOrder) => {
      return placeLimitOrder(msgPlaceLimitOrder);
    },
  });
}
