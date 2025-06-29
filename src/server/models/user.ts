import { BaseModel } from './base';
import db from '../db/connection';
import { generateId } from '../utils/id';

export interface User extends BaseModel {
  walletAddress: string;
}

export const userModel = {
  create: (walletAddress: string): User => {
    const stmt = db.prepare(`
      INSERT INTO users (id, wallet_address)
      VALUES (?, ?)
      RETURNING *
    `);
    return stmt.get(generateId(), walletAddress) as User;
  },

  findByWallet: (walletAddress: string): User | undefined => {
    const stmt = db.prepare('SELECT * FROM users WHERE wallet_address = ?');
    return stmt.get(walletAddress) as User | undefined;
  }
};