import type {
  CrudDelegate,
  CrudRepositoryOptions,
  MethodArgs,
  MethodResult,
  ReadScope,
} from '../../types/index.js';

const SYSTEM_USER_ID = process.env.SYSTEM_USER_ID;

// Thin wrapper that forwards Prisma delegate calls while preserving types.
class PrismaCrudRepository<Delegate extends CrudDelegate> {
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
      const globalScopes: Record<string, unknown>[] = [];
      if (SYSTEM_USER_ID) {
        globalScopes.push({ [this.userField]: SYSTEM_USER_ID });
      }
      globalScopes.push({ [this.userField]: userId });

      return {
        AND: [
          (where as Record<string, unknown>) ?? {},
          {
            OR: globalScopes,
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
        return ownerId === SYSTEM_USER_ID || ownerId === userId ? record : null;
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

export default PrismaCrudRepository;
