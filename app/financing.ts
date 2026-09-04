export const EPANAYO_ANNUAL_RATE = 0.12;
export const BANK_ANNUAL_RATE = 0.12;
export const INSURANCE_RATE = 0.03;
export const APPLICATION_FEE = 500;

export function loan(principal: number, rate: number, years: number) {
  if (principal <= 0) return { monthly: 0, interest: 0, total: 0 };
  const monthlyRate = rate / 12,
    months = years * 12,
    monthly =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1),
    total = monthly * months;
  return { monthly, interest: total - principal, total };
}

export function calculateFinancing(
  total: number,
  depositPct: number,
  financeDeposit: boolean,
) {
  const deposit = (total * depositPct) / 100;
  const insurance = total * INSURANCE_RATE;
  const epanayoPrincipal = total - deposit;
  const bankPrincipal = financeDeposit ? deposit : 0;
  const rows = [5, 10, 15].map((duration) => {
    const main = loan(epanayoPrincipal, EPANAYO_ANNUAL_RATE, duration);
    const bank = loan(bankPrincipal, BANK_ANNUAL_RATE, duration);

    return {
      duration,
      monthly: main.monthly + bank.monthly,
      epanayoMonthly: main.monthly,
      bankMonthly: bank.monthly,
      interest: main.interest + bank.interest,
      totalCredit: main.total + bank.total,
    };
  });

  return {
    total,
    deposit,
    insurance,
    epanayoPrincipal,
    bankPrincipal,
    upfront: insurance + APPLICATION_FEE + (financeDeposit ? 0 : deposit),
    rows,
    financed: epanayoPrincipal + bankPrincipal,
  };
}
