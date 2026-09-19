import type {
  CategoryCreate,
  CategoryPatch,
  CategoryResponse,
  GetItemStockApiV2ItemsIdStockGet200,
  IdResponse,
  ItemCreate,
  ItemPatch,
  ItemResponse,
  LotResponse,
  NexusForm,
  PedcardForm,
  PedcardPatch,
  PedcardType,
  SignInBody,
  SignUpBody,
  TransactionBody,
  TransactionStatus,
  TransactionStatusPatchStatus,
  TransactionType,
  TypeCreate,
  TypePatch,
  TypeResponse,
} from "@/api/generated/model";
import type {
  CategoryDto,
  CategoryFormBody,
  ItemDto,
  ItemForm,
  LotDto,
  NexusFormBody,
  PedcardFormBody,
  PedcardTypeDto,
  PrismaMutationResponse,
  Stock,
  TransactionBodyDto,
  TransactionStatusDto,
  TransactionStatusPatchDto,
  TransactionTypeDto,
  TypeDto,
  TypeFormBody,
  UserSignInFormBody,
  UserSignupFormBody,
} from "@zod-schemas";

type SyncCheck<TSource, TTarget> = [TSource] extends [TTarget] ? true : false;
type EnumSync<TZod, TGenerated> = SyncCheck<TZod, TGenerated> & SyncCheck<TGenerated, TZod>;
type Expect<T extends true> = T;

type RequestBodies =
  | Expect<SyncCheck<CategoryFormBody, CategoryCreate>>
  | Expect<SyncCheck<TypeFormBody, TypeCreate>>
  | Expect<SyncCheck<ItemForm, ItemCreate>>
  | Expect<SyncCheck<UserSignInFormBody, SignInBody>>
  | Expect<SyncCheck<UserSignupFormBody, SignUpBody>>
  | Expect<SyncCheck<TransactionBodyDto, TransactionBody>>
  | Expect<SyncCheck<PedcardFormBody, PedcardForm>>
  | Expect<SyncCheck<NexusFormBody, NexusForm>>;

type PatchBodies =
  | Expect<SyncCheck<CategoryFormBody, CategoryPatch>>
  | Expect<SyncCheck<TypeFormBody, TypePatch>>
  | Expect<SyncCheck<ItemForm, ItemPatch>>
  | Expect<SyncCheck<PedcardFormBody, PedcardPatch>>
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