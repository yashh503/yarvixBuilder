import { User, Building2, Sparkles, Zap, Shield, Globe } from 'lucide-react';

export function TypeSelector({ onSelect }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SiteForge</span>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="text-center mb-12 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Build Your Website in
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Minutes</span>
            </h1>
            <p className="text-lg text-slate-300 mb-6">
              No coding required. Preview for free. Pay only when you publish.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Instant Preview</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-green-400" />
                <span>SSL Included</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Custom Domain</span>
              </div>
            </div>
          </div>

          {/* Type selection cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            <button
              onClick={() => onSelect('personal')}
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 text-left transition-all duration-300 hover:bg-white/10 hover:border-purple-500/50 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <User className="w-7 h-7 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Personal</h2>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Perfect for portfolios, resumes, freelancers, and personal brands
                </p>

                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                    Profile photo & bio
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                    Social links
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                    Portfolio gallery
                  </li>
                </ul>

                <div className="mt-6 flex items-center text-purple-400 font-medium group-hover:text-purple-300">
                  Get Started
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>

            <button
              onClick={() => onSelect('brand')}
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 text-left transition-all duration-300 hover:bg-white/10 hover:border-blue-500/50 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <Building2 className="w-7 h-7 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Business</h2>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Ideal for companies, shops, agencies, and service providers
                </p>

                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    Logo & branding
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    Services & pricing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    Location & contact
                  </li>
                </ul>

                <div className="mt-6 flex items-center text-blue-400 font-medium group-hover:text-blue-300">
                  Get Started
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          </div>

          {/* Pricing preview */}
          <div className="mt-12 text-center">
            <p className="text-slate-400 text-sm">
              Starting at just <span className="text-white font-semibold">₹500</span> to publish
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center text-slate-500 text-sm">
          © 2024 SiteForge. Build beautiful websites effortlessly.
        </footer>
      </div>
    </div>
  );
}
