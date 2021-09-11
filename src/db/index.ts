import { Pool } from 'pg';

import { Config } from '../config';
import { DBTables } from './createTables';
import logger from '../utils/logger';

const { DB_USER, DB_HOST, DB_PORT, DB_PASSWORD, DB_DATABASE } = new Config().getConfig().dbConfig;

export class Database {
	private static pool: Pool;
	private dbTables: DBTables;

	constructor() {
		this.dbTables = new DBTables(Database.getPool());
		this.initDB();
	}

	private async initDB() {
		await this.dbTables.createTables();
	}

	public static getPool = (): Pool => {
		if (Database.pool) {
			return Database.pool;
		} else {
			logger.info('Initializing DB');
			return (Database.pool = new Pool({
				user: DB_USER,
				host: DB_HOST,
				database: DB_DATABASE,
				password: DB_PASSWORD,
				port: DB_PORT,
			}));
		}
	};
}
