import { User, Building2, Sparkles, Zap, Shield, Globe } from "lucide-react";

export function TypeSelector({ onSelect }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#1A0F14] to-[#2A0F18] relative overflow-hidden">
      {/* Ambient red glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-red-700/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide">
              Yarvix Builder
            </span>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="text-center mb-14 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Build Your Website in{" "}
              <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                Minutes
              </span>
            </h1>
            <p className="text-slate-400 text-lg">
              No code. No stress. No excuse.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            {/* Personal */}
            <button
              onClick={() => onSelect("personal")}
              className="group relative rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-8 text-left transition-all duration-300 hover:scale-[1.03] hover:border-red-500/60 hover:shadow-2xl hover:shadow-red-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mb-6 shadow-lg shadow-red-500/40">
                  <User className="w-7 h-7 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Personal</h2>
                <p className="text-slate-400 mb-6">
                  Portfolios, resumes, freelancers, ego boosting.
                </p>

                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Profile & bio</li>
                  <li>• Social links</li>
                  <li>• Portfolio showcase</li>
                </ul>
              </div>
            </button>

            {/* Business */}
            <button
              onClick={() => onSelect("brand")}
              className="group relative rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-8 text-left transition-all duration-300 hover:scale-[1.03] hover:border-rose-500/60 hover:shadow-2xl hover:shadow-rose-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center mb-6 shadow-lg shadow-rose-500/40">
                  <Building2 className="w-7 h-7 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Business</h2>
                <p className="text-slate-400 mb-6">
                  For brands that want money, not compliments.
                </p>

                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Branding & logo</li>
                  <li>• Services & pricing</li>
                  <li>• Contact & location</li>
                </ul>
              </div>
            </button>
          </div>

          <p className="mt-12 text-slate-400 text-xl">
            Start for <span className="text-white font-semibold">FREE!!</span>
          </p>
        </main>

        <footer className="p-6 text-center text-slate-600 text-sm">
          © 2026 YarvixTech. Built fast. Judged faster.
        </footer>
      </div>
    </div>
  );
}
