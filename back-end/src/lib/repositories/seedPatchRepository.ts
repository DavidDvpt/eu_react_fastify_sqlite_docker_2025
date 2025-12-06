import { PrismaCrudRepository, PrismaModelClient } from "./prismaCrudRepository.js";

type SeedPatchClient = PrismaModelClient<"seed_patch">;

export class SeedPatchRepository extends PrismaCrudRepository<
  SeedPatchClient["seed_patch"]
> {
  constructor(client: SeedPatchClient) {
    super(client.seed_patch);
  }
}
