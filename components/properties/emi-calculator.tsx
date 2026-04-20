"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { CalendarClock, Landmark, LoaderCircle, Percent, Wallet } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { getEmiCalculation } from "@/lib/api";
import { calculateEmi, EMI_LIMITS, getDefaultEmiInput } from "@/lib/emi";
import { formatCompactCurrency, formatCurrency } from "@/lib/utils";
import type { EmiCalculation, EmiCalculationInput } from "@/types";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function sliderBackground(progress: number) {
  return {
    background: `linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary)) ${progress}%, rgba(148, 163, 184, 0.18) ${progress}%, rgba(148, 163, 184, 0.18) 100%)`
  };
}

function SliderControl({
  label,
  valueLabel,
  helper,
  minLabel,
  maxLabel,
  min,
  max,
  step,
  value,
  onChange
}: {
  label: string;
  valueLabel: string;
  helper: string;
  minLabel: string;
  maxLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  const progress = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <div className="min-w-0 rounded-[24px] bg-white/60 p-5 dark:bg-slate-800/50">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{label}</p>
          <p className="mt-2 max-w-[20rem] text-xs leading-5 text-muted-foreground">{helper}</p>
        </div>
        <div className="max-w-full self-start rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium leading-tight text-primary tabular-nums sm:text-sm">
          {valueLabel}
        </div>
      </div>

      <div className="mt-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="emi-slider"
          style={sliderBackground(progress)}
        />
        <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-muted-foreground sm:text-xs">
          <span className="tabular-nums">{minLabel}</span>
          <span className="tabular-nums text-right">{maxLabel}</span>
        </div>
      </div>
    </div>
  );
}

