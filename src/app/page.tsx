import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, BrainCircuit, Rocket, Zap, CheckCircle2 } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const { userId } = await auth();
  
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">CourseCraft</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md transition-all hover:scale-105 active:scale-95">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>
          
          <div className="container mx-auto px-4 relative z-10 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 mx-auto mb-4">
              <Zap className="w-4 h-4 mr-1 fill-current" /> v1.0 is now live
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
              Revolutionize your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Course Creation</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Delivering engaging and high-quality courses in minutes with our AI-powered App. Turn your ideas into structured, professional curricula instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/sign-up">
                <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 group">
                  Start Building for Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="pt-10 flex items-center justify-center gap-8 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> No credit card required</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> AI-generated outlines</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Export anywhere</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-slate-100/50 dark:bg-slate-900/20 border-y">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to launch faster</h2>
              <p className="text-lg text-muted-foreground">CourseCraft handles the heavy lifting of curriculum design so you can focus on sharing your expertise.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-background p-8 rounded-2xl shadow-sm border group hover:shadow-md transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Curriculum Generation</h3>
                <p className="text-muted-foreground leading-relaxed">Simply provide a topic and our advanced AI will structure a complete course outline with chapters and lessons.</p>
              </div>
              
              <div className="bg-background p-8 rounded-2xl shadow-sm border group hover:shadow-md transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Customizable Tones</h3>
                <p className="text-muted-foreground leading-relaxed">Whether you want an academic, professional, or friendly tone, CourseCraft adapts to your specific audience.</p>
              </div>
              
              <div className="bg-background p-8 rounded-2xl shadow-sm border group hover:shadow-md transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Rocket className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Publishing</h3>
                <p className="text-muted-foreground leading-relaxed">Upload banners, tweak your generated outlines, and publish your course to your dashboard in seconds.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-600 dark:bg-indigo-900"></div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to create your first course?</h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Join thousands of creators using CourseCraft to build high-quality educational content in record time.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="h-14 px-8 text-lg bg-white text-indigo-600 hover:bg-slate-100 rounded-full shadow-xl transition-all hover:scale-105">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <BrainCircuit className="h-5 w-5 text-indigo-600" />
            <span className="font-semibold text-foreground">CourseCraft</span>
          </div>
          <p>© {new Date().getFullYear()} CourseCraft Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
