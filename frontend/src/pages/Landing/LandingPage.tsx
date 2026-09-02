import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { CyberLogo } from '@/components/ui/CyberLogo';
import { Button } from '@/components/ui/Button';

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

        {/* 2. Brand Statement & Supporting Content */}
        <section className="py-6">
          <div className="p-8 rounded-3xl glass-gradient-card border border-sky-300 shadow-xl max-w-2xl mx-auto space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-[#0C4A6E]">
              Intelligence on your terms.
            </h2>
            <p className="text-sm text-sky-900 font-medium leading-relaxed">
              CYBERNEX empowers your workflow with seamless AI tools built directly into your environment. Safe, responsive, and completely private.
            </p>
          </div>
        </section>

        {/* 3. Final CTA */}
        <section className="py-8 space-y-6">
          <div className="p-10 rounded-3xl glass-gradient-card border border-sky-300 max-w-xl mx-auto space-y-4 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0C4A6E]">
              Ready to work?
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
