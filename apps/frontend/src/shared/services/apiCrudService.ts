import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import type { ZodType } from "zod";

export abstract class ApiService<
  TQuery,
  TGetResponse,
  TCreateInput,
  TCreateResponse = void,
  TPatchInput = Partial<TCreateInput>,
  TPatchResponse = void,
> {
  protected abstract route: string;
  protected querySchema: ZodType<TQuery> | null = null;

  protected axios = axiosCrud(axiosInstance());

  async get(props: Partial<TQuery> = {}) {
    const params = this.querySchema ? this.querySchema.parse(props) : props;

    return this.axios.get<TGetResponse>(this.route, params ? { params } : {});
  }

  async create(body: TCreateInput) {
    return this.axios.post<TCreateResponse, TCreateInput>(this.route, body);
  }

  async patch({ id, body }: { id: string; body: TPatchInput }) {
    return this.axios.patch<TPatchResponse, TPatchInput>(
      `${this.route}/${id}`,
      body,
    );
  }
}
