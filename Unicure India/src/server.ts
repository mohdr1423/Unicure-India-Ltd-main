import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

const startHandler = createStartHandler(defaultStreamHandler);

export default {
  async fetch(request: Request, env?: unknown, ctx?: unknown) {
    try {
      const response = await startHandler(request);
      return response;
    } catch (error) {
      console.error("[TanStack Start SSR Fatal Error]", error);
      throw error;
    }
  },
};

