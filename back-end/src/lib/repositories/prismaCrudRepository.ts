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
  findFirst(_args?: any): Promise<any>;
  findUnique(_args: any): Promise<any>;
  create(_args: any): Promise<any>;
  update(_args: any): Promise<any>;
  delete(_args: any): Promise<any>;
};

type ReadScope = 'none' | 'user-only' | 'global-and-user';

type CrudRepositoryOptions = {
  readScope?: ReadScope;
  userField?: string;
};

// Thin wrapper that forwards Prisma delegate calls while preserving types.
export class PrismaCrudRepository<Delegate extends CrudDelegate> {
  protected readonly readScope: ReadScope;
  protected readonly userField: string;

  constructor(
    protected readonly delegate: Delegate,
    options?: CrudRepositoryOptions
  ) {
    this.readScope = options?.readScope ?? 'none';
    this.userField = options?.userField ?? 'user_id';
  }

  protected mergeWhereWithUserScope(where: unknown, userId?: string): unknown {
    if (!userId || this.readScope === 'none') {
      return where;
    }

    if (this.readScope === 'global-and-user') {
      return {
        AND: [
          (where as Record<string, unknown>) ?? {},
          {
            OR: [{ [this.userField]: null }, { [this.userField]: userId }],
          },
        ],
      };
    }

    return {
      AND: [(where as Record<string, unknown>) ?? {}, { [this.userField]: userId }],
    };
  }

  // Mutations are owner-only: global rows (user_id = null) are read-only.
  protected async canMutateForUser(where: unknown, userId: string): Promise<boolean> {
    const record = (await this.delegate.findUnique({
      where,
    } as unknown as MethodArgs<Delegate, 'findUnique'>)) as unknown;

    if (!record || typeof record !== 'object') {
      return false;
    }

    const ownerId = (record as Record<string, unknown>)[this.userField];
    return typeof ownerId === 'string' && ownerId === userId;
  }

  findMany(
    args?: MethodArgs<Delegate, 'findMany'>,
    userId?: string
  ): Promise<MethodResult<Delegate, 'findMany'>> {
    if (!userId || this.readScope === 'none') {
      return this.delegate.findMany(args as MethodArgs<Delegate, 'findMany'>);
    }

    // Read scope is enforced at query level for list endpoints.
    const baseArgs = (args ?? {}) as Record<string, unknown>;
    const where = this.mergeWhereWithUserScope(baseArgs.where, userId);

    return this.delegate.findMany({
      ...baseArgs,
      where,
    } as unknown as MethodArgs<Delegate, 'findMany'>);
  }

  findUnique(
    args: MethodArgs<Delegate, 'findUnique'>,
    userId?: string
  ): Promise<MethodResult<Delegate, 'findUnique'>> {
    if (!userId || this.readScope === 'none') {
      return this.delegate.findUnique(args);
    }

    // For unique reads, we fetch first then apply ownership/global visibility checks.
    return this.delegate.findUnique(args).then((record: unknown) => {
      if (!record) {
        return record;
      }

      const ownerId = (record as Record<string, unknown>)[this.userField];
      if (this.readScope === 'global-and-user') {
        return ownerId === null || ownerId === userId ? record : null;
      }

      return ownerId === userId ? record : null;
    }) as Promise<MethodResult<Delegate, 'findUnique'>>;
  }

  create(args: MethodArgs<Delegate, 'create'>): Promise<MethodResult<Delegate, 'create'>> {
    return this.delegate.create(args);
  }

  async update(
    args: MethodArgs<Delegate, 'update'>,
    userId?: string
  ): Promise<MethodResult<Delegate, 'update'>> {
    if (userId && this.readScope !== 'none') {
      const baseArgs = args as Record<string, unknown>;
      const allowed = await this.canMutateForUser(baseArgs.where, userId);
      if (!allowed) {
        // Hide row existence details; caller gets a generic forbidden mutation error.
        throw new Error('Forbidden mutation: only the owner can update this row');
      }
    }

    return (await this.delegate.update(args)) as MethodResult<Delegate, 'update'>;
  }

  async delete(
    args: MethodArgs<Delegate, 'delete'>,
    userId?: string
  ): Promise<MethodResult<Delegate, 'delete'>> {
    if (userId && this.readScope !== 'none') {
      const baseArgs = args as Record<string, unknown>;
      const allowed = await this.canMutateForUser(baseArgs.where, userId);
      if (!allowed) {
        // Same policy as update: owner-only, global rows cannot be deleted.
        throw new Error('Forbidden mutation: only the owner can delete this row');
      }
    }

    return (await this.delegate.delete(args)) as MethodResult<Delegate, 'delete'>;
  }
}
