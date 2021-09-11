import { Pool } from 'pg';
import logger from '../../utils/logger';

export class DBTables {
	private pool: Pool;
	constructor(pool: Pool) {
		this.pool = pool;
	}

	public async createTables() {
		try {
			await this.lastUpdateFunc();
			await this.createUsersTable();
			logger.info('Tables created in DB!');
		} catch (err) {
			logger.error(`db/createTables/index.ts, createTables Error: ${err.message}`);
		}
	}

	/**
	 * @description trigger function to update "last_updated" column in any table
	 */
	private async lastUpdateFunc(): Promise<void> {
		try {
			await this.pool.query(`CREATE OR REPLACE FUNCTION update_last_updated_column() 
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.last_updated = now();
          RETURN NEW; 
      END;
      $$ language 'plpgsql';`);
		} catch (err) {
			logger.error(`db/createTables/index.ts, lastUpdateFunc Error: ${err.message}`);
		}
	}

	private async createUsersTable(): Promise<void> {
		try {
			await this.pool.query(
				`CREATE TABLE IF NOT EXISTS users(
					id SERIAL PRIMARY KEY,
					name TEXT NOT NULL,
					email TEXT NOT NULL UNIQUE,
					phone_number TEXT NOT NULL,
					created_at TIMESTAMP NOT NULL DEFAULT NOW()::TIMESTAMP,
					last_updated TIMESTAMP NOT NULL DEFAULT NOW()::TIMESTAMP)`
			);

			await this.pool.query(`DROP TRIGGER IF EXISTS update_users_modtime ON users;`);
			await this.pool.query(
				`CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE  update_last_updated_column();`
			);

			logger.info('Users Table Created');
		} catch (err) {
			logger.error(`db/createTables/index.ts, createUsersTable Error: ${err.message}`);
		}
	}
}
