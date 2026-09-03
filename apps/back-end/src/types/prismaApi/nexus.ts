import type { NexusUpdate } from '#prisma/generated/client.js';

export type NexusUpdateWithAppType = NexusUpdate & {
  type: {
    name: string;
    id: string;
  };
};
