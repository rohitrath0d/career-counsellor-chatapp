import { useEffect } from "react";
import { ChatInterface } from "../components/chat/chat-interface"
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

export default function ChatPage() {
  // console.log("[v0] ChatPage rendering")

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // router.replace("/auth");
      signIn();     // redirect to /auth
      return;
    }
  }, [status, router]);

   if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-muted-foreground font-bold text-2xl">Checking authentication...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="h-screen w-full bg-background overflow-hidden">
      <ChatInterface />
    </main>
  )
}
