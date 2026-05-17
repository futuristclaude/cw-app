export type DealStage =
  | "intake"
  | "qualification"
  | "sourcing_mir"
  | "sourcing_china"
  | "engineering"
  | "logistics"
  | "customs"
  | "cost_check"
  | "pricing_kp"
  | "contract"
  | "prepayment"
  | "production_delivery"
  | "final_payment"
  | "act"
  | "realized"
  | "stage_lost"
  | "stage_cancelled";

export const STAGE_ORDER: DealStage[] = [
  "intake",
  "qualification",
  "sourcing_mir",
  "sourcing_china",
  "engineering",
  "logistics",
  "customs",
  "cost_check",
  "pricing_kp",
  "contract",
  "prepayment",
  "production_delivery",
  "final_payment",
  "act",
  "realized",
];

export const STAGE_LABELS: Record<DealStage, string> = {
  intake: "Приём",
  qualification: "Стратегический центр",
  sourcing_mir: "Закупщик МИР",
  sourcing_china: "Закупщик Китай",
  engineering: "Инженеры",
  logistics: "Логистика",
  customs: "Таможня",
  cost_check: "Себестоимость / ЭБ",
  pricing_kp: "Наценка / КП",
  contract: "Договор",
  prepayment: "Аванс",
  production_delivery: "Производство / Доставка",
  final_payment: "Фин. оплата",
  act: "Акт",
  realized: "Реализовано",
  stage_lost: "Проиграно",
  stage_cancelled: "Отменено",
};

export const STATUS_LABELS: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  on_hold: "Приостановлена",
  won: "Выиграна",
  lost: "Проиграна",
  cancelled: "Отменена",
};

export const DEAL_TYPE_LABELS: Record<string, string> = {
  direct: "Прямая закупка",
  offer: "Оферта",
  tender: "Тендер",
  kp_request: "Запрос КП",
  pre_research: "Предв. проработка",
};
