import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import "@/styles/globals.css";


export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // avoid recreating QueryClient on every render
  const [queryClient] = useState(() => new QueryClient());

  // return <Component {...pageProps} />;
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
