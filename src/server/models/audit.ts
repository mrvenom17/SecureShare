import { randomUUID } from 'crypto';
import db from '../db';

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  fileId?: string;
  details: string;
  timestamp: Date;
}

export const auditModel = {
  create: (log: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog => {
    const stmt = db.prepare(`
      INSERT INTO audit_logs (id, action, user_id, file_id, details)
      VALUES (?, ?, ?, ?, ?)
      RETURNING *
    `);
    return stmt.get(
      randomUUID(),
      log.action,
      log.userId,
      log.fileId,
      log.details
    ) as AuditLog;
  },

  getByUser: (userId: string): AuditLog[] => {
    const stmt = db.prepare('SELECT * FROM audit_logs WHERE user_id = ? ORDER BY timestamp DESC');
    return stmt.all(userId) as AuditLog[];
  }
};