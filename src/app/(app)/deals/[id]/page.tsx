import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { STAGE_LABELS, STATUS_LABELS, DEAL_TYPE_LABELS, type DealStage } from "@/lib/stages";
import StageChanger from "./StageChanger";
import DealEditor from "./DealEditor";

export const dynamic = "force-dynamic";

export default async function DealDetailPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();

  const { data: deal } = await supabase
    .from("v_deal_full")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!deal) notFound();

  const { data: history } = await supabase
    .from("v_deal_history")
    .select("transition_id, transitioned_at, stage_from, stage_to, source, actor_name, transition_notes")
    .eq("deal_id", params.id)
    .order("transitioned_at", { ascending: true });

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-2 text-sm text-muted mb-2">
        <Link href="/deals" className="hover:text-fg">Все сделки</Link>
        <span>/</span>
        <span className="text-fg">{deal.sorp_number ?? deal.id.slice(0, 8)}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{deal.sorp_number ?? `Сделка ${deal.id.slice(0, 8)}`}</h1>
          <p className="text-muted mt-1 max-w-xl">{deal.product_description ?? "—"}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="badge badge-stage text-base">{STAGE_LABELS[deal.current_stage as DealStage]}</span>
          <span className="text-xs text-muted">Статус: {STATUS_LABELS[deal.status] ?? deal.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-sm uppercase tracking-wide text-muted mb-3">Параметры</h2>
            <DealEditor deal={deal} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-sm uppercase tracking-wide text-muted mb-3">Сменить этап</h2>
            <StageChanger dealId={deal.id} currentStage={deal.current_stage} />
          </div>

          <div className="card">
            <h2 className="text-sm uppercase tracking-wide text-muted mb-3">Кратко</h2>
            <dl className="space-y-2 text-sm">
              <Row label="Тип" value={DEAL_TYPE_LABELS[deal.deal_type] ?? "—"} />
              <Row label="Заказчик" value={deal.customer_name ?? "—"} />
              <Row label="Поставщик" value={deal.supplier_name ?? "—"} />
              <Row label="ПМ" value={deal.pm_name ?? "—"} />
              <Row label="Закупщик" value={deal.buyer_name ?? "—"} />
              <Row label="Маржа %" value={deal.margin_pct != null ? `${Number(deal.margin_pct).toFixed(1)}%` : "—"} />
              <Row label="Получено" value={new Date(deal.received_at).toLocaleString("ru-RU")} />
            </dl>
          </div>

          <div className="card">
            <h2 className="text-sm uppercase tracking-wide text-muted mb-3">История переходов</h2>
            <ol className="space-y-3 text-sm">
              {(history ?? []).map((h: any) => (
                <li key={h.transition_id} className="border-l-2 border-border pl-3">
                  <div className="text-xs text-muted">
                    {new Date(h.transitioned_at).toLocaleString("ru-RU")}
                    {h.actor_name && ` · ${h.actor_name}`}
                  </div>
                  <div>
                    {h.stage_from ? (
                      <>
                        <span className="text-muted">{STAGE_LABELS[h.stage_from as DealStage]}</span>
                        <span className="mx-1">→</span>
                      </>
                    ) : null}
                    <span>{STAGE_LABELS[h.stage_to as DealStage]}</span>
                  </div>
                </li>
              ))}
              {(history?.length ?? 0) === 0 && <li className="text-muted">Истории нет</li>}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
