import type { Prisma, PrismaClient } from "../../../prisma/generated/client.js";

// Keep compatibility between the root Prisma client and transaction-scoped clients.
export type PrismaModelClient<DelegateKey extends Prisma.ModelName> =
  | Pick<PrismaClient, Uncapitalize<DelegateKey>>
  | Pick<Prisma.TransactionClient, Uncapitalize<DelegateKey>>;

// Extract the argument type of a Prisma delegate method (handles generics/overloads).
type MethodArgs<Delegate, K extends keyof Delegate> = Delegate[K] extends (
  ...args: infer P
) => any
  ? NonNullable<P[0]>
  : never;

// Extract the resolved return type of a Prisma delegate method.
type MethodResult<Delegate, K extends keyof Delegate> = Delegate[K] extends (
  ...args: any[]
) => infer R
  ? Awaited<R>
  : never;

// Minimum shape a delegate must expose to be wrapped by this repository.
type CrudDelegate = {
  findMany(args?: any): Promise<any>;
  findUnique(args: any): Promise<any>;
  create(args: any): Promise<any>;
  update(args: any): Promise<any>;
  delete(args: any): Promise<any>;
};

// Thin wrapper that forwards Prisma delegate calls while preserving types.
export class PrismaCrudRepository<Delegate extends CrudDelegate> {
  constructor(protected readonly delegate: Delegate) {}

  findMany(
    args?: MethodArgs<Delegate, "findMany">
  ): Promise<MethodResult<Delegate, "findMany">> {
    return this.delegate.findMany(args as MethodArgs<Delegate, "findMany">);
  }

  findUnique(
    args: MethodArgs<Delegate, "findUnique">
  ): Promise<MethodResult<Delegate, "findUnique">> {
    return this.delegate.findUnique(args as MethodArgs<Delegate, "findUnique">);
  }

  create(
    args: MethodArgs<Delegate, "create">
  ): Promise<MethodResult<Delegate, "create">> {
    return this.delegate.create(args as MethodArgs<Delegate, "create">);
  }

  update(
    args: MethodArgs<Delegate, "update">
  ): Promise<MethodResult<Delegate, "update">> {
    return this.delegate.update(args as MethodArgs<Delegate, "update">);
  }

  delete(
    args: MethodArgs<Delegate, "delete">
  ): Promise<MethodResult<Delegate, "delete">> {
    return this.delegate.delete(args as MethodArgs<Delegate, "delete">);
  }
}
