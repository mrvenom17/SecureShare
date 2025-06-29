import db from '../db/connection';

export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createBaseQueries = (table: string) => ({
  findById: (id: string) => {
    const stmt = db.prepare(`SELECT * FROM ${table} WHERE id = ?`);
    return stmt.get(id);
  },
  
  findAll: () => {
    const stmt = db.prepare(`SELECT * FROM ${table}`);
    return stmt.all();
  }
});