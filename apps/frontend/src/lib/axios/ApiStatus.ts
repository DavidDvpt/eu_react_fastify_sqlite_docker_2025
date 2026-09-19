export const ApiStatus = {
  IDLE: "IDLE",
  PENDING: "PENDING",
  FULFILLED: "FULFILLED",
  REJECTED: "REJECTED",
} as const;

export type ApiStatus = (typeof ApiStatus)[keyof typeof ApiStatus];
