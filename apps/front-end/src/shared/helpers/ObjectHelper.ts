type SnakeToCamelCase<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}${Capitalize<SnakeToCamelCase<Tail>>}`
  : S;

type SnakeToCamelKeys<T> = T extends readonly (infer U)[]
  ? SnakeToCamelKeys<U>[]
  : T extends object
    ? {
        [K in keyof T as K extends string ? SnakeToCamelCase<K> : K]: SnakeToCamelKeys<T[K]>;
      }
    : T;

export class ObjectHelper {
  constructor() {}

  static omitUndefined<T extends Record<string, unknown>>(value: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(value).filter(([, entry]) => entry !== undefined)
    ) as Partial<T>;
  }

  static snakeToCamelKeys<T>(value: T): SnakeToCamelKeys<T>;
  static snakeToCamelKeys<T, K extends SnakeToCamelKeys<T>>(value: T): K;
  static snakeToCamelKeys<T>(value: T): SnakeToCamelKeys<T> {
    const normalizedValue = ObjectHelper.normalizeValue(value);

    if (normalizedValue !== value) {
      return normalizedValue as SnakeToCamelKeys<T>;
    }

    if (Array.isArray(value)) {
      return value.map((entry) => ObjectHelper.snakeToCamelKeys(entry)) as SnakeToCamelKeys<T>;
    }

    if (ObjectHelper.isPlainObject(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, entry]) => [
          ObjectHelper.toCamelCase(key),
          ObjectHelper.snakeToCamelKeys(entry),
        ])
      ) as SnakeToCamelKeys<T>;
    }

    return ObjectHelper.normalizeValue(value) as SnakeToCamelKeys<T>;
  }

  private static toCamelCase(value: string): string {
    return value.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
  }

  private static isPlainObject(value: unknown): value is Record<string, unknown> {
    return Object.prototype.toString.call(value) === "[object Object]";
  }

  private static normalizeValue<T>(value: T): T {
    if (typeof value === "number") {
      return Number(value) as T;
    }

    if (
      value !== null &&
      typeof value === "object" &&
      "constructor" in value &&
      typeof value.constructor === "function" &&
      value.constructor.name === "Decimal"
    ) {
      return Number(value) as T;
    }

    return value;
  }
}
