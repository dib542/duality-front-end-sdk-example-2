import Long from "long";

import useTokenPairs from "../hooks/useIndexerTokenPairs";
import useFrameWalletAddress from "../hooks/useFrameWalletAddress";
import useMsgPlaceLimitOrder from "../hooks/useMsgPlaceLimitOrder";

export default function PoolTable() {
  const walletAddress = useFrameWalletAddress();
  const { data: tokenPairs = [] } = useTokenPairs();
  const swap = useMsgPlaceLimitOrder();
  return (
    <table>
      <tbody>
        {tokenPairs.map(([token0, token1, reserves0, reserves1]) => {
          return (
            <tr key={`${token0}-${token1}`}>
              <td style={{ padding: 5 }}>
                pair: {token0}-{token1}
              </td>
              <td style={{ padding: 5, textAlign: "right" }}>
                {reserves0.toLocaleString("en-US")}
                {token0}
              </td>
              <td style={{ padding: 5, textAlign: "right" }}>
                {reserves1.toLocaleString("en-US")}
                {token1}
              </td>
              <td style={{ padding: 5 }}>
                <button
                  disabled={!walletAddress || swap.isPending}
                  onClick={
                    walletAddress
                      ? () =>
                          swap.mutate({
                            amountIn: "1000000",
                            creator: walletAddress,
                            tickIndexInToOut: Long.fromNumber(0),
                            orderType: 1,
                            receiver: walletAddress,
                            tokenIn: token0,
                            tokenOut: token1,
                          })
                      : undefined
                  }
                >
                  swap 1,000,000 {token0}
                </button>
              </td>
              <td style={{ padding: 5 }}>
                <button
                  disabled={!walletAddress || swap.isPending}
                  onClick={
                    walletAddress
                      ? () =>
                          swap.mutate({
                            amountIn: "1000000",
                            creator: walletAddress,
                            tickIndexInToOut: Long.fromNumber(0),
                            orderType: 1,
                            receiver: walletAddress,
                            tokenIn: token1,
                            tokenOut: token0,
                          })
                      : undefined
                  }
                >
                  swap 1,000,000 {token1}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
