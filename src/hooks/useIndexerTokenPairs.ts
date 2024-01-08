import { useMemo } from "react";
import { useIndexerStreamOfSingleDataSet } from "@duality-labs/duality-front-end-sdk";

const { VITE_INDEXER_API = "" } = import.meta.env;

type TokenPairReserves = [
  token0: string,
  token1: string,
  reserve0: number,
  reserve1: number,
];
type DataRow = [index: number, values: TokenPairReserves];

type TokenPairsState = {
  data: TokenPairReserves[] | undefined;
  error: Error | null;
};

export default function useTokenPairs(): TokenPairsState {
  const { data, error } = useIndexerStreamOfSingleDataSet<DataRow>(
    `${VITE_INDEXER_API}/liquidity/pairs`,
  );

  const values: TokenPairReserves[] | undefined = useMemo(() => {
    if (data) {
      const values = Array.from(data)
        .sort(([a], [b]) => a - b)
        .map((row) => row[1]);
      return values;
    }
  }, [data]);

  // return state
  return { data: values, error: error || null };
}
