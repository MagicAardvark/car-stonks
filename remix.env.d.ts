/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />

import "@remix-run/dev";
import type { AppLoadContext as RemixAppLoadContext } from "@remix-run/server-runtime";

declare module "@remix-run/server-runtime" {
  interface AppLoadContext extends RemixAppLoadContext {
    // Add your context here
  }
}
