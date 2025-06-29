import Database from 'better-sqlite3';
import { DB_PATH } from '../config/database';
import { SCHEMA } from './schema';

const db = new Database(DB_PATH);
db.exec(SCHEMA);

export default db;