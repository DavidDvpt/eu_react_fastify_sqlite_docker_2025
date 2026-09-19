import type {
  CategoryResponse,
  GetItemStockApiV2ItemsIdStockGet200,
  IdResponse,
  ItemResponse,
  LotResponse,
  PedcardType,
  SignUpBody,
  TransactionStatus,
  TransactionStatusPatchStatus,
  TransactionType,
  TypeResponse,
} from "@/api/generated/model";
import type {
  CategoryDto,
  ItemDto,
  LotDto,
  PedcardTypeDto,
  PrismaMutationResponse,
  Stock,
  TransactionStatusDto,
  TransactionStatusPatchDto,
  TransactionTypeDto,
  TypeDto,
  UserSignupFormBody,
} from "@zod-schemas";

type SyncCheck<TSource, TTarget> = [TSource] extends [TTarget] ? true : false;
type EnumSync<TZod, TGenerated> = SyncCheck<TZod, TGenerated> & SyncCheck<TGenerated, TZod>;
type Expect<T extends true> = T;

type RequestBodies =
  | Expect<SyncCheck<UserSignupFormBody, SignUpBody>>
  ;

type PatchBodies =
  | Expect<EnumSync<TransactionStatusPatchDto, TransactionStatusPatchStatus>>;

type Enums =
  | Expect<EnumSync<TransactionStatusDto, TransactionStatus>>
  | Expect<EnumSync<TransactionTypeDto, TransactionType>>
  | Expect<EnumSync<PedcardTypeDto, PedcardType>>;

type Mutations = Expect<SyncCheck<PrismaMutationResponse, IdResponse>>;

type ResponseDtos =
  | Expect<SyncCheck<CategoryDto, CategoryResponse>>
  | Expect<SyncCheck<TypeDto, TypeResponse>>
  | Expect<SyncCheck<ItemDto, ItemResponse>>
  | Expect<SyncCheck<LotDto, LotResponse>>
  | Expect<SyncCheck<Stock, GetItemStockApiV2ItemsIdStockGet200>>;

export type ApiTypeSync = {
  requestBodies: RequestBodies;
  patchBodies: PatchBodies;
  enums: Enums;
  mutations: Mutations;
  responseDtos: ResponseDtos;
};
