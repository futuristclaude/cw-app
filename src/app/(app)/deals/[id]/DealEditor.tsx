"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";

type Deal = Record<string, any>;

const EDITABLE_FIELDS: { key: string; label: string; type?: "text" | "number" | "date" }[] = [
  { key: "sorp_number", label: "№ SORP" },
  { key: "product_description", label: "Описание ТМЦ" },
  { key: "product_category", label: "Категория" },
  { key: "tn_ved_code", label: "ТН ВЭД" },
  { key: "quantity", label: "Количество", type: "number" },
  { key: "unit", label: "Ед. изм." },
  { key: "brand", label: "Марка / бренд" },
  { key: "country_of_origin", label: "Страна происх." },
  { key: "kp_deadline", label: "Дедлайн КП", type: "date" },
  { key: "delivery_deadline", label: "Срок поставки", type: "date" },
  { key: "delivery_place", label: "Место поставки" },
  { key: "cost_amount", label: "Себестоимость", type: "number" },
  { key: "cost_currency", label: "Валюта себест." },
  { key: "sale_amount", label: "Сумма продажи", type: "number" },
  { key: "sale_currency", label: "Валюта продажи" },
  { key: "alternative_suppliers_note", label: "Альт. поставщики" },
  { key: "short_summary", label: "Резюме" },
  { key: "next_action", label: "След. действие" },
  { key: "blocker", label: "Блокер" },
  { key: "pm_note", label: "Заметка ПМ" },
  { key: "drive_folder_url", label: "Папка Drive (URL)" },
];

export default function DealEditor({ deal }: { deal: Deal }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Deal>(deal);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function setField(key: string, value: any) {
    setDraft((d) => ({ ...d, [key]: value }));
    setSaved(false);
  }

  async function save() {
    setPending(true);
    setError(null);
    const patch: Deal = {};
    for (const f of EDITABLE_FIELDS) {
      let v = draft[f.key];
      if (f.type === "number" && v === "") v = null;
      if (v === "") v = null;
      if (v !== deal[f.key]) patch[f.key] = v;
    }
    if (Object.keys(patch).length === 0) {
      setSaved(true);
      setPending(false);
      return;
    }
    const supabase = createSupabaseBrowserClient();
    const { error: err } = await supabase.from("deals").update(patch).eq("id", deal.id);
    if (err) {
      setError(err.message);
      setPending(false);
      return;
    }
    setSaved(true);
    setPending(false);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {EDITABLE_FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1">{f.label}</label>
            <input
              type={f.type ?? "text"}
              value={
                draft[f.key] === null || draft[f.key] === undefined
                  ? ""
                  : f.type === "date"
                  ? String(draft[f.key]).slice(0, 10)
                  : draft[f.key]
              }
              onChange={(e) => setField(f.key, e.target.value)}
              className="input"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {error && <span className="text-sm text-danger mr-auto">{error}</span>}
        {saved && !error && <span className="text-sm text-success mr-auto">Сохранено</span>}
        <button onClick={save} disabled={pending} className="btn btn-primary">
          {pending ? "Сохраняю…" : "Сохранить"}
        </button>
      </div>
    </div>
  );
}
