import { useEffect, useState } from "react";
import { DualityFrontEndMessageWalletAddress } from "@duality-labs/duality-front-end-sdk";
import { frameClient } from "./useFrameClient";

export default function useFrameWalletAddress() {
  // subscribe data to a state
  const [address, setAddress] = useState<string | null>(null);
  useEffect(() => {
    return frameClient.subscribeToMessage<DualityFrontEndMessageWalletAddress>(
      "WalletAddress",
      (message) => setAddress(message.data),
    );
  }, [frameClient, setAddress]);

  return address;
}
