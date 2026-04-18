import PrismaCrudRepository from './prismaCrudRepository.js';

import type { UserClient } from '../../types/index.js';

export class UserRepository extends PrismaCrudRepository<UserClient['user']> {
  constructor(client: UserClient) {
    super(client.user);
  }
}
