import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
// import { Card, CardContent } from "@/components/ui/card";
import { Card, CardContent } from "../components/ui/card"
// import { Input } from "@/components/ui/input";
import { Input } from "../components/ui/input"
// import { Button } from "@/components/ui/button";
import { Button } from "../components/ui/button"
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
// import Lottie from "react-lottie-player";
// import LoginAnimation from "@/components/animations/LoginAnimation"; // put a JSON Lottie file here
import LoginAnimation from "../components/animations/LoginAnimation";
// import { trpc } from "@/utils/trpc";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";



type AuthForm = {
  email: string;
  password: string;
  name?: string;
};



export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  // const [loading, setLoading] = useState(false);
  const router = useRouter();


  const form = useForm<AuthForm>({
    defaultValues: { email: "", password: "", name: "" },
  });


  // tRPC mutations
  // const loginMutation = trpc.user.login.useMutation({
  //   onSuccess: (user) => {
  //     toast.success(`Welcome back, ${user.name}`);
  //     localStorage.setItem("user", JSON.stringify(user));
  //     // window.location.href = "/";
  //     // window.location.href = "/chat";
  //     router.push("/chat")
  //   },
  //   onError: (err) => toast.error(err.message),
  // });

  const signupMutation = trpc.user.signup.useMutation({
    onSuccess: (user) => {
      toast.success(`Account created for ${user.name}`);
      setMode("login");
      // router.push("/chat"); // <-- optional: auto-login & redirect
    },
    onError: (err) => toast.error(err.message),
  });

  // Handle credentials login/signup
  // const onSubmit = async (data: AuthForm) => {
  //   setLoading(true);

  //   try {
  //     if (mode === "login") {
  //       const res = await signIn("credentials", {
  //         redirect: false,
  //         email: data.email,
  //         password: data.password,
  //         name: data.name
  //       });

  //       if (res?.error) {
  //         toast.error("Login failed", { description: res.error });
  //       } else {
  //         toast.success("Welcome back!", { description: "Logged in successfully" });
  //         window.location.href = "/";
  //       }
  //     }
  //     // this part  of /sign up is handled automatically via authorize() in [...nextauth].ts
  //     // else {
  //     //   // Signup first (your API to create user)
  //     //   const res = await fetch("/api/auth/signup", {
  //     //     method: "POST",
  //     //     headers: { "Content-Type": "application/json" },
  //     //     body: JSON.stringify(data),
  //     //   });

  //     //   if (!res.ok) {
  //     //     const err = await res.json();
  //     //     throw new Error(err.message || "Signup failed");
  //     //   }

  //     //   toast.success("Account created", { description: "You can now log in" });
  //     //   setMode("login");
  //     // }
  //   } catch (err: any) {
  //     toast.error("Error", { description: err.message });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onSubmit = async (data: AuthForm) => {
    // if (mode === "login") loginMutation.mutate({
    //   email: data.email,
    //   password: data.password
    // });
    if (mode === "login") {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (res?.error) toast.error(res.error);

      else router.push("/chat"); // redirect after login
    }
    else {
      await signupMutation.mutateAsync({
        email: data.email,
        password: data.password,
        name: data.name!
      });
      setMode("login");
      toast.success("Account created, please login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden rounded-2xl shadow-xl">
        {/* Left - Animation */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 w-1/2 p-8 rounded-2xl ml-5">
          {/* <Lottie
            loop
            animationData={LoginAnimation}
            play
            style={{ width: "100%", height: "80%" }}
          /> */}
          <LoginAnimation />
        </div>

        {/* Right - Form */}
        <CardContent className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
            {mode === "login"
              ? "Welcome Back"
              : "Create Account"
            }
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {mode === "login"
              ? "Sign in to your account"
              : "Sign up to get started"
            }
          </p>

          {/* Google OAuth */}
          <Button
            type="button"
            variant="outline"
            className="mb-4 w-full flex items-center justify-center gap-2 py-5 border-gray-300 hover:bg-gray-50 transition-colors"
            onClick={() => signIn("google")}
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="py-5 px-4 border-gray-300"
                  {...form.register("name")}
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="py-5 px-4 border-gray-300"
                {...form.register("email")}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="py-5 px-4 border-gray-300"
                {...form.register("password")}
              />
            </div>

            <Button
              type="submit"
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              // disabled={loading}
              // disabled={loginMutation.isPending || signupMutation.isPending}      // and can drop the extra loading state entirely, since useMutation already tracks it automatically.
              disabled={signupMutation.isPending || signupMutation.isPending}      // and can drop the extra loading state entirely, since useMutation already tracks it automatically.
            >
              {/* {loading ? "Processing..." : mode === "login" ? "Login" : "Sign Up"} */}
              {/* {loginMutation.isPending || signupMutation.isPending */}
              {signupMutation.isPending || signupMutation.isPending
                ? "Processing..."
                : mode === "login"
                  ? "Login"
                  : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {mode === "login" ? (
                <>
                  Don’t have an account?{" "}
                  <Button
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    onClick={() => setMode("signup")}
                  >
                    Sign up
                  </Button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Button
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    onClick={() => setMode("login")}
                  >
                    Login
                  </Button>
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
