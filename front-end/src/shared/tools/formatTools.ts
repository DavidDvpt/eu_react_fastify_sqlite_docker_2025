class FormatTools {
  private static buildZeroValue(decimals: number): string {
    const safeDecimals = Math.max(0, Math.trunc(decimals));
    return safeDecimals === 0
      ? "0"
      : `0.${"0".repeat(safeDecimals)}`;
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
