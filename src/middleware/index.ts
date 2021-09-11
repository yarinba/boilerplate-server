import jwt from 'jsonwebtoken';

import logger from '../utils/logger';
import { Config } from '../config';
import { UserService } from '../services/users-service';

import { IRequest, IResponse, INext } from '../types/interfaces/express.interface';
import { HTTP_CODES } from '../types/enums/http.enum';

const { USER_SECRET_TOKEN } = new Config().getConfig().jwtConfig;

export default async (req: IRequest, res: IResponse, next: INext): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;
		const token = (authHeader && authHeader.split(' ')[1]) as string;
		jwt.verify(token, USER_SECRET_TOKEN, async (err, payload: any) => {
			if (err) {
				logger.error(`middleware error! ${err.message}`);
				return res.status(HTTP_CODES.UNAUTHORIZED).json({ message: err.message });
			}
			const { id } = payload.user;
			const user = await new UserService().GetUser(id);
			if (!user) {
				throw new Error('No user was found in middleware');
			}
			req.user = user;
			next();
		});
	} catch (err) {
		res.status(HTTP_CODES.UNAUTHORIZED).json({ message: err.message });
	}
};
