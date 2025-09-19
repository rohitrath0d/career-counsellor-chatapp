import { createTRPCReact } from "@trpc/react-query";
// import type { AppRouter } from "@/server/routers/index";
import type { AppRouter } from "../server/routers/index"
// import { createTRPCNext } from '@trpc/next';
// import { httpBatchLink } from '@trpc/client';
// import superjson from 'superjson';
// import { createWSClient, wsLink, httpBatchLink } from '@trpc/client';


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

