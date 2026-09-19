import type {
  CategoryResponse,
  ItemResponse,
  LotResponse,
  SignUpBody,
  TransactionStatusPatchStatus,
  TypeResponse,
} from "@/api/generated/model";
import type {
  CategoryDto,
  ItemDto,
  LotDto,
  TransactionStatusPatchDto,
  TypeDto,
  UserSignupFormBody,
} from "@zod-schemas";

type SyncCheck<TSource, TTarget> = [TSource] extends [TTarget] ? true : false;
type EnumSync<TZod, TGenerated> = SyncCheck<TZod, TGenerated> & SyncCheck<TGenerated, TZod>;
type Expect<T extends true> = T;

type RequestBodies = Expect<SyncCheck<UserSignupFormBody, SignUpBody>>;

type PatchBodies = Expect<EnumSync<TransactionStatusPatchDto, TransactionStatusPatchStatus>>;

type ResponseDtos =
  | Expect<SyncCheck<CategoryDto, CategoryResponse>>
  | Expect<SyncCheck<TypeDto, TypeResponse>>
  | Expect<SyncCheck<ItemDto, ItemResponse>>
  | Expect<SyncCheck<LotDto, LotResponse>>;

export type ApiTypeSync = {
  requestBodies: RequestBodies;
  patchBodies: PatchBodies;
  responseDtos: ResponseDtos;
};
