import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../server/routers/index"
import { createWSClient, wsLink, httpBatchLink, splitLink, loggerLink, httpSubscriptionLink } from '@trpc/client';
import superjson from 'superjson';
import { getSession } from "next-auth/react";

// let endingLink;
// if (typeof window === "undefined") {
//   endingLink = httpBatchLink({ url: "http://localhost:3000/api/trpc" });
// } else {
//   const wsClient = createWSClient({
//     url: "ws://localhost:3001",
//     connectionParams: async () => {
//       const session = await getSession();
//       return { authToken: session?.user?.id || "" };
//     },
//   });

//   endingLink = splitLink({
//     condition: (op) => op.type === "subscription",
//     true: wsLink({ client: wsClient }),
//     false: httpBatchLink({ url: "/api/trpc", transformer: superjson }),
//   });
// }


export const trpc = createTRPCReact<AppRouter>();

// export const trpcClient = trpc.createClient({

//   config({ ctx }) {


//     return {

//       // transformer: superjson,

//       links: [
//         // adds pretty logs to your console in development and logs errors in production
//         loggerLink({
//           enabled: (opts) =>
//             process.env.NODE_ENV === 'development' ||
//             (opts.direction === 'down' && opts.result instanceof Error)
//         }),

//         // splitLink({
//         //   condition: (op) => {
//         //     return op.type === 'subscription'
//         //   },
//         //   // true: wsLink({ client: wsClient! }),
//         //   true: wsLink({
//         //     client: createWSClient({
//         //       url: 'ws://localhost:3001'
//         //     })
//         //   }),
//         //   false: httpBatchLink({
//         //     transformer: superjson,
//         //     url: '/api/trpc'
//         //   }),
//         // }),

//         // getEndingLink()

//         httpBatchLink({
//           url: typeof window === "undefined"
//             ? "http://localhost:3000/api/trpc" // SSR
//             : "/api/trpc",                     // Browser
//           transformer: superjson,
//         }),

//       ],

//       queryClientConfig: {
//         defaultOptions: { queries: { staleTime: 60 } }
//       },

//     }

//   },
//   transformer: superjson,

//   ssr: false
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
// } as any)


export const trpcClient = trpc.createClient({
  links: [
    loggerLink({ enabled: () => true }),
    splitLink({
      // uses the httpSubscriptionLink for subscriptions
      condition: (op) => op.type === 'subscription',
      true: httpSubscriptionLink({
        url: `/api/trpc`,
      }),
      false: httpBatchLink({
        url: `/api/trpc`,
      }),
    }),
  ],
});