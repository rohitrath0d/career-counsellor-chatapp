import { signIn, useSession } from "next-auth/react";
import ChatInterface from "../components/chat/chat-interface"
import { useRouter } from "next/router";
import { useEffect } from "react";
// import { TRPCProvider } from "@/utils/trpcProvider";

export default function ChatPage() {

  const { data: session, status } = useSession();
  console.log("session data:", session)

  // const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // signIn(); // redirect to /auth
      return
    }
  }, [status]);


  // if (status === "loading") return <div>Loading...</div>;
  if (!session) {
    // redirect to /auth if not logged in
    // if (typeof window !== "undefined") window.location.href = "/auth";
    // router.push("/auth"); // redirect to auth if not logged in

    // return null;
    return <ChatInterface /> // force render for now
  }

  // session exists, safe to render TRPC queries
  // return
  return (
    <div>
      <ChatInterface />
    </div>
  )

}
