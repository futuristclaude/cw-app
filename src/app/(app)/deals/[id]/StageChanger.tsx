"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import { STAGE_ORDER, STAGE_LABELS, type DealStage } from "@/lib/stages";

export default function StageChanger({
  dealId,
  currentStage,
}: {
  dealId: string;
  currentStage: DealStage;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [target, setTarget] = useState<DealStage>(currentStage);

  async function move() {
    if (target === currentStage) return;
    setPending(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error: err } = await supabase
      .from("deals")
      .update({ current_stage: target })
      .eq("id", dealId);
    if (err) {
      setError(err.message);
      setPending(false);
      return;
    }
    router.refresh();
    setPending(false);
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted">Сейчас: {STAGE_LABELS[currentStage]}</div>
      <select value={target} onChange={(e) => setTarget(e.target.value as DealStage)} className="input">
        {STAGE_ORDER.map((s) => (
          <option key={s} value={s}>{STAGE_LABELS[s]}</option>
        ))}
        <option value="stage_lost">Проиграно</option>
        <option value="stage_cancelled">Отменено</option>
      </select>
      <button onClick={move} disabled={pending || target === currentStage} className="btn btn-primary w-full">
        {pending ? "Переношу…" : "Перенести"}
      </button>
      {error && <p className="text-sm text-danger">{error}</p>}
      <p className="text-xs text-muted">Запись останется во всех пройденных реестрах. Триггер пишет лог автоматически.</p>
    </div>
  );
}
