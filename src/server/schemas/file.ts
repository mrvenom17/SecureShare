import { z } from 'zod';

export const uploadSchema = z.object({
  name: z.string(),
  encryptedData: z.string(),
  mimeType: z.string(),
  size: z.number(),
  hash: z.string()
});