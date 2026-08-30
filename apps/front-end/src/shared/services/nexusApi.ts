import { ApiService } from "@/shared/services/apiCrudService";
import type { NexusUpdateDto } from "@eu/types";

export default class NexusApi extends ApiService<never, NexusUpdateDto[], never> {
  protected route = "/nexus-tools";
}
