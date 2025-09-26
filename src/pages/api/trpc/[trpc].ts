import { NextApiRequest, NextApiResponse } from 'next';
import { } from 'next';
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
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // handling cors preflight error because of frontend (Unsupported GET-request to mutation procedures)
  // if (req.method === 'OPTIONS') {
  //   res.setHeader('Access-Control-Allow-Origin', 'POST, GET, OPTIONS')
  //   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  //   res.setHeader('Access-Control-Max-Age', '86400');
  //   return res.status(200).end();
  // }


  // // Only allow POST requests for tRPC mutations
  // if (req.method !== 'POST') {
  //   return res.status(405).json({ message: 'Method not allowed' });
  // }

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

