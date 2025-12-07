import {
  PrismaCrudRepository,
  PrismaModelClient,
} from "./prismaCrudRepository.js";

type UserClient = PrismaModelClient<"User">;

export class UserRepository extends PrismaCrudRepository<UserClient["user"]> {
  constructor(client: UserClient) {
    super(client.user);
  }
}