export function EmiCalculator({
  propertyId,
  propertyPrice,
  propertyTitle
}: {
  propertyId: string;
  propertyPrice: number;
  propertyTitle: string;
}) {
  const defaultInput = getDefaultEmiInput(propertyPrice);
  const [input, setInput] = useState<EmiCalculationInput>(defaultInput);
  const [result, setResult] = useState<EmiCalculation>(() => calculateEmi(defaultInput));
  const [isSyncing, setIsSyncing] = useState(false);
  const lastPropertyId = useRef(propertyId);

  useEffect(() => {
    if (lastPropertyId.current === propertyId && input.propertyPrice === propertyPrice) {
      return;
    }

    lastPropertyId.current = propertyId;
    const nextInput = getDefaultEmiInput(propertyPrice);
    setInput(nextInput);
    setResult(calculateEmi(nextInput));
  }, [input.propertyPrice, propertyId, propertyPrice]);

  function updateInput(patch: Partial<EmiCalculationInput>) {
    const nextInput = {
      ...input,
      ...patch,
      propertyPrice
    };

    setInput(nextInput);
    setResult(calculateEmi(nextInput));
  }

  useEffect(() => {
    let isActive = true;
    const timer = window.setTimeout(async () => {
      setIsSyncing(true);

      try {
        const calculation = await getEmiCalculation(propertyId, input);

        if (!isActive) {
          return;
        }

        startTransition(() => {
          setResult(calculation);
        });
      } finally {
        if (isActive) {
          setIsSyncing(false);
        }
      }
    }, 250);

    return () => {
      isActive = false;
      window.clearTimeout(timer);
    };
  }, [input, propertyId]);

  const downPaymentMin = Math.round(propertyPrice * EMI_LIMITS.downPaymentRatio.min);
  const downPaymentMax = Math.round(propertyPrice * EMI_LIMITS.downPaymentRatio.max);
  const downPaymentStep = Math.max(Math.round(propertyPrice * 0.01), 50000);

  return (
    <GlassCard className="overflow-hidden p-5 sm:p-6">
      <div className="relative">
        <div className="pointer-events-none absolute -right-12 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="hero-chip">EMI planner</p>
            <h2 className="mt-4 text-3xl">Slide through the financing plan for {propertyTitle}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Tune down payment, interest, and tenure with sliders to see the live EMI impact instantly.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm dark:bg-slate-800/55">
            {isSyncing ? <LoaderCircle className="h-4 w-4 animate-spin text-primary" /> : <Landmark className="h-4 w-4 text-primary" />}
            <span>{isSyncing ? "Syncing with backend" : result.source === "api" ? "Live backend result" : "Local estimate fallback"}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        <SliderControl
          label="Down payment"
          helper={`${result.downPaymentRatio.toFixed(1)}% of the property value`}
          valueLabel={formatCurrency(input.downPayment)}
          minLabel={formatCompactCurrency(downPaymentMin)}
          maxLabel={formatCompactCurrency(downPaymentMax)}
          min={downPaymentMin}
          max={downPaymentMax}
          step={downPaymentStep}
          value={input.downPayment}
          onChange={(value) =>
            updateInput({
              downPayment: clamp(value, downPaymentMin, downPaymentMax)
            })
          }
        />

        <SliderControl
          label="Interest rate"
          helper="Indicative annual reducing-balance loan rate"
          valueLabel={`${input.annualInterestRate.toFixed(1)}%`}
          minLabel={`${EMI_LIMITS.annualInterestRate.min.toFixed(1)}%`}
          maxLabel={`${EMI_LIMITS.annualInterestRate.max.toFixed(1)}%`}
          min={EMI_LIMITS.annualInterestRate.min}
          max={EMI_LIMITS.annualInterestRate.max}
          step={0.1}
          value={input.annualInterestRate}
          onChange={(value) =>
            updateInput({
              annualInterestRate: clamp(value, EMI_LIMITS.annualInterestRate.min, EMI_LIMITS.annualInterestRate.max)
            })
          }
        />

        <SliderControl
          label="Tenure"
          helper={`${result.tenureMonths} monthly installments`}
          valueLabel={`${input.tenureYears} years`}
          minLabel={`${EMI_LIMITS.tenureYears.min} years`}
          maxLabel={`${EMI_LIMITS.tenureYears.max} years`}
          min={EMI_LIMITS.tenureYears.min}
          max={EMI_LIMITS.tenureYears.max}
          step={1}
          value={input.tenureYears}
          onChange={(value) =>
            updateInput({
              tenureYears: clamp(value, EMI_LIMITS.tenureYears.min, EMI_LIMITS.tenureYears.max)
            })
          }
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          {
            label: "Monthly EMI",
            value: formatCurrency(result.monthlyEmi),
            icon: Wallet,
            tone: "text-primary"
          },
          {
            label: "Loan amount",
            value: formatCurrency(result.loanAmount),
            icon: Landmark,
            tone: "text-emerald-600 dark:text-emerald-300"
          },
          {
            label: "Total interest",
            value: formatCurrency(result.totalInterest),
            icon: Percent,
            tone: "text-teal-600 dark:text-teal-300"
          },
          {
            label: "Total repayment",
            value: formatCurrency(result.totalLoanRepayment),
            icon: CalendarClock,
            tone: "text-primary"
          },
          {
            label: "Total outflow",
            value: formatCurrency(result.totalPayment),
            icon: Landmark,
            tone: "text-emerald-700 dark:text-emerald-200"
          },
          {
            label: "Suggested income",
            value: formatCurrency(result.recommendedMonthlyIncome),
            icon: Wallet,
            tone: "text-teal-700 dark:text-teal-200"
          }
        ].map((item) => (
          <div key={item.label} className="flex min-h-[12rem] min-w-0 flex-col rounded-[24px] bg-white/60 p-4 dark:bg-slate-800/50">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-background/70 ${item.tone}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-[clamp(1.2rem,2vw,1.85rem)] font-semibold leading-[1.1] tracking-tight tabular-nums [overflow-wrap:anywhere]">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[24px] bg-primary/6 p-5">
          <p className="text-sm leading-7 text-muted-foreground">
            Interest forms <span className="font-semibold text-foreground">{result.interestShare.toFixed(1)}%</span> of your loan repayment in this scenario.
            Suggested monthly income assumes the EMI stays within a 40% FOIR comfort band.
          </p>
        </div>
        <div className="rounded-[24px] bg-white/60 p-5 dark:bg-slate-800/50">
          <p className="text-sm text-muted-foreground">Price reference</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(propertyPrice)}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Use the sliders above to compare safer entry plans against faster payoff options.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
