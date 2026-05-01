class StringTools {
  static capitalizeFirstLetter(str: string): string {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  static parseBool(value: string | null): boolean | null {
    if (value === "true") return true;
    if (value === "false") return false;
    return null;
  }

  static normalizeString(value: string | null | undefined): string {
    return (value ?? "").trim().toLowerCase();
  }

  static toComparableValue(value: string | boolean | null | undefined): string {
    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }
    return value ?? "";
  }
}

export default StringTools;
