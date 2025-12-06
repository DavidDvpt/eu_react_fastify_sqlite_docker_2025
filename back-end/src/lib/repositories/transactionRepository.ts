import { PrismaCrudRepository, PrismaModelClient } from "./prismaCrudRepository.js";

type TransactionClient = PrismaModelClient<"transactions">;

export class TransactionRepository extends PrismaCrudRepository<
  TransactionClient["transactions"]
> {
  constructor(client: TransactionClient) {
    super(client.transactions);
  }
}
