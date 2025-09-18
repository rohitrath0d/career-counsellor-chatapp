import { signIn, useSession } from "next-auth/react";
import ChatInterface from "../components/chat/chat-interface"
import { useRouter } from "next/router";
import { useEffect } from "react";
// import { TRPCProvider } from "@/utils/trpcProvider";
// import AuthPage from "./auth";

export default function ChatPage() {

  const { data: session, status } = useSession();
  console.log("session data:", session)

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // signIn(); // redirect to /auth
      router.replace("/auth")
      // return
    }
  }, [status, router]);


  // if (status === "loading") return <div>Loading...</div>;

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    )
  }


  // if (!session) {
  //   // redirect to /auth if not logged in
  //   // if (typeof window !== "undefined") window.location.href = "/auth";
  //   // router.push("/auth"); // redirect to auth if not logged in

  //   // return null;
  //   // return <ChatInterface /> // force render for now
  //   // return <AuthPage />
  //   router.push("/auth");
  //   return null;        // avoid rendering anything until redirect happens

  // }

  if (!session) {
    return null // nothing shown while redirecting
  }

  // session exists, safe to render TRPC queries
  // return
  return (
    <div>
      {/* <TRPCProvider>

      <ChatInterface />
      </TRPCProvider>
    </div> */}

      <main className="h-screen bg-background">
        <ChatInterface />
      </main>

    </div>
  )
}