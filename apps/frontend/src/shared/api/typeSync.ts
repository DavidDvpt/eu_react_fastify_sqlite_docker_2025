import type {
  CategoryResponse,
  ItemResponse,
  LotResponse,
  SignUpBody,
  TransactionStatusPatchStatus,
  TypeResponse,
} from "@/api/generated/model";
import type {
  CategoryViewModel,
  ItemViewModel,
  LotViewModel,
  TransactionStatusPatchDto,
  TypeViewModel,
  UserSignupFormBody,
} from "@zod-schemas";

type SyncCheck<TSource, TTarget> = [TSource] extends [TTarget] ? true : false;
type EnumSync<TZod, TGenerated> = SyncCheck<TZod, TGenerated> & SyncCheck<TGenerated, TZod>;
type Expect<T extends true> = T;

type RequestBodies = Expect<SyncCheck<UserSignupFormBody, SignUpBody>>;

type PatchBodies = Expect<EnumSync<TransactionStatusPatchDto, TransactionStatusPatchStatus>>;

type ResponseDtos =
  | Expect<SyncCheck<CategoryViewModel, CategoryResponse>>
  | Expect<SyncCheck<TypeViewModel, TypeResponse>>
  | Expect<SyncCheck<ItemViewModel, ItemResponse>>
  | Expect<SyncCheck<LotViewModel, LotResponse>>;

export type ApiTypeSync = {
  requestBodies: RequestBodies;
  patchBodies: PatchBodies;
  responseDtos: ResponseDtos;
};
