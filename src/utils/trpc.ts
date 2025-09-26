import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../server/routers/index"
import { createWSClient, wsLink, httpBatchLink, splitLink, loggerLink } from '@trpc/client';
import superjson from 'superjson';
import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";


// async function getEndingLink() {
//   if (typeof window === "undefined") {
//     // SSR / Node.js → no WebSockets
//     return httpBatchLink({
//       url: "http://localhost:3000/api/trpc", // use full URL on server
//     });
//   }

//   const session = await getSession();
//   // const token = localStorage.setItem("token", session.accessToken); // set this after login
//   // const token = await getToken({ req: undefined, secret: process.env.NEXTAUTH_SECRET });

//   // Client-side → can use WebSocket for subscriptions
//   const wsClient = createWSClient({
//     // url: "ws://localhost:3000/api/trpc",
//     url: "ws://localhost:3001",

//     connectionParams: async () => {
//       // const token = await getToken({ secret: process.env.NEXTAUTH_SECRET });
//       const session = await getSession();
//       // return { token };     // send the JWT under "token"
//       return {
//         authToken: session?.user?.id || "", // just send the user ID or JWT string
//       };
//     },

//   });

//   return splitLink({
//     condition: (op) => op.type === "subscription",
//     true: wsLink({
//       client: wsClient
//     }),
//     false: httpBatchLink({
//       url: "/api/trpc", // relative path is fine in browser,
//       transformer: superjson,
//     }),
//   });
// }

let endingLink;
if (typeof window === "undefined") {
  endingLink = httpBatchLink({ url: "http://localhost:3000/api/trpc" });
} else {
  const wsClient = createWSClient({
    url: "ws://localhost:3001",
    connectionParams: async () => {
      const session = await getSession();
      return { authToken: session?.user?.id || "" };
    },
  });

  endingLink = splitLink({
    condition: (op) => op.type === "subscription",
    true: wsLink({ client: wsClient }),
    false: httpBatchLink({ url: "/api/trpc", transformer: superjson }),
  });
}


export const trpc = createTRPCReact<AppRouter>({
  // export const trpc = createTRPCNext<AppRouter>({
  // ssr: false,
  config({ ctx }) {
    // config() {

    // const wsClient = typeof window !== 'undefined' ? createWSClient({
    //   url: 'ws://localhost:3001',
    // }) : null;

    return {

      // transformer: superjson,

      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error)
        }),

        // splitLink({
        //   condition: (op) => {
        //     return op.type === 'subscription'
        //   },
        //   // true: wsLink({ client: wsClient! }),
        //   true: wsLink({
        //     client: createWSClient({
        //       url: 'ws://localhost:3001'
        //     })
        //   }),
        //   false: httpBatchLink({
        //     transformer: superjson,
        //     url: '/api/trpc'
        //   }),
        // }),

        // getEndingLink()
      ],

      // queryClientConfig: {
      //   defaultOptions: {
      //     queries: {
      //       refetchOnWindowFocus: false
      //     }
      //   }
      // },

      queryClientConfig: {
        defaultOptions: { queries: { staleTime: 60 } }
      },

      // headers: () => {
      //   if (ctx?.req) {
      //     // on ssr, forward client's headers to the server
      //     return {
      //       ...ctx.req.headers,
      //       // 'x-ssr': '1',
      //     };
      //   }
      //   return {};
      // },

    }

  },
  transformer: superjson,

  ssr: false
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any)
