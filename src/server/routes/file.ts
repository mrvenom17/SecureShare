import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validateRequest';
import { fileModel } from '../models/file';
import { auditModel } from '../models/audit';

const router = Router();

const uploadSchema = z.object({
  name: z.string(),
  encryptedData: z.string(),
  mimeType: z.string(),
  size: z.number(),
  hash: z.string()
});

router.post('/upload', validateRequest(uploadSchema), async (req, res) => {
  const { name, encryptedData, mimeType, size, hash } = req.body;
  const userId = req.user.id;

  const file = fileModel.create({
    name,
    encryptedData,
    mimeType,
    size,
    hash,
    ownerId: userId
  });

  auditModel.create({
    action: 'UPLOAD',
    userId,
    fileId: file.id,
    details: `File ${name} uploaded`
  });

  res.json(file);
});

export { router as fileRouter };