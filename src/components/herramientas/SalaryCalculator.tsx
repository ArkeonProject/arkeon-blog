import { useEffect, useMemo, useRef, useState } from "react";
import { FiBarChart2, FiPlus, FiMinus, FiChevronDown } from "react-icons/fi";
import Card from "@/components/ui/Card";
import {
  BASE_GROSS_RANGE_MAX,
  EMPLOYER_SS_RATE_IT_APPROX,
  GROSS_INPUT_STEP,
  NET_TARGET_INPUT_STEP,
  TERRITORY_GROUPS,
  calculateEmployerCostIT,
  calculateHourlyRates,
  clampNetTargetPerPay,
  clampAnnualGross,
  createCalculatorState,
  fmtMoney,
  pct,
  roundToStep,
  syncGrossFromNetTarget,
  syncNetTargetFromGross,
  type AgeRange,
  type CalculatorState,
  type SalaryInputMode,
} from "@/utils/salaryCalculator";

const MIN_COMPARE = 2;
const MAX_COMPARE = 4;

function fmtMoneyPrecise(n: number): string {
  return `${n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

function roundToDecimals(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

type SelectOption = {
  value: string;
  label: string;
  group?: string;
};

function StructuredSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const listboxId = useRef(`listbox-${Math.random().toString(36).slice(2, 9)}`);
  const selected = options.find((opt) => opt.value === value) ?? options[0];
  const selectedIndex = Math.max(0, options.findIndex((opt) => opt.value === value));

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setHighlightedIndex(selectedIndex);
      requestAnimationFrame(() => {
        listboxRef.current?.focus();
      });
    }
  }, [open, selectedIndex]);

  const selectByIndex = (index: number) => {
    const item = options[index];
    if (!item) return;
    onChange(item.value);
    setOpen(false);
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setHighlightedIndex(selectedIndex);
      } else {
        setHighlightedIndex((prev) => Math.min(options.length - 1, prev + 1));
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setHighlightedIndex(selectedIndex);
      } else {
        setHighlightedIndex((prev) => Math.max(0, prev - 1));
      }
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open && highlightedIndex >= 0) {
        selectByIndex(highlightedIndex);
      } else {
        setOpen((prev) => !prev);
      }
    }
  };

  const onListboxKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.min(options.length - 1, prev + 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.max(0, prev - 1));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      selectByIndex(highlightedIndex >= 0 ? highlightedIndex : selectedIndex);
    }
  };

  let previousGroup = "";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-left text-base text-foreground shadow-sm transition-all duration-200 hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId.current}
        onKeyDown={onTriggerKeyDown}
      >
        <span className="truncate">{selected?.label ?? "-"}</span>
        <FiChevronDown className={`shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div
          id={listboxId.current}
          ref={listboxRef}
          className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-30 max-h-72 overflow-y-auto rounded-xl border border-border bg-surface p-1 shadow-2xl"
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={highlightedIndex >= 0 ? `${listboxId.current}-opt-${highlightedIndex}` : undefined}
          onKeyDown={onListboxKeyDown}
        >
          {options.map((option) => {
            const showGroup = option.group && option.group !== previousGroup;
            if (option.group) previousGroup = option.group;
            const optionIndex = options.findIndex((item) => item.value === option.value);
            const isHighlighted = optionIndex === highlightedIndex;
            return (
              <div key={`${option.group ?? ""}-${option.value}`}>
                {showGroup ? (
                  <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/80">
                    {option.group}
                  </p>
                ) : null}
                <button
                  id={`${listboxId.current}-opt-${optionIndex}`}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    option.value === value
                      ? "bg-primary/12 text-primary"
                      : isHighlighted
                        ? "bg-muted/70 text-foreground"
                        : "text-foreground hover:bg-muted/60"
                  }`}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <span>{option.label}</span>
                  {option.value === value ? <span className="text-xs">●</span> : null}
                </button>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function ScenarioCard({
  state,
  index,
  mode,
  onChange,
}: {
  state: CalculatorState;
  index: number;
  mode: SalaryInputMode;
  onChange: (next: CalculatorState) => void;
}) {
  const nextState = { ...state };
  const data = mode === "net" ? syncGrossFromNetTarget(nextState) : syncNetTargetFromGross(nextState);
  const netPerPay = data.net / nextState.pagas;
  const grossPerPay = data.g / nextState.pagas;
  const discountPerPay = (data.ss + data.tax) / nextState.pagas;
  const employerRate = nextState.employerMode === "custom"
    ? Math.min(1, Math.max(0, nextState.employerCustomRate || 0))
    : EMPLOYER_SS_RATE_IT_APPROX;
  const employer = calculateEmployerCostIT(data.g, employerRate);
  const hourly = calculateHourlyRates(data.g, data.net);

  const currentValue = mode === "net" ? nextState.netoObjetivoPaga : nextState.bruto;
  const hoursPerPay = hourly.annualHours / nextState.pagas;
  const isNetPerHour = mode === "net" && nextState.netTargetUnit === "hour";
  const currentNetPerHour = hoursPerPay > 0 ? nextState.netoObjetivoPaga / hoursPerPay : 0;
  const netInputValue = isNetPerHour ? currentNetPerHour : nextState.netoObjetivoPaga;
  const netInputDisplayValue = isNetPerHour ? roundToDecimals(netInputValue, 2) : Math.round(netInputValue);
  const sliderMax = mode === "net"
    ? (isNetPerHour ? Math.max(80, Math.ceil((netPerPay * 1.8) / Math.max(hoursPerPay, 1))) : Math.max(6000, Math.ceil(netPerPay * 1.8)))
    : Math.max(BASE_GROSS_RANGE_MAX, Math.ceil(nextState.bruto / 50000) * 50000);

  const update = (patch: Partial<CalculatorState>) => {
    onChange({ ...nextState, ...patch });
  };

  const [customRateInput, setCustomRateInput] = useState((nextState.employerCustomRate * 100).toFixed(2));
  const [isEditingCustomRate, setIsEditingCustomRate] = useState(false);

  useEffect(() => {
    if (!isEditingCustomRate) {
      setCustomRateInput((nextState.employerCustomRate * 100).toFixed(2));
    }
  }, [nextState.employerCustomRate, isEditingCustomRate]);

  const territoryOptions = TERRITORY_GROUPS.flatMap((group) =>
    group.options.map((option) => ({ value: option.value, label: option.label, group: group.label }))
  );
  const childrenOptions = [0, 1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) }));
  const ageOptions = [
    { value: "menor65", label: "Menor de 65" },
    { value: "65-74", label: "De 65 a 74" },
    { value: "75+", label: "75 o más" },
  ];
  const pagasOptions = [12, 13, 14, 15, 16].map((n) => ({ value: String(n), label: `${n} pagas` }));

  return (
    <Card className="relative p-7 md:p-8 space-y-8 border-primary/20 shadow-xl shadow-primary/10">
      <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <h3 className="font-display text-2xl md:text-3xl text-primary">Supuesto fiscal {index + 1}</h3>
        <span className="text-sm uppercase tracking-wide text-muted-foreground">España 2026</span>
      </div>

      <div className="relative space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">{mode === "net" ? "Neto objetivo" : "Salario bruto anual"}</p>
          {mode === "net" ? (
            <div className="inline-flex rounded-full border border-border bg-background p-1">
              <button
                type="button"
                onClick={() => update({ netTargetUnit: "pay" })}
                className={`rounded-full px-3 py-1 text-xs ${nextState.netTargetUnit === "pay" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                Por paga
              </button>
              <button
                type="button"
                onClick={() => update({ netTargetUnit: "hour" })}
                className={`rounded-full px-3 py-1 text-xs ${nextState.netTargetUnit === "hour" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                Por hora
              </button>
            </div>
          ) : null}
        </div>
        <p className="font-display text-5xl md:text-6xl text-foreground leading-none">{mode === "net" && isNetPerHour ? fmtMoneyPrecise(netInputDisplayValue) : fmtMoney(mode === "net" ? netInputDisplayValue : currentValue)}{isNetPerHour ? <span className="ml-2 text-2xl text-muted-foreground">/h</span> : null}</p>
        <input
          type="range"
          min={0}
          max={sliderMax}
          step={mode === "net" ? (isNetPerHour ? 0.01 : NET_TARGET_INPUT_STEP) : GROSS_INPUT_STEP}
          value={mode === "net" ? netInputDisplayValue : currentValue}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (mode === "net") {
              const asPerPay = isNetPerHour ? value * hoursPerPay : value;
              update({ netoObjetivoPaga: clampNetTargetPerPay(roundToStep(asPerPay, NET_TARGET_INPUT_STEP), nextState) });
            }
            else update({ bruto: clampAnnualGross(roundToStep(value, GROSS_INPUT_STEP)) });
          }}
          className="w-full h-2 accent-primary cursor-pointer"
        />
        <div className="flex items-center gap-3 text-base">
          <input
            type="number"
            min={0}
            max={sliderMax}
            step={mode === "net" ? (isNetPerHour ? 0.01 : NET_TARGET_INPUT_STEP) : GROSS_INPUT_STEP}
            value={mode === "net" ? netInputDisplayValue : currentValue}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (mode === "net") {
                const asPerPay = isNetPerHour ? value * hoursPerPay : value;
                update({ netoObjetivoPaga: clampNetTargetPerPay(asPerPay, nextState) });
              }
              else update({ bruto: clampAnnualGross(value) });
            }}
            onBlur={(e) => {
              const value = Number(e.target.value);
              if (mode === "net") {
                const asPerPay = isNetPerHour ? value * hoursPerPay : value;
                update({ netoObjetivoPaga: clampNetTargetPerPay(roundToStep(asPerPay, NET_TARGET_INPUT_STEP), nextState) });
              }
              else update({ bruto: clampAnnualGross(roundToStep(value, GROSS_INPUT_STEP)) });
            }}
            className="w-44 rounded-xl border border-border bg-background px-4 py-3 text-lg font-semibold"
          />
          <span className="text-muted-foreground font-medium">{isNetPerHour ? "EUR/h" : "EUR"}</span>
        </div>
        {mode === "net" ? (
          <p className="text-base text-muted-foreground">Bruto anual estimado: <span className="font-semibold text-primary">{fmtMoney(data.g)}</span></p>
        ) : null}
      </div>

      <div className="relative grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
          <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Comunidad o régimen</label>
          <div className="mt-2">
            <StructuredSelect
              value={nextState.territorio}
              onChange={(value) => update({ territorio: value as CalculatorState["territorio"] })}
              options={territoryOptions}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
          <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Número de hijos</label>
          <div className="mt-2">
            <StructuredSelect
              value={String(nextState.hijos)}
              onChange={(value) => update({ hijos: Number(value) })}
              options={childrenOptions}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
          <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Edad del contribuyente</label>
          <div className="mt-2">
            <StructuredSelect
              value={nextState.rangoEdad}
              onChange={(value) => update({ rangoEdad: value as AgeRange })}
              options={ageOptions}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
          <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Número de pagas</label>
          <div className="mt-2">
            <StructuredSelect
              value={String(nextState.pagas)}
              onChange={(value) => update({ pagas: Number(value) })}
              options={pagasOptions}
            />
          </div>
        </div>
      </div>

      <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card elevate={false} className="p-4 border-emerald-500/30"><p className="text-sm text-muted-foreground">Neto anual</p><p className="text-2xl md:text-3xl font-bold text-emerald-500 mt-1">{fmtMoney(data.net)}</p></Card>
        <Card elevate={false} className="p-4 border-emerald-500/30"><p className="text-sm text-muted-foreground">Neto por paga</p><p className="text-2xl md:text-3xl font-bold text-emerald-500 mt-1">{fmtMoney(netPerPay)}</p></Card>
        <Card elevate={false} className="p-4 border-rose-500/30"><p className="text-sm text-muted-foreground">IRPF efectivo</p><p className="text-2xl md:text-3xl font-bold text-rose-500 mt-1">{pct(data.tr)}</p></Card>
        <Card elevate={false} className="p-4 border-rose-500/30"><p className="text-sm text-muted-foreground">Carga total</p><p className="text-2xl md:text-3xl font-bold text-rose-500 mt-1">{pct(data.eff)}</p></Card>
      </div>

      <div className="relative rounded-2xl border border-border bg-muted/30 p-5 space-y-3 text-base">
        <div className="flex justify-between"><span className="text-muted-foreground">Bruto anual</span><span>{fmtMoney(data.g)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Cotización SS (6,48%)</span><span className="text-rose-500">- {fmtMoney(data.ss)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">IRPF final estimado</span><span className="text-rose-500">- {fmtMoney(data.tax)}</span></div>
        <div className="flex justify-between border-t border-border pt-2"><span className="font-semibold">Neto anual</span><span className="font-semibold text-emerald-500">{fmtMoney(data.net)}</span></div>
      </div>

      <div>
        <div className="h-4 overflow-hidden rounded-full border border-border bg-muted flex">
          <div className="bg-emerald-500" style={{ width: `${(data.np * 100).toFixed(1)}%` }} />
          <div className="bg-slate-400" style={{ width: `${(data.sp * 100).toFixed(1)}%` }} />
          <div className="bg-orange-400" style={{ width: `${(data.ip * 100).toFixed(1)}%` }} />
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span>Neto {pct(data.np)}</span>
          <span>SS {pct(data.sp)}</span>
          <span>IRPF {pct(data.ip)}</span>
        </div>
      </div>

      <div className="relative rounded-2xl border border-border p-5">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Desglose por paga ({nextState.pagas} pagas)</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div><p className="text-sm text-muted-foreground">Bruto por paga</p><p className="text-xl font-semibold">{fmtMoney(grossPerPay)}</p></div>
          <div><p className="text-sm text-muted-foreground">Deducciones</p><p className="text-xl font-semibold text-rose-500">- {fmtMoney(discountPerPay)}</p></div>
          <div><p className="text-sm text-muted-foreground">Neto por paga</p><p className="text-xl font-semibold text-emerald-500">{fmtMoney(netPerPay)}</p></div>
        </div>
      </div>

      <div className="relative rounded-2xl border border-border p-5 bg-muted/20">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Coste real para la empresa (estimado IT)</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Salario bruto anual</p>
            <p className="text-xl font-semibold">{fmtMoney(data.g)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cotización empresa ({pct(employer.employerRate)})</p>
            <p className="text-xl font-semibold text-orange-500">+ {fmtMoney(employer.employerSS)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Coste total empresa</p>
            <p className="text-2xl font-bold text-primary">{fmtMoney(employer.totalCompanyCost)}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Estimación para departamentos IT. El porcentaje empresarial varía por CNAE, contingencias específicas y normativa vigente.
        </p>

        <div className="mt-4 border-t border-border/70 pt-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Configuración avanzada</p>
          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="inline-flex rounded-full border border-border bg-background p-1">
              <button
                type="button"
                onClick={() => update({ employerMode: "it" })}
                className={`rounded-full px-3 py-1.5 text-xs ${nextState.employerMode === "it" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                IT estandar (32,07%)
              </button>
              <button
                type="button"
                onClick={() => update({ employerMode: "custom" })}
                className={`rounded-full px-3 py-1.5 text-xs ${nextState.employerMode === "custom" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                Personalizado (%)
              </button>
            </div>

            {nextState.employerMode === "custom" ? (
              <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                Tipo empresa
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={customRateInput}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setCustomRateInput(raw);
                    const percent = Number(raw);
                    if (!Number.isNaN(percent)) {
                      update({ employerCustomRate: Math.min(1, Math.max(0, percent / 100)) });
                    }
                  }}
                  onFocus={() => setIsEditingCustomRate(true)}
                  onBlur={() => {
                    setIsEditingCustomRate(false);
                    const percent = Number(customRateInput);
                    const safePercent = Number.isNaN(percent) ? 0 : Math.min(100, Math.max(0, percent));
                    update({ employerCustomRate: safePercent / 100 });
                    setCustomRateInput(safePercent.toFixed(2));
                  }}
                  className="w-24 rounded-lg border border-border bg-background px-2 py-1 text-sm text-foreground"
                />
                %
              </label>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative rounded-2xl border border-border p-5 bg-muted/20">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Valor por hora (estimado IT)</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Bruto por hora</p>
            <p className="text-2xl font-semibold">{fmtMoneyPrecise(hourly.grossPerHour)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Neto por hora</p>
            <p className="text-2xl font-semibold text-emerald-500">{fmtMoneyPrecise(hourly.netPerHour)}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Cálculo sobre {hourly.annualHours.toLocaleString("es-ES")} h/año (40 h/semana).
        </p>
      </div>
    </Card>
  );
}

export default function SalaryCalculator() {
  const [inputMode, setInputMode] = useState<SalaryInputMode>("gross");
  const [compareMode, setCompareMode] = useState(false);
  const [count, setCount] = useState(2);
  const [calculators, setCalculators] = useState<CalculatorState[]>([
    createCalculatorState({ bruto: 24000, pagas: 12, territorio: "andalucia" }),
    createCalculatorState({ bruto: 41600, pagas: 14, territorio: "cataluna" }),
  ]);

  const visibleCount = compareMode ? count : 1;
  const visibleCalculators = useMemo(() => {
    const arr = [...calculators];
    while (arr.length < visibleCount) arr.push(createCalculatorState({ ...arr[arr.length - 1] }));
    return arr.slice(0, visibleCount);
  }, [calculators, visibleCount]);

  const setCalculator = (index: number, next: CalculatorState) => {
    setCalculators((prev) => {
      const draft = [...prev];
      while (draft.length <= index) draft.push(createCalculatorState());
      draft[index] = next;
      return draft;
    });
  };

  return (
    <section className="space-y-6">
      <Card className="max-w-4xl mx-auto p-5 md:p-6 grid gap-4 md:grid-cols-3 md:items-center border-primary/20 shadow-xl shadow-primary/10">
        <div className="flex justify-center md:justify-start">
          <div className="inline-flex rounded-full border border-border bg-background p-1.5">
          <button
            type="button"
            onClick={() => setInputMode("gross")}
            className={`rounded-full px-5 py-2.5 text-base font-medium ${inputMode === "gross" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            Bruto anual
          </button>
          <button
            type="button"
            onClick={() => setInputMode("net")}
            className={`rounded-full px-5 py-2.5 text-base font-medium ${inputMode === "net" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            Neto por paga
          </button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          {compareMode ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-2.5 py-1.5 text-base text-muted-foreground bg-background">
              <button
                type="button"
                onClick={() => setCount((v) => Math.max(MIN_COMPARE, v - 1))}
                disabled={count <= MIN_COMPARE}
                className="rounded-full border border-border p-1.5 disabled:opacity-40"
              >
                <FiMinus />
              </button>
              <span className="min-w-32 text-center font-medium">{count} supuestos</span>
              <button
                type="button"
                onClick={() => setCount((v) => Math.min(MAX_COMPARE, v + 1))}
                disabled={count >= MAX_COMPARE}
                className="rounded-full border border-border p-1.5 disabled:opacity-40"
              >
                <FiPlus />
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 text-base font-medium text-muted-foreground"><FiBarChart2 /> Modo individual</div>
          )}
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="inline-flex rounded-full border border-border bg-background p-1.5">
            <button
              type="button"
              onClick={() => setCompareMode(false)}
              className={`rounded-full px-5 py-2.5 text-base font-medium ${!compareMode ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Calcular
            </button>
            <button
              type="button"
              onClick={() => setCompareMode(true)}
              className={`rounded-full px-5 py-2.5 text-base font-medium ${compareMode ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Comparar
            </button>
          </div>
        </div>
      </Card>

      <div className={`grid gap-6 ${compareMode ? "xl:grid-cols-2" : "grid-cols-1 max-w-4xl mx-auto"}`}>
        {visibleCalculators.map((state, i) => (
          <ScenarioCard key={i} state={state} index={i} mode={inputMode} onChange={(next) => setCalculator(i, next)} />
        ))}
      </div>
    </section>
  );
}
