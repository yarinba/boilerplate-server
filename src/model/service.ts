import { Database } from '../db';
import { Pool } from 'pg';

export class Service {
	protected pool: Pool;

	/**
	 * @description Service class represent a Service with pooling methods.
	 * @protected {Pool} Pool.
	 */
	constructor() {
		this.pool = Database.getPool();
	}
}
