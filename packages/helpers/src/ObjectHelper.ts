export class ObjectHelper {
  constructor() {}

  static omitUndefined<T extends Record<string, unknown>>(value: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(value).filter(([, entry]) => entry !== undefined)
    ) as Partial<T>;
  }
}
