class FormatTools {
  static formatToFiveDecimals(value: unknown): string {
    const numericValue = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(numericValue)) {
      return "0.00000";
    }

    return numericValue.toFixed(5);
  }

  static pedFormat() {
    return new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

export { FormatTools };
