class SortTools {
  static sortByName<T extends { name?: string }>(items: T[]): T[] {
    return [...items].sort((left, right) =>
      (left.name ?? "").localeCompare(right.name ?? "", "fr", {
        sensitivity: "base",
      })
    );
  }
}

export { SortTools };
