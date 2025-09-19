// import { createNextApiHandler } from "@trpc/server/adapters/next";
import * as trpcNext from "@trpc/server/adapters/next";
// import { appRouter } from "@/server/routers";
import { appRouter } from "../../../server/routers/index"
// import { createContext } from "@/server/context/context";
import { createContext } from "../../../server/context/context"

// export default createNextApiHandler({
//   router: appRouter,
//   createContext,
// });

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,                // appRouter is your main router that combines all sub-routers (chat, user, etc.).
  createContext,                    // // createContext injects prisma and session into every procedure.
  onError({ error }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      console.error("Something went wrong", error);   
    }
  },
});