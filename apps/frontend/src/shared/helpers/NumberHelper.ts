export class NumberHelper {
  constructor() {}

  static round(value: number, decimals = 2): number {
    const factor = 10 ** decimals;

    return Math.round(Number(value) * factor) / factor;
  }

  /** Greatest common divisor of two positive integers (Euclid). */
  static gcd(a: number, b: number): number {
    let x = Math.abs(Math.trunc(a));
    let y = Math.abs(Math.trunc(b));

    while (y !== 0) {
      const remainder = x % y;
      x = y;
      y = remainder;
    }

    return x;
  }

  /** Least common multiple of any number of positive integers. */
  static lcm(...values: number[]): number {
    if (values.length === 0) return 0;

    return values.reduce((acc, value) => {
      const v = Math.abs(Math.trunc(value));
      if (acc === 0 || v === 0) return 0;

      return (acc * v) / NumberHelper.gcd(acc, v);
    }, 1);
  }
}
