export class NumberHelper {
  constructor() {}

  static round(value: number, decimals = 2): number {
    const factor = 10 ** decimals;

    return Math.round(Number(value) * factor) / factor;
  }
}
