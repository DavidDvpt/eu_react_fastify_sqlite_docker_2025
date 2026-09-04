import { ApiService } from "@/shared/services/apiCrudService";
import type {
  NexusFormBody,
  NexusImportResult,
  NexusRequestTypeEnum,
  NexusUpdateDto,
} from "@eu/types";

export default class NexusApi extends ApiService<
  never,
  NexusUpdateDto[],
  never,
  void,
  NexusFormBody,
  NexusUpdateDto
> {
  protected route = "/nexus-tools";

  async init() {
    return this.axios.post<number, undefined>(`${this.route}/init`, undefined);
  }

  async importBase(type: NexusRequestTypeEnum) {
    return this.axios.post<
      { count: NexusImportResult },
      { type: NexusRequestTypeEnum }
    >(`${this.route}/update-base`, { type });
  }
}
