class FormatTools {
  private static buildZeroValue(decimals: number): string {
    const safeDecimals = Math.max(0, Math.trunc(decimals));
    return safeDecimals === 0 ? "0" : `0.${"0".repeat(safeDecimals)}`;
  }

  static trimTrailingZeros(value: string, minimumDecimals = 0): string {
    const safeMinimumDecimals = Math.max(0, Math.trunc(minimumDecimals));
    const [integerPart, fractionPart = ""] = value.split(".");

    if (fractionPart === "") {
      return safeMinimumDecimals > 0
        ? `${integerPart}.${"0".repeat(safeMinimumDecimals)}`
        : integerPart;
    }

    const trimmedFraction = fractionPart.replace(/0+$/, "");
    if (trimmedFraction.length >= safeMinimumDecimals) {
      return trimmedFraction.length > 0
        ? `${integerPart}.${trimmedFraction}`
        : integerPart;
    }

    return `${integerPart}.${trimmedFraction.padEnd(safeMinimumDecimals, "0")}`;
  }

  static toSafeNumber(value: unknown): number {
    return typeof value === "number" && Number.isFinite(value) ? value : 0;
  }

  static formatToDecimals(value: unknown, decimals: number): string {
    const numericValue = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(numericValue)) {
      return FormatTools.buildZeroValue(decimals);
    }

    return numericValue.toFixed(Math.max(0, Math.trunc(decimals)));
  }

  static formatToFiveDecimals(value: unknown): string {
    return FormatTools.formatToDecimals(value, 5);
  }

  static formatToThreeDecimals(value: unknown): string {
    return FormatTools.formatToDecimals(value, 3);
  }

  static pedFormat() {
    return new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  static dateFrShort(value: string | Date | null | undefined): string {
    if (!value) {
      return "-";
    }

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(date);
  }
}

export { FormatTools };
export default FormatTools;
