import logger from '../utils/logger';
import { Service } from '../model/service';
import { convertObj } from '../utils';

import { IUser } from '../types/interfaces/user.interface';

export class UserService extends Service {
	constructor() {
		super();
	}

	public async CreateUser(userToCreate: IUser): Promise<IUser | void> {
		try {
			const { name, email, phoneNumber } = userToCreate;
			let newUser: IUser;
			const res = await this.pool.query(
				`INSERT INTO users (name, email, phone_number) VALUES($1, $2, $3) RETURNING *`,
				[name, email, phoneNumber]
			);
			if (res.rows && res.rows.length) {
				newUser = convertObj(res.rows[0]) as IUser;
				logger.info(`services/user-service.ts/CreateUser, user ${newUser.id} successfully created`);
				return newUser;
			}
		} catch (err) {
			logger.error(`services/user-service.ts CreateUser failed: ${err.message}`);
		}
	}

	public async GetUser(id: number): Promise<IUser | void> {
		try {
			let user: IUser;
			const res = await this.pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
			if (res.rows && res.rows.length) {
				user = convertObj(res.rows[0]) as IUser;
				logger.info(`services/user-service.ts GetUser success with id ${id}`);
				return user;
			}
		} catch (err) {
			logger.error(`services/user-service.ts GetUser failed: ${err.message}`);
		}
	}

	public async UpdateUser(query: string, values: any[]): Promise<IUser | void> {
		try {
			let user: IUser;
			const res = await this.pool.query(query, values);
			if (res.rows && res.rows.length) {
				user = convertObj(res.rows[0]) as IUser;
				logger.info(`services/user-service.ts UpdateUser, user ${user.id} successfully updated`);
				return user;
			}
		} catch (err) {
			logger.error(`services/user-service.ts UpdateUser failed: ${err.message}`);
		}
	}

	public async DeleteUser(userId: number): Promise<boolean> {
		try {
			const res = await this.pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [userId]);
			if (!(res.rows && res.rows.length)) {
				throw new Error('user not found');
			}
			logger.info(`services/user-service.ts DeleteUser, user ${userId} successfully deleted`);
			return true;
		} catch (err) {
			logger.error(`services/user-service.ts DeleteUser failed: ${err.message}`);
			return false;
		}
	}
}
