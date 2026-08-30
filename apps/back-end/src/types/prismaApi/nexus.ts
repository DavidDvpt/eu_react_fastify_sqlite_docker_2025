import type { NexusUpdate } from '#prisma/generated/client.js';

export type NexusUpdateWithTypeName = NexusUpdate & {
  type: {
    name: string;
  };
};
