class ArrayTools {
  static sortByName<T extends { name?: string }>(items: T[]): T[] {
    return [...items].sort((left, right) =>
      (left.name ?? "").localeCompare(right.name ?? "", "fr", {
        sensitivity: "base",
      }),
    );
  }

  static indexById<T extends { id: string | number }>(array: T[]) {
    return array.reduce<Record<string, T>>((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }
}

export default ArrayTools;
