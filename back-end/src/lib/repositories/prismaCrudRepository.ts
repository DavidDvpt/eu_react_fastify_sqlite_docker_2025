/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Prisma, PrismaClient } from '../../../prisma/generated/client.js';

// Keep compatibility between the root Prisma client and transaction-scoped clients.
export type PrismaModelClient<DelegateKey extends Prisma.ModelName> =
  | Pick<PrismaClient, Uncapitalize<DelegateKey>>
  | Pick<Prisma.TransactionClient, Uncapitalize<DelegateKey>>;

// Extract the argument type of a Prisma delegate method (handles generics/overloads).
type MethodArgs<Delegate, K extends keyof Delegate> = Delegate[K] extends (..._args: infer P) => any
  ? NonNullable<P[0]>
  : never;

// Extract the resolved return type of a Prisma delegate method.
type MethodResult<Delegate, K extends keyof Delegate> = Delegate[K] extends (
  ..._args: any[]
) => infer R
  ? Awaited<R>
  : never;

// Minimum shape a delegate must expose to be wrapped by this repository.
type CrudDelegate = {
  findMany(_args?: any): Promise<any>;
  findUnique(_args: any): Promise<any>;
  create(_args: any): Promise<any>;
  update(_args: any): Promise<any>;
  delete(_args: any): Promise<any>;
};

// Thin wrapper that forwards Prisma delegate calls while preserving types.
export class PrismaCrudRepository<Delegate extends CrudDelegate> {
  constructor(protected readonly delegate: Delegate) {}

  findMany(args?: MethodArgs<Delegate, 'findMany'>): Promise<MethodResult<Delegate, 'findMany'>> {
    return this.delegate.findMany(args as MethodArgs<Delegate, 'findMany'>);
  }

  findUnique(
    args: MethodArgs<Delegate, 'findUnique'>
  ): Promise<MethodResult<Delegate, 'findUnique'>> {
    return this.delegate.findUnique(args);
  }

  create(args: MethodArgs<Delegate, 'create'>): Promise<MethodResult<Delegate, 'create'>> {
    return this.delegate.create(args);
  }

  update(args: MethodArgs<Delegate, 'update'>): Promise<MethodResult<Delegate, 'update'>> {
    return this.delegate.update(args);
  }

  delete(args: MethodArgs<Delegate, 'delete'>): Promise<MethodResult<Delegate, 'delete'>> {
    return this.delegate.delete(args);
  }
}
