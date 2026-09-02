import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { CyberLogo } from '../components/ui/CyberLogo';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen text-[#0C4A6E] relative font-sans overflow-x-hidden flex flex-col justify-between"
      style={{
        backgroundImage: "url('/landing_sky_architecture.png')",
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      {/* Light Sky Architectural Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5FBFF]/70 via-[#F5FBFF]/85 to-[#F5FBFF]/95 z-0 pointer-events-none" />

      {/* Top Header: Logo ONLY (NO NAVBAR, NO SIDEBAR, NO APPLICATION LINKS) */}
      <header className="relative z-10 pt-8 px-8 max-w-7xl mx-auto w-full flex items-center justify-between">
        <CyberLogo size="md" showSubtitle={false} />
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 my-auto py-16 px-6 max-w-5xl mx-auto text-center space-y-24">
        {/* 1. Vertically Centered Hero */}
        <section className="space-y-6 pt-8">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] font-black text-sky-600">
              SOVEREIGN AI WORKBENCH
            </span>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-[#0C4A6E] leading-[1.08]">
              PRIVATE INTELLIGENCE.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-600">
                LOCAL BY DESIGN.
              </span>
            </h1>
          </div>

          <p className="text-base sm:text-xl text-sky-900 max-w-xl mx-auto font-medium leading-relaxed">
            Work with intelligent tools while keeping your data close.
          </p>

          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              onClick={() => navigate('/workbench')}
              className="px-8 py-4 text-base shadow-xl shadow-sky-500/25"
            >
              ENTER WORKBENCH →
            </Button>
          </div>
        </section>

        {/* 2. Brand Statement */}
        <section className="py-8">
          <div className="p-8 rounded-3xl glass-gradient-card border border-sky-300 shadow-xl max-w-3xl mx-auto space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-[#0C4A6E]">
              Intelligence on your own terms.
            </h2>
            <p className="text-sm text-sky-900 font-medium leading-relaxed">
              CYBERNEX runs neural models, vector knowledge stores, and code execution environments entirely inside your local infrastructure. Zero data sent outside.
            </p>
          </div>
        </section>

        {/* 3. Simple Product Preview */}
        <section className="space-y-4">
          <span className="text-xs uppercase tracking-widest font-black text-sky-700">
            WORKSPACE PREVIEW
          </span>

          <div className="rounded-3xl glass-gradient-card p-3 border border-sky-300 shadow-2xl overflow-hidden text-left max-w-4xl mx-auto">
            <div className="bg-white/80 px-4 py-3 rounded-t-2xl border-b border-sky-200 flex items-center justify-between text-xs font-bold text-sky-900">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 font-black text-[#0C4A6E]">CYBERNEX</span>
              </div>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ● LOCAL
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-xs font-bold text-sky-900 uppercase">Task</div>
                <div className="p-3.5 rounded-xl bg-white/80 border border-sky-200 text-xs text-sky-950 font-medium leading-relaxed shadow-xs">
                  "Analyze inspection report and compare findings against SOP-704."
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-sky-900 uppercase">Workflow</div>
                <div className="space-y-1.5 text-xs font-bold">
                  <div className="p-2 rounded-lg bg-white/70 border border-sky-200 text-sky-950">
                    01 • OCR Extraction
                  </div>
                  <div className="p-2 rounded-lg bg-white/70 border border-sky-200 text-sky-950">
                    02 • Knowledge Search
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800">
                    03 • Verified Output
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-sky-900 uppercase">Deliverable</div>
                <div className="p-3.5 rounded-xl bg-white/90 border border-sky-300 space-y-1 shadow-xs">
                  <div className="text-xs font-black text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Output Ready
                  </div>
                  <div className="text-xs font-black text-[#0C4A6E]">Approval_Note.docx</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Final CTA */}
        <section className="py-12 space-y-6">
          <div className="p-10 rounded-3xl glass-gradient-card border border-sky-300 max-w-2xl mx-auto space-y-4 shadow-2xl">
            <h2 className="text-3xl font-black text-[#0C4A6E]">
              READY TO WORK?
            </h2>
            <div>
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                onClick={() => navigate('/workbench')}
                className="px-8 py-3.5 text-base shadow-lg shadow-sky-500/20"
              >
                ENTER WORKBENCH →
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 py-8 px-8 text-center text-xs text-sky-800 font-bold border-t border-sky-200/50 bg-white/30 backdrop-blur-md">
        © 2026 CYBERNEX. Sovereign AI Workbench.
      </footer>
    </div>
  );
};
