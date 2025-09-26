import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css"
import { TRPCProvider } from "../utils/trpcProvider"
import { ThemeProvider } from "../components/theme/theme-provider"


export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // avoid recreating QueryClient on every render
  // const [queryClient] = useState(() => new QueryClient());

  return (
    // QueryClientProvider must wrap TRPCProvider, otherwise useQuery inside tRPC has no React Query context

    <SessionProvider session={session}>
      {/* <QueryClientProvider client={queryClient}> */}
      <TRPCProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Component {...pageProps} />
        </ThemeProvider>
      </TRPCProvider>
      {/* </QueryClientProvider> */}

    </SessionProvider>

  );
}



// Export the app wrapped with tRPC
// export default trpc.withTRPC(App);