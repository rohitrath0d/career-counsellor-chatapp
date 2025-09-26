// provider is needed for the frontend to talk to your backend chatRouter in real time.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { ReactNode, useState } from "react";
import { trpc, trpcClient } from "./trpc";
// import superjson from "superjson"

export function TRPCProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  // const [trpcClient] = useState(() => trpc.createClient());
  // const [trpcClient] = useState(() => createTRPCClient());

  // const opts = {
  //   links: [
  //     //   httpBatchLink({
  //     //     url: '/api/trpc',
  //     //   }),

  //     // wsLink({
  //     //   url: 'ws://localhost:3001',
  //     // }),

  //     loggerLink({ enabled: () => true }),
  //     typeof window === "undefined"
  //       ? httpBatchLink({ url: "http://localhost:3000/api/trpc" })
  //       : splitLink({
  //         condition: (op) => op.type === "subscription",
  //         true: wsLink({
  //           client: createWSClient({ url: "ws://localhost:3001" }),
  //         }),
  //         false: httpBatchLink({ url: "/api/trpc" }),
  //       }),

  //   ],
  // };

  // const trpcClient = trpc.createClient({
  //   links: [
  //     // Logger link
  //     loggerLink({
  //       enabled: () => true, // or use process.env.NODE_ENV === "development"
  //     }),
  //     // HTTP link
  //     httpBatchLink({
  //       url: typeof window === "undefined"
  //         ? "http://localhost:3000/api/trpc" // SSR
  //         : "/api/trpc",
  //       // transformer: superjson,
  //     }),
  //   ],
  // });

  // const trpcClient = trpc.createClient(opts);


  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
