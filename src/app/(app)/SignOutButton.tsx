"use client";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";

export default function SignOutButton() {
  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }
  return (
    <button onClick={signOut} className="btn btn-ghost w-full justify-start text-muted hover:text-fg">
      Выйти
    </button>
  );
}
