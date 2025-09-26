// provider is needed for the frontend to talk to your backend chatRouter in real time.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createWSClient,
  httpBatchLink,
  loggerLink,
  splitLink,
  wsLink,
  // createWSClient, 
  // wsLink, 
  // createTRPCClient
} from "@trpc/client";
import { ReactNode, useState } from "react";
import { trpc } from "./trpc";
// import superjson from "superjson"

export function TRPCProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  // const [trpcClient] = useState(() => trpc.createClient());
  // const [trpcClient] = useState(() => createTRPCClient());

  const opts = {
    links: [
      //   httpBatchLink({
      //     url: '/api/trpc',
      //   }),

      // wsLink({
      //   url: 'ws://localhost:3001',
      // }),

      loggerLink({ enabled: () => true }),
      typeof window === "undefined"
        ? httpBatchLink({ url: "http://localhost:3000/api/trpc" })
        : splitLink({
          condition: (op) => op.type === "subscription",
          true: wsLink({
            client: createWSClient({ url: "ws://localhost:3001" }),
          }),
          false: httpBatchLink({ url: "/api/trpc" }),
        }),

    ],
  };

  const trpcClient = trpc.createClient(opts);

  // const [trpcClient] = useState(() =>
  //   trpc.createClient({
  //     //  transformer: superjson,
  //     links: [
  //       httpBatchLink({
  //         // transformer: superjson,
  //         url: '/api/trpc',
  //       }),
  //     ],
  //   })
  // );


  // const [trpcClient] = useState(() =>
  //   trpc.createClient({
  //     // on tRPC v10.45+ (or higher). In these versions the transformer no longer goes on createClient, it must be passed directly into the link (like httpBatchLink).
  //     // transformer: superjson,   //required for matching backend     
  //     links: [
  //       // httpBatchLink({
  //       //   url: "/api/trpc",       //  matches API route: pages/api/trpc/[trpc].ts

  //       //   // Before: transformer was at the top level of createClient.
  //       //   // Now: transformer must be passed into the specific link (httpBatchLink, wsLink, etc.).
  //       //   transformer: superjson,   // required for matching backend
  //       // }),

  //       typeof window === "undefined"
  //         ? httpBatchLink({
  //           // url: "http://localhost:3000/api/trpc",
  //           url: '/api/trpc',
  //           // transformer: superjson,
  //         })
  //         : wsLink({
  //           client: createWSClient({
  //             url: "ws://localhost:3001", // your WS server
  //           }),
  //           // transformer: superjson,

  //         }),
  //     ],
  //   })
  // );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
