/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INDEXER_API: string;
  readonly VITE_PARENT_FRAME_ORIGIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
