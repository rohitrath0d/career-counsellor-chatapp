import { createTRPCReact } from "@trpc/react-query";
// import type { AppRouter } from "@/server/routers/index";
import type { AppRouter } from "../server/routers/index"
// import { createTRPCNext } from '@trpc/next';
// import { httpBatchLink } from '@trpc/client';
import { createWSClient, wsLink, httpBatchLink, splitLink } from '@trpc/client';
import superjson from 'superjson';


export const trpc = createTRPCReact<AppRouter>();
// export const trpc = createTRPCNext<AppRouter>({
//   config() {
//     return {
//       transformer: superjson,
//       links: [
//         httpBatchLink<AppRouter>({
//           url: '/api/trpc',
//         }),
//       ],
//     };
//   },
//   ssr: false,
// });


// Create a WebSocket client that can switch between HTTP and WS
// export const createTRPCClient = () => {
//   const links = [];

//   // const wsClient = typeof window !== 'undefined' ? createWSClient({
//   //   url: 'ws://localhost:3001',
//   // }) : null;

//   // return trpc.createClient({
//   //   // transformer: superjson,
//   //   links: [
//   //     // Use WebSocket for subscriptions, HTTP for queries/mutations
//   //     typeof window !== 'undefined' && wsClient
//   //       ? wsLink({
//   //           client: wsClient,
//   //         })
//   //       : httpBatchLink({
//   //           url: '/api/trpc',
//   //           transformer: superjson,
//   //         }),
//   //   // ].filter(Boolean) as any,
//   //   ].filter(Boolean),
//   // });


//   if (typeof window !== 'undefined') {
//     // Client-side: try to create WebSocket client
//     try {
//       const wsClient = createWSClient({
//         url: 'ws://localhost:3001',
//       });

//       links.push(
//         splitLink({
//           condition: (op) => op.type === 'subscription',
//           true: wsLink({ client: wsClient }),
//           false: httpBatchLink({
//             url: '/api/trpc',
//             transformer: superjson,
//           }),
//         })
//       );
//     } catch (error) {
//       console.warn('WebSocket client creation failed, falling back to HTTP', error);
//       links.push(httpBatchLink({ url: '/api/trpc' }));
//     }
//   } else {
//     // Server-side: use HTTP only
//     links.push(httpBatchLink({ url: '/api/trpc' }));
//   }

//   return trpc.createClient({
//     // transformer: superjson,
//     links: links,
//   });

// };

// Simple HTTP client without WebSocket for now
// export const createTRPCClient = () => {
//   return trpc.createClient({
//     transformer: superjson,
//     links: [
//       httpBatchLink({
//         url: '/api/trpc',
//       }),
//     ],
//   });
// };