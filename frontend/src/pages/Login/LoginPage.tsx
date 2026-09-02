import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { CyberLogo } from '../components/ui/CyberLogo';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('lead.security@cybernex.local');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/workbench');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F4FAFE] text-[#0C4A6E] flex items-center justify-center p-6 relative cyber-bg-grid overflow-hidden font-sans">
      <div className="cyber-glow-top" />
      <div className="cyber-glow-right" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl glass-gradient-card border border-sky-300 overflow-hidden shadow-2xl relative z-10">
        {/* Left Side */}
        <div className="p-8 lg:p-12 bg-gradient-to-br from-sky-100/60 via-sky-50/40 to-white/40 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-sky-200/80">
          <div>
            <CyberLogo size="lg" />
            <div className="mt-12 space-y-4">
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-bold inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                SOVEREIGN AIR-GAPPED NODE
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-[#0C4A6E] leading-tight">
                PRIVATE INTELLIGENCE.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-600">
                  LOCAL BY DESIGN.
                </span>
              </h2>
              <p className="text-xs lg:text-sm text-sky-900 leading-relaxed font-medium">
                Sign in to access local model inference, private vector stores, and sandboxed execution.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 lg:p-12 bg-white/60 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-[#0C4A6E]">SIGN IN</h3>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs uppercase text-sky-900 font-black mb-2">
                  System Identifier
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs font-medium"
                  placeholder="name@organization.local"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-sky-900 font-black mb-2">
                  Hardware Token
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs font-medium"
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="w-full"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  SIGN IN TO WORKBENCH
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-8 pt-6 border-t border-sky-200/60 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Local System
            </span>
            <span className="text-sky-800 font-bold">Secure Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};
