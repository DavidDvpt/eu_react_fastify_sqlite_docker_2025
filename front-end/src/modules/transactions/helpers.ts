export function feeCalculation(markup: number) {
  if (markup <= 0) return 0.5;

  const value = (99.5 * markup + 995) / (markup + 1990);

  if (value >= 100) return 100;
  return Math.floor(value * 100) / 100;
}
