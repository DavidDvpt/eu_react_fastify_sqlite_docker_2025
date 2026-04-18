/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Prisma, PrismaClient, TransactionStatus } from '../../prisma/generated/client.js';

// Keep compatibility between the root Prisma client and transaction-scoped clients.
type PrismaModelClient<DelegateKey extends Prisma.ModelName> =
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

type RepositoryClient = PrismaModelClient<'User'> &
  PrismaModelClient<'Category'> &
  PrismaModelClient<'Type'> &
  PrismaModelClient<'Item'> &
  PrismaModelClient<'Lot'> &
  PrismaModelClient<'SeedPatch'>;

export type StockByItemRow = {
  itemId: string;
  imageUrlId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

type StockLotInRow = {
  id: string;
  lotType: string;
  quantityRemaining: number;
  quantityInitial: number;
  quantityExported: number;
  priceRemaining: number;
  dateCreated: string;
};

type StockLotOutRow = {
  id: string;
  dateCreated: string;
  quantity: number;
  tt: number;
  ttc: number;
  saleStatus: string | null;
};

type StockItemDetails = {
  itemId: string;
  imageUrlId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  lotsIn: StockLotInRow[];
  lotsOut: StockLotOutRow[];
};

type SellSessionRow = {
  sessionId: string;
  name: string;
  quantity: number;
  totalPrice: number;
  linesTotal: number;
  saleStatus: TransactionStatus | null;
};

type LotClient = PrismaModelClient<'Lot'>;
type SeedPatchClient = PrismaModelClient<'SeedPatch'>;
type PrismaLikeClient = PrismaClient | Prisma.TransactionClient;
type TypeClient = PrismaModelClient<'Type'>;
type UserClient = PrismaModelClient<'User'>;
type ItemClient = PrismaModelClient<'Item'>;
type CategoryClient = PrismaModelClient<'Category'>;

export type {
  PrismaModelClient,
  CrudRepositoryOptions,
  ReadScope,
  CrudDelegate,
  MethodResult,
  MethodArgs,
  RepositoryClient,
  LotClient,
  PrismaLikeClient,
  StockLotInRow,
  StockLotOutRow,
  StockItemDetails,
  SeedPatchClient,
  SellSessionRow,
  TypeClient,
  UserClient,
  ItemClient,
  CategoryClient,
};
