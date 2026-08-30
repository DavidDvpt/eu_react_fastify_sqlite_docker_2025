import { ApiService } from "@/shared/services/apiCrudService";
import type { NexusUpdateDto } from "@eu/types";

export default class NexusApi extends ApiService<never, NexusUpdateDto[], never> {
  protected route = "/nexus-tools";

  async init() {
    return this.axios.post<number, undefined>(`${this.route}/init`, undefined);
  }
}
