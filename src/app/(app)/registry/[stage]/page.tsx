import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { STAGE_LABELS, STATUS_LABELS, type DealStage } from "@/lib/stages";

export const dynamic = "force-dynamic";

const REGISTRY_VIEW_MAP: Partial<Record<DealStage, string>> = {
  intake: "v_registry_intake",
  qualification: "v_registry_qualification",
  sourcing_mir: "v_registry_sourcing_mir",
  sourcing_china: "v_registry_sourcing_china",
  engineering: "v_registry_engineering",
  logistics: "v_registry_logistics",
  customs: "v_registry_customs",
  cost_check: "v_registry_cost_check",
  pricing_kp: "v_registry_pricing_kp",
  contract: "v_registry_contract",
  prepayment: "v_registry_prepayment",
  production_delivery: "v_registry_production_delivery",
  final_payment: "v_registry_final_payment",
  act: "v_registry_act",
  realized: "v_registry_realized",
};

export default async function RegistryPage({ params }: { params: { stage: string } }) {
  const stage = params.stage as DealStage;
  const viewName = REGISTRY_VIEW_MAP[stage];
  if (!viewName) notFound();

  const supabase = createSupabaseServerClient();

  const { data: rows, error } = await supabase
    .from(viewName)
    .select("id, sorp_number, current_stage, status, product_description, customer_name, supplier_name, sale_amount, sale_currency, entered_stage_at, is_currently_here, pm_name")
    .order("entered_stage_at", { ascending: false })
    .limit(500);

  const activeCount = (rows ?? []).filter((r: any) => r.is_currently_here).length;
  const passedCount = (rows ?? []).length - activeCount;

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-muted mb-2">
        <Link href="/dashboard" className="hover:text-fg">Дашборд</Link>
        <span>/</span>
        <span className="text-fg">Реестр этапа</span>
      </div>

      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{STAGE_LABELS[stage]}</h1>
          <p className="text-sm text-muted">Все сделки, которые когда-либо побывали на этом этапе</p>
        </div>
        <div className="flex gap-2">
          <div className="card py-2 px-3">
            <div className="text-xs text-muted">Сейчас здесь</div>
            <div className="text-xl font-semibold">{activeCount}</div>
          </div>
          <div className="card py-2 px-3">
            <div className="text-xs text-muted">Уже прошли</div>
            <div className="text-xl font-semibold text-muted">{passedCount}</div>
          </div>
        </div>
      </div>

      {error && <div className="card border-danger/40 text-danger mb-4">Ошибка: {error.message}</div>}

      <div className="card p-0 overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>№ SORP</th>
              <th>Сейчас</th>
              <th>Заказчик</th>
              <th>Поставщик</th>
              <th>Описание</th>
              <th className="text-right">Сумма</th>
              <th>ПМ</th>
              <th>Попала на этап</th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((r: any) => (
              <tr key={`${r.id}-${r.entered_stage_at}`}>
                <td>
                  <Link href={`/deals/${r.id}`} className="text-accent hover:underline font-medium">
                    {r.sorp_number ?? r.id.slice(0, 8)}
                  </Link>
                </td>
                <td>
                  {r.is_currently_here ? (
                    <span className="badge badge-status-ok">Здесь</span>
                  ) : (
                    <span className="badge bg-muted/20 text-muted">{STAGE_LABELS[r.current_stage as DealStage] ?? r.current_stage}</span>
                  )}
                </td>
                <td className="max-w-[180px] truncate">{r.customer_name ?? "—"}</td>
                <td className="max-w-[180px] truncate">{r.supplier_name ?? "—"}</td>
                <td className="max-w-[300px] truncate">{r.product_description ?? "—"}</td>
                <td className="text-right tabular-nums">
                  {r.sale_amount ? `${Number(r.sale_amount).toLocaleString("ru-RU")} ${r.sale_currency ?? ""}` : "—"}
                </td>
                <td>{r.pm_name ?? "—"}</td>
                <td className="text-muted">{new Date(r.entered_stage_at).toLocaleDateString("ru-RU")}</td>
              </tr>
            ))}
            {(rows?.length ?? 0) === 0 && (
              <tr><td colSpan={8} className="text-center py-8 text-muted">Пусто</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
