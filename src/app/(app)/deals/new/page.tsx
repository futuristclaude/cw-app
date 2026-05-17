"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import { DEAL_TYPE_LABELS } from "@/lib/stages";

export default function NewDealPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, any> = {
      sorp_number: (fd.get("sorp_number") as string) || null,
      deal_type: (fd.get("deal_type") as string) || null,
      product_description: (fd.get("product_description") as string) || null,
      product_category: (fd.get("product_category") as string) || null,
      quantity: fd.get("quantity") ? Number(fd.get("quantity")) : null,
      unit: (fd.get("unit") as string) || null,
      delivery_deadline: (fd.get("delivery_deadline") as string) || null,
      short_summary: (fd.get("short_summary") as string) || null,
      current_stage: "intake",
      status: "new",
    };
    const supabase = createSupabaseBrowserClient();
    const { data, error: err } = await supabase.from("deals").insert(payload).select("id").single();
    if (err) {
      setError(err.message);
      setSubmitting(false);
      return;
    }
    router.push(`/deals/${data!.id}`);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-1">Новая сделка</h1>
      <p className="text-sm text-muted mb-6">Заявка попадёт на этап «Приём». Контрагентов и команду укажешь после.</p>

      <form onSubmit={onSubmit} className="card space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1">№ SORP (опц.)</label>
            <input name="sorp_number" placeholder="SORP-3700" className="input" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1">Тип</label>
            <select name="deal_type" className="input">
              <option value="">— выбрать —</option>
              {Object.entries(DEAL_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-muted mb-1">Описание ТМЦ *</label>
          <textarea name="product_description" required rows={2} className="input" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1">Категория</label>
            <input name="product_category" placeholder="Насосы, Подшипники…" className="input" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1">Кол-во</label>
            <input name="quantity" type="number" step="0.001" className="input" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1">Ед. изм.</label>
            <input name="unit" placeholder="шт / кг / м" className="input" />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-muted mb-1">Срок поставки</label>
          <input name="delivery_deadline" type="date" className="input" />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-muted mb-1">Краткое резюме</label>
          <input name="short_summary" placeholder="Что хочет заказчик одной строкой" className="input" />
        </div>

        {error && <div className="text-sm text-danger">{error}</div>}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={() => router.back()} className="btn btn-ghost">Отмена</button>
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? "Создаю…" : "Создать сделку"}
          </button>
        </div>
      </form>
    </div>
  );
}
