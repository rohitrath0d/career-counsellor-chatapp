import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import "@/styles/globals.css";
import { TRPCProvider } from "@/utils/trpcProvider";
import { ThemeProvider } from "@/components/theme/theme-provider";


export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // avoid recreating QueryClient on every render
  const [queryClient] = useState(() => new QueryClient());

  // return <Component {...pageProps} />;
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <TRPCProvider>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
        </TRPCProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
