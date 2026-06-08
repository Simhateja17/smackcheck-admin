'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { I } from '@/components/icons';
import { getAdminMe } from '@/lib/adminApi';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [step, setStep] = useState<"creds" | "mfa">("creds");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isSupabaseConfigured || !supabase) {
      setError('Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY first.');
      return;
    }
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: pwd,
      });
      if (signInError) throw signInError;
      await getAdminMe();
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    setLoading(true);
    try {
      await getAdminMe();
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Admin verification failed');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    if (!isSupabaseConfigured || !supabase) {
      setError('Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY first.');
      return;
    }
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (oauthError) setError(oauthError.message);
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", background: "var(--paper)" }}>
      {/* Left — brand panel */}
      <div style={{ background: "var(--brand)", color: "white", padding: "48px 56px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Food-pattern background */}
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.06 }} preserveAspectRatio="xMidYMid slice">
          <pattern id="food" width="120" height="120" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="20" cy="20" r="10"/>
              <path d="M50 14 Q60 4 70 14 T90 14"/>
              <path d="M14 55 l8 -4 l8 4 l8 -4 l8 4"/>
              <circle cx="80" cy="60" r="14"/>
              <path d="M76 56 l8 8 M84 56 l-8 8"/>
              <path d="M20 90 q12 -12 24 0 t24 0 t24 0"/>
              <ellipse cx="100" cy="100" rx="14" ry="8"/>
              <rect x="40" y="80" width="20" height="16" rx="2"/>
            </g>
          </pattern>
          <rect width="100%" height="100%" fill="url(#food)"/>
        </svg>

        <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
          <div style={{ width: 36, height: 36, background: "white", color: "var(--brand)", borderRadius: 10, display: "grid", placeItems: "center", fontFamily: "var(--display)", fontSize: 22 }}>s</div>
          <div style={{ fontFamily: "var(--display)", fontSize: 24 }}>Smack<b style={{ fontWeight: 400 }}>Check</b></div>
        </div>

        <div style={{ marginTop: "auto", marginBottom: 24, position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.65, marginBottom: 12 }}>Admin Console</div>
          <h1 style={{ color: "white", fontSize: 56, lineHeight: 1, marginBottom: 18 }}>
            Trust &amp; safety,<br />served honest.
          </h1>
          <p style={{ opacity: 0.78, fontSize: 15, maxWidth: 420, lineHeight: 1.55 }}>
            The moderation, analytics and content tools that keep SmackCheck&apos;s community of 200K+ tasters fair, fresh, and human-reviewed.
          </p>

          <div style={{ marginTop: 36, display: "flex", gap: 32, opacity: 0.85 }}>
            <div>
              <div className="font-display" style={{ fontSize: 32, color: "white" }}>212k</div>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7 }}>Active tasters</div>
            </div>
            <div>
              <div className="font-display" style={{ fontSize: 32, color: "white" }}>1.2M</div>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7 }}>Ratings reviewed</div>
            </div>
            <div>
              <div className="font-display" style={{ fontSize: 32, color: "white" }}>99.2%</div>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7 }}>AI accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — login form */}
      <div style={{ display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ width: 380, maxWidth: "100%" }}>
          {step === "creds" && (
            <form onSubmit={submit}>
              <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--mute)", fontWeight: 600, marginBottom: 12 }}>Sign in</div>
              <h2 style={{ fontSize: 34, marginBottom: 8 }}>Welcome back.</h2>
              <p className="muted" style={{ marginBottom: 28 }}>Use your admin email to sign in. SSO and MFA required.</p>

              <div className="col gap-4">
                <div className="field">
                  <label>Email</label>
                  <div className="input-icon"><I.Mail size={15} /><input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
                </div>
                <div className="field">
                  <div className="between">
                    <label>Password</label>
                    <a style={{ fontSize: 12, color: "var(--brand)", textDecoration: "none" }} href="#">Forgot?</a>
                  </div>
                  <div className="input-icon" style={{ position: "relative" }}>
                    <I.Lock size={15} />
                    <input className="input" type={show ? "text" : "password"} value={pwd} onChange={e => setPwd(e.target.value)} style={{ paddingRight: 40 }} />
                    <button type="button" onClick={() => setShow(!show)}
                            style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "var(--mute)", padding: 4 }}>
                      <I.Eye size={15} />
                    </button>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary lg w-full" style={{ marginTop: 22 }} type="submit" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
                {!loading && <I.ArrowRight size={15} />}
              </button>
              {error && <div style={{ marginTop: 12, color: "var(--danger)", fontSize: 12.5 }}>{error}</div>}

              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0 16px" }}>
                <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
                <span style={{ fontSize: 11, color: "var(--mute)", letterSpacing: "0.1em", textTransform: "uppercase" }}>or</span>
                <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
              </div>
              <button type="button" className="btn btn-secondary lg w-full" onClick={signInWithGoogle}>
                <span style={{ width: 16, height: 16, background: "var(--ink)", borderRadius: 4, display: "inline-grid", placeItems: "center", color: "white", fontSize: 10, fontWeight: 700 }}>G</span>
                Continue with Google SSO
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 24, fontSize: 12, color: "var(--mute)" }}>
                <I.Lock size={12} /> Encrypted session · 30 min idle timeout
              </div>
            </form>
          )}

          {step === "mfa" && (
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--mute)", fontWeight: 600, marginBottom: 12 }}>Two-factor</div>
              <h2 style={{ fontSize: 34, marginBottom: 8 }}>One more step.</h2>
              <p className="muted" style={{ marginBottom: 28 }}>We sent a 6-digit code to your authenticator app. Enter it below to continue.</p>

              <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                {code.map((c, i) => (
                  <input key={i} value={c} maxLength={1}
                         onChange={e => {
                           const v = e.target.value.replace(/\D/g, "");
                           const next = [...code]; next[i] = v; setCode(next);
                           if (v && i < 5) {
                             const cells = document.querySelectorAll<HTMLInputElement>(".mfa-cell");
                             cells[i + 1]?.focus();
                           }
                         }}
                         className="input mfa-cell"
                         style={{ width: 48, height: 56, fontSize: 22, textAlign: "center", fontFamily: "var(--display)", padding: 0 }} />
                ))}
              </div>
              <button className="btn btn-primary lg w-full" onClick={verify} disabled={loading}>
                {loading ? "Verifying…" : "Verify and continue"}
              </button>
              {error && <div style={{ marginTop: 12, color: "var(--danger)", fontSize: 12.5 }}>{error}</div>}
              <button className="btn btn-ghost w-full" onClick={() => setStep("creds")} style={{ marginTop: 8 }}>← Back</button>
            </div>
          )}

          <div style={{ marginTop: 60, fontSize: 11.5, color: "var(--mute)", textAlign: "center" }}>
            SmackCheck Admin · v3.4.0 · build 2026.05.14
          </div>
        </div>
      </div>
    </div>
  );
}
