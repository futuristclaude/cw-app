import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { STAGE_ORDER, STAGE_LABELS } from "@/lib/stages";
import SignOutButton from "./SignOutButton";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      <aside className="border-r border-border bg-panel/40 p-4 flex flex-col">
        <div className="mb-6">
          <div className="text-lg font-semibold">Реестры сделок</div>
          <div className="text-xs text-muted truncate">{user.email}</div>
        </div>

        <nav className="space-y-1 text-sm">
          <Link href="/dashboard" className="btn btn-ghost w-full justify-start">Дашборд</Link>
          <Link href="/deals" className="btn btn-ghost w-full justify-start">Все сделки</Link>
          <Link href="/deals/new" className="btn btn-ghost w-full justify-start">+ Новая сделка</Link>
        </nav>

        <div className="mt-6 mb-2 text-xs uppercase tracking-wide text-muted">Реестры по этапам</div>
        <nav className="space-y-0.5 text-sm overflow-y-auto">
          {STAGE_ORDER.map((s) => (
            <Link
              key={s}
              href={`/registry/${s}`}
              className="block px-3 py-1.5 rounded-md hover:bg-panel text-fg/90 hover:text-fg"
            >
              {STAGE_LABELS[s]}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-border">
          <SignOutButton />
        </div>
      </aside>

      <main className="p-6 overflow-x-auto">{children}</main>
    </div>
  );
}
