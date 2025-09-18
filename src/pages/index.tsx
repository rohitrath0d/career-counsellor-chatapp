// import Image from "next/image";
// import { Geist, Geist_Mono } from "next/font/google";
// "use client"

import CounsellingAimation from "@/components/animations/CounsellingAnimation"
// import { useRouter } from "next/router";
// import { useEffect } from "react";

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, MessageCircle, Brain, Target, TrendingUp, Sparkles } from "lucide-react"
import Link from "next/link"

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export default function Home() {

//   const router = useRouter();

//   useEffect(() => {
//     router.push("/auth");
//   }, [router]);


//   return (


//     <p>
//     Redirecting....
//     </p>
//   );
// }




export default function HomePage() {


  // const router = useRouter();

  // useEffect(() => {
  //   router.push("/auth");
  // }, [router]);


  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-cyan-50/30 to-pink-50/20 dark:from-background dark:via-cyan-950/20 dark:to-pink-950/10">
      {/* Hero Section */}
      {/* <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Career Guidance
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6">
            Your Career Journey
            <span className="bg-gradient-to-r from-cyan-600 to-pink-600 bg-clip-text text-transparent">
              {" "}
              Reimagined
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground text-balance mb-8 leading-relaxed">
            Meet your AI career counselor that understands your ambitions, analyzes your strengths, and guides you
            toward meaningful professional growth with personalized insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {/* <Link href="/chat"> */}
      {/* <Link href="/auth">
              <Button className="gradient-button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-medium transition-all disabled:pointer-events-none disabled:opacity-50 px-8 py-6 shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg border-2 border-cyan-600 text-cyan-700 hover:bg-cyan-50 dark:border-cyan-400 dark:text-cyan-300 dark:hover:bg-cyan-950/20 transition-all duration-300 bg-transparent"
            >
              Watch Demo
            </Button>
          </div>
        </div> */}

      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Text Column */}
          <div className="flex-1 max-w-xl text-left">
            <div className="inline-flex items-center gap-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-6 ml-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered Career Guidance
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6 ml-8">
              Your Career Journey
              <span className="bg-gradient-to-r from-cyan-600 to-pink-600 bg-clip-text text-transparent">
                {" "}Reimagined
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground text-balance mb-8 leading-relaxed ml-8">
              Meet your AI career counselor that understands your ambitions, analyzes your strengths, and guides you
              toward meaningful professional growth with personalized insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth">
                <Button className="gradient-button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-medium transition-all disabled:pointer-events-none disabled:opacity-50 px-8 py-6 shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ml-8">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg border-2 border-cyan-600 text-cyan-700 hover:bg-cyan-50 dark:border-cyan-400 dark:text-cyan-300 dark:hover:bg-cyan-950/20 transition-all duration-300 bg-transparent"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right Animation Column */}
          <div className="flex-1 ml-10">
            {/* <Lottie animationData={careerAnimation} loop={true} /> */}
            <CounsellingAimation />
          </div>
        </div>


        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-15 mb-20">
          <Card className="p-8 text-center border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Intelligent Analysis</h3>
            <p className="text-muted-foreground leading-relaxed">
              Advanced AI analyzes your skills, experience, and goals to provide tailored career recommendations that
              align with your unique profile.
            </p>
          </Card>

          <Card className="p-8 text-center border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Personalized Guidance</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get specific, actionable advice on resume optimization, interview preparation, skill development, and
              strategic career moves.
            </p>
          </Card>

          <Card className="p-8 text-center border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Growth Tracking</h3>
            <p className="text-muted-foreground leading-relaxed">
              Monitor your professional development with continuous conversations that adapt and evolve as your career
              progresses.
            </p>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-pink-600 rounded-3xl p-12 text-white text-center mb-20 m-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Empowering Career Success</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10+</div>
              <div className="text-cyan-100">Career Conversations</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
              <div className="text-cyan-100">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-cyan-100">Available Support</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have discovered their true potential with AI-powered career guidance.
          </p>
          <Link href="/chat">
            <Button className="gradient-button-cta inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-medium transition-all disabled:pointer-events-none disabled:opacity-50 px-12 py-6 shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2">
              <MessageCircle className="mr-2 w-5 h-5" />
              Start Chatting Now
            </Button>
          </Link>
        </div>
      </div>
    </main >
  )
}
