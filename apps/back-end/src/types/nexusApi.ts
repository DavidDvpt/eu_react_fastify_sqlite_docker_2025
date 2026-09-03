import { z } from 'zod';

import type { nexusApiItemSchema } from '#src/lib/zodSchemas/nexusApiSchemas.js';

export type NexusApiItem = z.infer<typeof nexusApiItemSchema>;
