import { join } from 'path';

export const DB_PATH = join(process.cwd(), 'database.sqlite');
export const DB_SCHEMA_VERSION = '1';