"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { getSafeAdminNextPath } from "@/lib/admin-session";
import { APP_RELEASE } from "@/lib/app-release";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const nextPath = getSafeAdminNextPath(searchParams.get("next"));

  return (
    <div className="min-h-screen bg-[#07161d] px-4 py-10 sm:px-6 lg:px-8"
      style={{
        background: "radial-gradient(circle at 15% 15%, rgba(20,184,166,0.18), transparent 36%), radial-gradient(circle at 85% 80%, rgba(251,191,36,0.12), transparent 30%), linear-gradient(180deg, #07161d 0%, #0a1d26 100%)"
      }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/5 shadow-[0_40px_120px_-55px_rgba(20,184,166,0.25)] backdrop-blur-xl lg:grid-cols-[1fr_0.92fr]">
          <div className="hidden flex-col justify-between bg-[#07161d]/80 border-r border-white/10 px-10 py-12 text-white lg:flex">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">
                <ShieldCheck className="h-4 w-4" />
                Admin Access
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white">
                Operate bookings, tours, and finance from one place.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/60">
                Sign in with the admin password to open the operations hub and
                continue managing your tour operator workflow.
              </p>
            </div>
            <div className="space-y-3 text-sm text-white/50">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4">
                Protected areas include bookings, supplier data, invoicing,
                payments, payroll, and settings.
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4">
                Session access uses an httpOnly admin cookie for secure,
                server-side authentication.
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-12 bg-[#0a1d26]/60">
            <div className="mx-auto max-w-md">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">
                <LockKeyhole className="h-4 w-4" />
                Secure Login
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white">
                Sign in to TravelBook Tours
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/60">
                Use the configured admin password to continue.
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-white/30">
                Live version v{APP_RELEASE.version}
              </p>

              <form
                className="mt-8 space-y-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  setError("");
                  startTransition(async () => {
                    try {
                      const response = await fetch("/api/admin/auth", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ password }),
                      });
                      const data = (await response.json().catch(() => null)) as
                        | { ok?: boolean; error?: string }
                        | null;

                      if (!response.ok || !data?.ok) {
                        setError(data?.error ?? "Unable to sign in");
                        return;
                      }

                      router.replace(nextPath);
                      router.refresh();
                    } catch {
                      setError("Unable to sign in");
                    }
                  });
                }}
              >
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-white/70"
                  >
                    Admin password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="w-full rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-teal-400/50 focus:ring-4 focus:ring-teal-500/20"
                  />
                </div>

                {error ? (
                  <div className="rounded-[1rem] border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-500 px-5 py-3.5 text-sm font-semibold text-[#07161d] shadow-[0_18px_48px_-28px_rgba(20,184,166,0.7)] transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending ? "Signing in…" : "Enter admin"}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/50">
                  After login, users are notified about the current deployed
                  version once for this release, and all live booking data stays
                  preserved.
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
