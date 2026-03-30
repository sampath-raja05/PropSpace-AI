import type { EmiCalculation, EmiCalculationInput } from "@/types";

const DEFAULT_DOWN_PAYMENT_RATIO = 0.2;
const DEFAULT_INTEREST_RATE = 8.5;
const DEFAULT_TENURE_YEARS = 20;
export const EMI_LIMITS = {
  downPaymentRatio: {
    min: 0.1,
    max: 0.6
  },
  annualInterestRate: {
    min: 5,
    max: 14
  },
  tenureYears: {
    min: 5,
    max: 30
  }
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function roundMetric(value: number, digits = 1) {
  return Number(value.toFixed(digits));
}

export function getDefaultEmiInput(propertyPrice: number): EmiCalculationInput {
  return {
    propertyPrice,
    downPayment: Math.round(propertyPrice * DEFAULT_DOWN_PAYMENT_RATIO),
    annualInterestRate: DEFAULT_INTEREST_RATE,
    tenureYears: DEFAULT_TENURE_YEARS
  };
}

export function calculateEmi({
  propertyPrice,
  downPayment,
  annualInterestRate,
  tenureYears
}: EmiCalculationInput): EmiCalculation {
  const safePropertyPrice = Math.max(Math.round(propertyPrice), 0);
  const safeDownPayment = clamp(Math.round(downPayment), 0, safePropertyPrice);
  const safeInterestRate = clamp(annualInterestRate, 0, 25);
  const safeTenureYears = clamp(Math.round(tenureYears), EMI_LIMITS.tenureYears.min, EMI_LIMITS.tenureYears.max);
  const tenureMonths = safeTenureYears * 12;
  const loanAmount = Math.max(safePropertyPrice - safeDownPayment, 0);
  const monthlyRate = safeInterestRate / 1200;

  let monthlyEmi = 0;

  if (loanAmount > 0) {
    monthlyEmi =
      monthlyRate === 0
        ? loanAmount / tenureMonths
        : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
          (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  }

  const totalLoanRepayment = monthlyEmi * tenureMonths;
  const totalInterest = Math.max(totalLoanRepayment - loanAmount, 0);
  const totalPayment = totalLoanRepayment + safeDownPayment;

  return {
    propertyPrice: safePropertyPrice,
    downPayment: safeDownPayment,
    downPaymentRatio: safePropertyPrice === 0 ? 0 : roundMetric((safeDownPayment / safePropertyPrice) * 100),
    loanAmount: Math.round(loanAmount),
    annualInterestRate: roundMetric(safeInterestRate, 2),
    tenureYears: safeTenureYears,
    tenureMonths,
    monthlyEmi: Math.round(monthlyEmi),
    totalInterest: Math.round(totalInterest),
    totalLoanRepayment: Math.round(totalLoanRepayment),
    totalPayment: Math.round(totalPayment),
    recommendedMonthlyIncome: monthlyEmi === 0 ? 0 : Math.ceil(monthlyEmi / 0.4),
    interestShare: totalLoanRepayment === 0 ? 0 : roundMetric((totalInterest / totalLoanRepayment) * 100),
    source: "local"
  };
}
