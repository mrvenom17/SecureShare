import { randomUUID } from 'crypto';
import db from '../db';

export interface File {
  id: string;
  name: string;
  hash: string;
  encryptedData: string;
  mimeType: string;
  size: number;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const fileModel = {
  create: (file: Omit<File, 'id' | 'createdAt' | 'updatedAt'>): File => {
    const stmt = db.prepare(`
      INSERT INTO files (id, name, hash, encrypted_data, mime_type, size, owner_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `);
    return stmt.get(
      randomUUID(),
      file.name,
      file.hash,
      file.encryptedData,
      file.mimeType,
      file.size,
      file.ownerId
    ) as File;
  },

  findById: (id: string): File | undefined => {
    const stmt = db.prepare('SELECT * FROM files WHERE id = ?');
    return stmt.get(id) as File | undefined;
  },

  grantAccess: (fileId: string, userId: string): void => {
    const stmt = db.prepare(`
      INSERT INTO file_access (file_id, user_id)
      VALUES (?, ?)
    `);
    stmt.run(fileId, userId);
  },

  revokeAccess: (fileId: string, userId: string): void => {
    const stmt = db.prepare(`
      DELETE FROM file_access
      WHERE file_id = ? AND user_id = ?
    `);
    stmt.run(fileId, userId);
  }
};