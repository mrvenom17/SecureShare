import { Request, Response } from 'express';
import { fileModel } from '../models/file';
import { auditModel } from '../models/audit';

export const fileController = {
  upload: async (req: Request, res: Response) => {
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
  },

  getFile: async (req: Request, res: Response) => {
    const file = fileModel.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.json(file);
  },

  grantAccess: async (req: Request, res: Response) => {
    const { userId } = req.body;
    fileModel.grantAccess(req.params.id, userId);
    res.status(204).send();
  },

  revokeAccess: async (req: Request, res: Response) => {
    const { userId } = req.body;
    fileModel.revokeAccess(req.params.id, userId);
    res.status(204).send();
  }
};