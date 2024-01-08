import { useMemo } from "react";
import { DexFrameClient } from "@duality-labs/duality-front-end-sdk";

// note: you shouldn't whitelist a production origin by a query param
//       that's a bit insecure
const queryParams = new URLSearchParams(location.search);
const parentOriginParam = queryParams.get("parentOrigin") ?? "";
const { VITE_PARENT_FRAME_ORIGIN: parentOrigin = parentOriginParam } =
  import.meta.env;

function createFrameClientWithHeight(allowedOrigin = parentOrigin) {
  const frameClient = new DexFrameClient(allowedOrigin);
  // hook height into root React element
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      frameClient.updateFrameHeight(entry.target.clientHeight);
    }
  });
  const rootElement = document.getElementById("root");
  if (rootElement) {
    resizeObserver.observe(rootElement);
  }
  return frameClient;
}

// export frameClient singleton so that height updates are computed only once
export const frameClient = createFrameClientWithHeight();

// alternative to using frameClient (from frames/client) directly, probably not needed
export default function useFrameClient(allowedOrigin?: string) {
  return useMemo(
    () => createFrameClientWithHeight(allowedOrigin),
    [allowedOrigin],
  );
}
