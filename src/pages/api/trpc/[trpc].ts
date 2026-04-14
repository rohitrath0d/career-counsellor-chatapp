import { NextApiRequest, NextApiResponse } from 'next';
import { } from 'next';
import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/routers/index"
import { createContext } from "../../../server/context/context"

// export default createNextApiHandler({
//   router: appRouter,
//   createContext,
// });

// export API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  return trpcNext.createNextApiHandler({
    router: appRouter,                // appRouter is your main router that combines all sub-routers (chat, user, etc.).
    createContext,                    // // createContext injects prisma and session into every procedure.
    onError({ error }) {
      if (error.code === "INTERNAL_SERVER_ERROR") {
        console.error("Something went wrong", error);
      }
    },
  })(req, res);

}

