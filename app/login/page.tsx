"use client";

import { supabase } from "@/utils/supabase/client";
import { ArrowRight, CheckCircle2, Globe, Loader2, Lock, Shield, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";
  const message = searchParams.get("message");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push(redirectPath);
      }
      setCheckedSession(true);
    };

    checkSession();

    const { data: { subscription } } = supabase ? supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          router.push(redirectPath);
        }
      }
    ) : { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      subscription.unsubscribe();
    };
  }, [router, redirectPath]);

  const handleGoogleLogin = async () => {
    if (!supabase) return;
    setIsAuthenticating(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
          queryParams: {
            prompt: "select_account",
          },
        },
      });
      
      if (error) throw error;
    } catch (error) {
      console.error("Auth error:", error);
      setIsAuthenticating(false);
    }
  };

  if (!checkedSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }


  return (
    <>
      {/* SEO Metadata & JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Sign In - Invoice Quickly",
            "description": "Securely log in to manage your professional invoices and business dashboard.",
            "url": `${window?.location?.origin || 'https://invoice-quickly.com'}/login`
          })
        }}
      />

      <main className="min-h-[calc(100vh-64px)] flex flex-col lg:flex-row bg-white dark:bg-[#0A0A0A] font-sans selection:bg-blue-500/30">
        
        {/* LEFT SIDE: Clean Marketing / SEO Area */}
        {/* Completely smooth, no grids, no clutter */}
        <aside className="hidden lg:flex flex-1 flex-col justify-center items-center lg:items-end py-16 px-8 lg:pr-16 xl:pr-24 relative overflow-hidden bg-zinc-50 dark:bg-zinc-900/40 border-r border-zinc-100 dark:border-zinc-800/60">
          
          {/* Subtle Ambient Glows - very soft, not noisy */}
          <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-blue-100/50 dark:bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-indigo-100/50 dark:bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 w-full max-w-[480px]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-800/50 shadow-sm border border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 text-[11px] font-bold uppercase tracking-wider mb-8">
              <Zap className="w-3.5 h-3.5 text-blue-500" /> Start completely free
            </div>

            <h2 className="text-4xl xl:text-[44px] font-bold text-zinc-900 dark:text-white tracking-tight leading-[1.15] mb-6">
              The smartest way to format your invoices.
            </h2>
            
            <article className="prose prose-zinc dark:prose-invert">
              <p className="text-[16px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Invoice Quickly is the industry-leading <strong>professional invoice generator</strong>. Trusted by thousands of freelancers, agencies, and small businesses to create stunning PDF invoices, manage billing, and track payments globally.
              </p>
            </article>

            {/* Feature list - Clean and spacious */}
            <div className="mt-12 space-y-5">
              {[
                "Generate limitless professional PDF invoices with custom branding",
                "Advanced cloud storage & secure client management dashboard",
                "Multi-currency support for expanding global businesses"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-[14.5px] font-medium text-zinc-700 dark:text-zinc-300 leading-snug">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Trust indicators - Ultra minimal */}
            <div className="mt-16 flex items-center gap-10 opacity-60">
              <div className="flex items-center gap-2" title="Bank-grade 256-bit encryption">
                <Lock className="w-4 h-4 text-zinc-500" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Secure</span>
              </div>
              <div className="flex items-center gap-2" title="Available in over 150 countries">
                <Globe className="w-4 h-4 text-zinc-500" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Global</span>
              </div>
              <div className="flex items-center gap-2" title="99.99% Guaranteed Server Uptime">
                <Shield className="w-4 h-4 text-zinc-500" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Reliable</span>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT SIDE: Minimalist Auth Section */}
        <section className="flex-1 flex flex-col justify-center items-center lg:items-start py-16 px-6 lg:pl-16 xl:pl-24 z-10 relative">
          <div className="w-full max-w-[380px] animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            <header className="mb-10 lg:mb-12 flex flex-col items-center lg:items-start text-center lg:text-left">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-8 group transition-opacity hover:opacity-80" aria-label="Go to Homepage">
                <ShieldCheck className="w-7 h-7 text-blue-600 dark:text-blue-500" />
                <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Invoice<span className="text-blue-600 dark:text-blue-500">Quickly</span>
                </span>
              </Link>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
                Welcome back
              </h1>
              <p className="text-[15px] text-zinc-500 dark:text-zinc-400">
                Log in to securely manage your invoices and clients.
              </p>
            </header>

            <form onSubmit={(e)=>e.preventDefault()} className="space-y-6">
              {message && (
                <div role="alert" className="p-4 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm border border-orange-100 dark:border-orange-500/20 font-medium">
                  {message}
                </div>
              )}

              <button
                onClick={handleGoogleLogin}
                disabled={isAuthenticating}
                aria-label="Securely log in with your Google Workspace or personal account"
                title="Single Sign-On with Google"
                className="w-full group relative flex items-center justify-center h-[52px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-xl font-medium text-[15px] transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {isAuthenticating ? (
                  <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                ) : (
                  <>
                    <div className="absolute left-4">
                       <GoogleIcon />
                    </div>
                    <span>Continue with Google</span>
                    <ArrowRight className="absolute right-4 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-zinc-400" />
                  </>
                )}
              </button>
            </form>

            <footer className="mt-8 text-center lg:text-left">
               <p className="text-[13px] text-zinc-500 dark:text-zinc-500">
                 By continuing, you agree to our <Link href="/terms" className="text-zinc-800 dark:text-zinc-300 hover:underline hover:text-blue-600 transition-colors">Terms</Link> and <Link href="/privacy-policy" className="text-zinc-800 dark:text-zinc-300 hover:underline hover:text-blue-600 transition-colors">Privacy Policy</Link>.
               </p>
            </footer>
          </div>
        </section>

      </main>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
