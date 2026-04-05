import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, Sparkles, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fillDemo = () => {
    setEmail('demo@singularity.com');
    setPassword('demo1234');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid email or password. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-violet-800 to-violet-700 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 mb-4 shadow-xl">
            <Hotel className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Singularity PMS</h1>
          <p className="text-violet-200 mt-2 text-sm">Hotel Operating System</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl p-8">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-white">Sign in to your account</h2>
            <p className="text-violet-200 text-sm mt-1">Enter your credentials to access the dashboard</p>
          </div>

          {/* Demo credentials banner */}
          <button
            type="button"
            onClick={fillDemo}
            className="w-full mb-5 flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-2xl p-3.5 transition-all group text-left"
          >
            <div className="bg-violet-500/40 rounded-xl p-2 shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold">Try the Live Demo</p>
              <p className="text-violet-200 text-xs mt-0.5">demo@singularity.com · demo1234</p>
            </div>
            <span className="text-white/60 text-xs font-medium group-hover:text-white transition-colors">Auto-fill →</span>
          </button>

          {error && (
            <div className="mb-4 flex items-start gap-3 bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-3 text-red-200 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-violet-100 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@hotel.com"
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20",
                  "text-white placeholder:text-violet-300/60 text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40",
                  "transition-all duration-200"
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-violet-100 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={cn(
                    "w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20",
                    "text-white placeholder:text-violet-300/60 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40",
                    "transition-all duration-200"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-300 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-violet-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/30 bg-white/10 accent-violet-400"
                />
                Remember me
              </label>
              <button type="button" className="text-violet-200 hover:text-white transition-colors font-medium">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200",
                "bg-white text-violet-700 hover:bg-violet-50",
                "focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-violet-800",
                "shadow-lg shadow-violet-900/40",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2"
              )}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* AI branding badge */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-violet-300 text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by Agentic AI — Singularity OS</span>
          </div>
        </div>

        <p className="text-center text-violet-300/60 text-xs mt-6">
          &copy; {new Date().getFullYear()} Singularity PMS. All rights reserved.
        </p>
      </div>
    </div>
  );
}
