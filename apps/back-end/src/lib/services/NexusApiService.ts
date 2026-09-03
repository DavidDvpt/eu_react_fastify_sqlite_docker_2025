import axios from 'axios';

import type { NexusApiItem } from '#src/types/nexusApi.js';
import type { NexusRequestTypeEnum } from '@eu/types';

import { env } from '#src/config/env.js';
import { nexusApiItemSchema } from '#src/lib/zodSchemas/nexusApiSchemas.js';

export class NexusApiService {
  constructor() {}

  async getItems({ requestType }: { requestType: NexusRequestTypeEnum }): Promise<NexusApiItem[]> {
    const apiValues = await axios.get<NexusApiItem[]>(`${env.NEXUS_API_URL}/${requestType}`);

    const parsedValues = apiValues.data.map((m) => nexusApiItemSchema.parse(m));

    return parsedValues;
  }
}
