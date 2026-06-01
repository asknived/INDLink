import Link from "next/link";
import { ArrowRight, BarChart3, Globe, Layout, Palette, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            INDLink
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary/80 transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary/80 transition-colors" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:text-primary/80 transition-colors" href="/login">
            Login
          </Link>
          <Link
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            href="/register"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-48 xl:py-56 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-background to-background z-0" />
          <div className="container px-4 md:px-6 relative z-10 mx-auto text-center">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  One Link. <span className="text-blue-500">Unlimited Reach.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join India's leading creator platform. Monetize your audience, showcase your portfolio, and manage all your links in one beautiful page.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-md mx-auto justify-center">
                <div className="flex w-full items-center space-x-2 bg-muted/50 p-2 rounded-lg border border-border">
                  <span className="text-muted-foreground pl-3 hidden sm:inline-block">indlink.in/</span>
                  <input
                    className="flex h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="yourname"
                    type="text"
                  />
                  <Link
                    href="/register"
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Claim
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Powerful Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything you need to grow
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  INDLink gives you the tools to build a stunning profile, understand your audience, and monetize your content.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border border-border bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Palette className="h-12 w-12 text-blue-500 mb-2" />
                <h3 className="text-xl font-bold">Stunning Themes</h3>
                <p className="text-muted-foreground text-center">Choose from 20+ premium themes or customize your own with our advanced design editor.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-border bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <BarChart3 className="h-12 w-12 text-green-500 mb-2" />
                <h3 className="text-xl font-bold">Deep Analytics</h3>
                <p className="text-muted-foreground text-center">Understand your audience with detailed insights into clicks, locations, and referrers.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-border bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Globe className="h-12 w-12 text-purple-500 mb-2" />
                <h3 className="text-xl font-bold">Custom Domains</h3>
                <p className="text-muted-foreground text-center">Connect your own domain name for a truly professional and branded experience.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-border bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Zap className="h-12 w-12 text-yellow-500 mb-2" />
                <h3 className="text-xl font-bold">Lightning Fast</h3>
                <p className="text-muted-foreground text-center">Built on Edge infrastructure, ensuring your profile loads instantly anywhere in the world.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-border bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Layout className="h-12 w-12 text-orange-500 mb-2" />
                <h3 className="text-xl font-bold">Unlimited Links</h3>
                <p className="text-muted-foreground text-center">Add as many links as you want, categorize them, and reorder them with simple drag and drop.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-border bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <svg
                  className=" h-12 w-12 text-pink-500 mb-2"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="12" x2="12" y1="2" y2="22" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <h3 className="text-xl font-bold">Monetization Hub</h3>
                <p className="text-muted-foreground text-center">Accept UPI payments, sell digital products, and manage affiliate links seamlessly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to take control of your audience?</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                  Join thousands of creators using INDLink to grow and monetize their personal brand.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Link
                  className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  href="/register"
                >
                  Create your free account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border py-6 md:py-12 bg-muted/20">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tighter text-xl text-primary">INDLink</span>
            <span className="text-sm text-muted-foreground">© 2026. All rights reserved.</span>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-sm hover:underline underline-offset-4 text-muted-foreground" href="#">
              Terms of Service
            </Link>
            <Link className="text-sm hover:underline underline-offset-4 text-muted-foreground" href="#">
              Privacy Policy
            </Link>
            <Link className="text-sm hover:underline underline-offset-4 text-muted-foreground" href="#">
              Contact Support
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
