import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { STAGE_LABELS, STATUS_LABELS, DEAL_TYPE_LABELS, type DealStage } from "@/lib/stages";

export const dynamic = "force-dynamic";

export default async function DealsPage({
  searchParams,
}: {
  searchParams: { stage?: string; q?: string };
}) {
  const supabase = createSupabaseServerClient();

  let query = supabase
    .from("v_deal_full")
    .select("id, sorp_number, current_stage, status, deal_type, customer_name, supplier_name, product_description, sale_amount, sale_currency, received_at, pm_name")
    .order("received_at", { ascending: false })
    .limit(200);

  if (searchParams.stage) query = query.eq("current_stage", searchParams.stage);
  if (searchParams.q) query = query.ilike("product_description", `%${searchParams.q}%`);

  const { data: deals, error } = await query;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Все сделки</h1>
          <p className="text-sm text-muted">
            {deals?.length ?? 0} {searchParams.stage ? `на этапе «${STAGE_LABELS[searchParams.stage as DealStage] ?? searchParams.stage}»` : "записей"}
          </p>
        </div>
        <Link href="/deals/new" className="btn btn-primary">+ Новая сделка</Link>
      </div>

      <form className="mb-4 flex gap-2">
        <input
          name="q"
          defaultValue={searchParams.q ?? ""}
          placeholder="Поиск по описанию ТМЦ…"
          className="input max-w-md"
        />
        {searchParams.stage && <input type="hidden" name="stage" value={searchParams.stage} />}
        <button type="submit" className="btn btn-ghost">Найти</button>
        {(searchParams.q || searchParams.stage) && (
          <Link href="/deals" className="btn btn-ghost text-muted">Сброс</Link>
        )}
      </form>

      {error && <div className="card border-danger/40 text-danger mb-4">Ошибка: {error.message}</div>}

      <div className="card p-0 overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>№ SORP</th>
              <th>Этап</th>
              <th>Тип</th>
              <th>Заказчик</th>
              <th>Поставщик</th>
              <th>Описание</th>
              <th className="text-right">Сумма продажи</th>
              <th>ПМ</th>
              <th>Получено</th>
            </tr>
          </thead>
          <tbody>
            {(deals ?? []).map((d: any) => (
              <tr key={d.id} className="cursor-pointer">
                <td>
                  <Link href={`/deals/${d.id}`} className="text-accent hover:underline font-medium">
                    {d.sorp_number ?? d.id.slice(0, 8)}
                  </Link>
                </td>
                <td><span className="badge badge-stage">{STAGE_LABELS[d.current_stage as DealStage] ?? d.current_stage}</span></td>
                <td>{DEAL_TYPE_LABELS[d.deal_type] ?? "—"}</td>
                <td className="max-w-[180px] truncate">{d.customer_name ?? "—"}</td>
                <td className="max-w-[180px] truncate">{d.supplier_name ?? "—"}</td>
                <td className="max-w-[300px] truncate">{d.product_description ?? "—"}</td>
                <td className="text-right tabular-nums">
                  {d.sale_amount ? `${Number(d.sale_amount).toLocaleString("ru-RU")} ${d.sale_currency ?? ""}` : "—"}
                </td>
                <td>{d.pm_name ?? "—"}</td>
                <td className="text-muted">{new Date(d.received_at).toLocaleDateString("ru-RU")}</td>
              </tr>
            ))}
            {(deals?.length ?? 0) === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-8 text-muted">Пусто. Создай первую сделку →</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
