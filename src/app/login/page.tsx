"use client";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-1">Вход</h1>
        <p className="text-sm text-muted mb-6">Magic link на твой email — пароль не нужен.</p>

        {status === "sent" ? (
          <div className="text-sm">
            <p className="mb-2">Письмо отправлено на <span className="text-fg font-medium">{email}</span>.</p>
            <p className="text-muted">Открой почту, нажми ссылку — и ты внутри.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-muted mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="input"
                autoFocus
              />
            </div>
            <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full">
              {status === "sending" ? "Отправляю…" : "Прислать ссылку"}
            </button>
            {status === "error" && errorMsg && (
              <p className="text-sm text-danger">{errorMsg}</p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
