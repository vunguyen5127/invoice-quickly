import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Zap, Shield, Globe, Users, Clock, Sparkles, Send, CreditCard } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32 sm:pt-32 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Background Gradients */}
        <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl pointer-events-none sm:top-[-20rem]">
          <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 dark:opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem] blur-3xl" />
        </div>
        
        <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl pointer-events-none">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 dark:opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem] blur-3xl" />
        </div>

        <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 mb-8 border border-blue-200/80 dark:border-blue-800/50 gap-2 shadow-sm">
          <Sparkles className="w-4 h-4" />
          Free Forever — No Credit Card Required
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-8 max-w-4xl leading-[1.1]">
          Create Professional Invoices in{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Seconds
          </span>
        </h1>
        
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-12 leading-relaxed">
          The fastest way to generate beautiful, PDF-ready invoices. Manage your companies, track invoices, and share with clients — all from one elegant dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link 
            href="/generator"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white transition-all bg-blue-600 rounded-full hover:bg-blue-700 hover:scale-105 shadow-lg hover:shadow-blue-500/25 active:scale-95"
          >
            Create Invoice Free
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-zinc-700 transition-all bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:text-zinc-300 hover:scale-105 shadow-sm"
          >
            Sign In to Dashboard
          </Link>
        </div>

        {/* Social Proof Stats */}
        <div className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-6">
          <StatItem value="10,000+" label="Invoices Created" />
          <StatItem value="20+" label="Languages Supported" />
          <StatItem value="100%" label="Free to Use" />
        </div>

        {/* Abstract Preview Image / Floating Card */}
        <div className="mt-20 sm:mt-24 relative w-full max-w-5xl mx-auto drop-shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-zinc-950 via-transparent to-transparent z-10 top-1/2"></div>
          <div className="relative rounded-t-2xl sm:rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 p-2 shadow-2xl overflow-hidden ring-1 ring-zinc-900/5 backdrop-blur-3xl">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="h-5 w-48 bg-zinc-100 dark:bg-zinc-800 rounded-md text-xs flex items-center justify-center text-zinc-400">invoicequickly.com/generator</div>
              </div>
            </div>
            {/* Mockup inside representing invoice builder */}
            <div className="bg-zinc-50 dark:bg-black w-full h-[400px] rounded-b-xl flex p-6 gap-6">
               <div className="w-1/3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-4 hidden md:flex flex-col gap-4">
                  <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                  <div className="h-10 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-md mt-4"></div>
                  <div className="h-10 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-md"></div>
                  <div className="h-10 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-md"></div>
                  <div className="h-24 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-md mt-auto"></div>
               </div>
               <div className="flex-1 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-8 flex flex-col shadow-blue-500/5">
                  <div className="flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-6">
                    <div>
                      <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-700 rounded-md mb-2"></div>
                      <div className="h-4 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-md"></div>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full"></div>
                  </div>
                  <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded-md mb-3"></div>
                  <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded-md mb-3"></div>
                  <div className="h-4 w-2/3 bg-zinc-100 dark:bg-zinc-800 rounded-md mb-6"></div>
                  <div className="mt-auto flex justify-end">
                    <div className="h-10 w-28 bg-blue-600 rounded-lg"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white dark:bg-zinc-900 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Three steps to get paid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200 dark:from-blue-800 dark:via-indigo-800 dark:to-violet-800"></div>
            
            <StepCard
              number="01"
              title="Fill in your details"
              description="Enter your company info and client details. Our smart form auto-fills from your saved companies."
              icon={<FileText className="w-5 h-5" />}
            />
            <StepCard
              number="02"
              title="Preview in real-time"
              description="See your invoice update live as you type. Adjust line items, taxes, and discounts instantly."
              icon={<Zap className="w-5 h-5" />}
            />
            <StepCard
              number="03"
              title="Download or share"
              description="Export as a perfect PDF or share a public link with your client — one click is all it takes."
              icon={<Send className="w-5 h-5" />}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-zinc-950 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Everything you need to bill clients.
            </p>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              A streamlined experience designed to help you get paid faster without the headache of complex accounting software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-amber-500" />}
              title="Lightning Fast"
              description="Live preview updates instantly as you type. See exactly what your client will see before you download."
            />
             <FeatureCard 
              icon={<Shield className="w-6 h-6 text-emerald-500" />}
              title="Secure & Private"
              description="Your invoices are protected with enterprise-grade security. Only you and your clients can access shared links."
            />
             <FeatureCard 
              icon={<FileText className="w-6 h-6 text-blue-500" />}
              title="Print-Ready PDFs"
              description="Download perfectly formatted, high-resolution PDFs that look professional and print beautifully."
            />
            <FeatureCard 
              icon={<Globe className="w-6 h-6 text-violet-500" />}
              title="20+ Languages"
              description="Create invoices in any language — from English and Vietnamese to Arabic, Japanese, Chinese, and more."
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6 text-pink-500" />}
              title="Multi-Company"
              description="Manage multiple businesses from a single dashboard. Each company has its own branding, defaults, and invoice history."
            />
            <FeatureCard 
              icon={<CreditCard className="w-6 h-6 text-cyan-500" />}
              title="Auto Numbering"
              description="Smart invoice numbering (INV-2026-001) that automatically increments. Never duplicate an invoice number again."
            />
          </div>
        </div>
      </section>

      {/* Testimonial / CTA Banner */}
      <section className="py-24 bg-white dark:bg-zinc-900 relative z-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/20 to-violet-400/20 dark:from-blue-600/10 dark:to-violet-600/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
            Ready to streamline your invoicing?
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
            Join thousands of freelancers, agencies, and small businesses who trust InvoiceQuickly for fast, beautiful invoicing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link 
              href="/generator"
              className="group relative inline-flex items-center justify-center gap-2 px-10 py-4 text-base font-semibold text-white transition-all bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-xl shadow-blue-500/20 active:scale-95"
            >
              Get Started — It&apos;s Free
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> No signup needed</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Unlimited invoices</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Forever free</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">InvoiceQuickly</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
                The free, fast, and beautiful invoice generator trusted by freelancers, agencies, and small businesses worldwide.
              </p>
            </div>
            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Product</h4>
              <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                <li><Link href="/generator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Invoice Generator</Link></li>
                <li><Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link></li>
                <li><a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a></li>
              </ul>
            </div>
            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Resources</h4>
              <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                <li><Link href="/dashboard/settings" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Settings</Link></li>
                <li><a href="mailto:support@invoicequickly.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <p className="text-zinc-400 dark:text-zinc-600 text-sm">
              © {new Date().getFullYear()} InvoiceQuickly. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">{value}</span>
      <span className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{label}</span>
    </div>
  );
}

function StepCard({ number, title, description, icon }: { number: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="relative flex flex-col items-center text-center group">
      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
        {icon}
      </div>
      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Step {number}</span>
      <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white/60 backdrop-blur-xl dark:bg-zinc-800/40 p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-700/80 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 group">
      <div className="w-14 h-14 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl flex items-center justify-center shadow-sm border border-zinc-200/50 dark:border-zinc-700/50 mb-6 group-hover:scale-110 transition-transform duration-300 ring-1 ring-black/5 dark:ring-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">{title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
