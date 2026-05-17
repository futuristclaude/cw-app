import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { STAGE_ORDER, STAGE_LABELS, type DealStage } from "@/lib/stages";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();

  const { data: byStage } = await supabase
    .from("v_active_by_stage")
    .select("*");

  const stageMap = new Map<string, { deals_count: number; total_sale_amount: number | null; avg_days_in_work: number | null }>();
  (byStage ?? []).forEach((row: any) => stageMap.set(row.current_stage, row));

  const { count: totalDeals } = await supabase
    .from("deals")
    .select("*", { count: "exact", head: true });

  const { count: activeDeals } = await supabase
    .from("deals")
    .select("*", { count: "exact", head: true })
    .not("status", "in", "(won,lost,cancelled)");

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Дашборд</h1>
      <p className="text-sm text-muted mb-6">Текущее состояние воронки по этапам</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-muted mb-1">Всего сделок</div>
          <div className="text-3xl font-semibold">{totalDeals ?? 0}</div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-muted mb-1">Активных</div>
          <div className="text-3xl font-semibold">{activeDeals ?? 0}</div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-muted mb-1">Закрытых</div>
          <div className="text-3xl font-semibold">{(totalDeals ?? 0) - (activeDeals ?? 0)}</div>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Сделки по этапам</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {STAGE_ORDER.map((stage) => {
          const stats = stageMap.get(stage);
          const count = stats?.deals_count ?? 0;
          return (
            <Link
              key={stage}
              href={`/registry/${stage}`}
              className="card hover:border-accent/40 transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm font-medium">{STAGE_LABELS[stage as DealStage]}</div>
                <span className="badge badge-stage">{count}</span>
              </div>
              <div className="text-xs text-muted">
                {stats?.avg_days_in_work
                  ? `Сред. ${Math.round(Number(stats.avg_days_in_work))} дн.`
                  : "Нет активных"}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
