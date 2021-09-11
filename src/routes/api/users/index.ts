import jwt from 'jsonwebtoken';

import logger from '../../../utils/logger';
import middleware from '../../../middleware';
import { Config } from '../../../config';
import { Controller } from '../../../model/controller';
import { UserService } from '../../../services/users-service';
import { convertToUnderscore, createUpdateQuery } from '../../../utils/index';

import { IRouter, IRequest, IResponse } from '../../../types/interfaces/express.interface';
import { IUser } from '../../../types/interfaces/user.interface';
import { HTTP_CODES } from '../../../types/enums/http.enum';

const { USER_SECRET_TOKEN } = new Config().getConfig().jwtConfig;

class UserController extends Controller {
	private userRouter: IRouter;
	private userService: UserService;

	constructor() {
		super();
		this.userRouter = this.getRouter();
		this.setRoutes();
		this.userService = new UserService();
	}

	private createUser = async (req: IRequest, res: IResponse) => {
		try {
			const { name, email, phoneNumber } = req.body;
			const userToCreate: IUser = {
				name,
				email,
				phoneNumber,
			};
			const userCreated = await this.userService.CreateUser(userToCreate);
			if (!userCreated) {
				res.status(HTTP_CODES.BAD_REQUEST).send({ message: `User with ${email} already exists.` });
			} else {
				const payload = { user: userCreated };
				const token = jwt.sign(payload, USER_SECRET_TOKEN, {
					expiresIn: 360000,
				});
				userCreated.token = token;
				res.status(HTTP_CODES.OK).send(userCreated);
			}
		} catch (err) {
			logger.error(`routes/api/user/index.ts createUser failed: ${err.message}`);
			res.status(HTTP_CODES.BAD_REQUEST).json({ code: err.code, message: err.message });
		}
	};

	private getUser = async (req: IRequest, res: IResponse) => {
		try {
			const id = req.user.id;
			const user = (await this.userService.GetUser(id)) as IUser;
			if (!user) {
				logger.error(`routes/api/user/index.ts getUser, user with id ${id} not found`);
				res.status(HTTP_CODES.NOT_FOUND).send({ message: `User with id ${id} not found` });
			} else {
				res.status(HTTP_CODES.OK).send(user);
			}
		} catch (err) {
			logger.error(`routes/api/user/index.ts getUser failed: ${err.message}`);
			res.status(HTTP_CODES.BAD_REQUEST).send({ code: err.code, message: err.message });
		}
	};

	private updateUser = async (req: IRequest, res: IResponse) => {
		try {
			const updatesObj = convertToUnderscore(req.body);
			const cols = Object.keys(updatesObj);
			const values = Object.values(updatesObj);
			const query = createUpdateQuery('users', cols, req.body.id, 'id');
			const user = (await this.userService.UpdateUser(query, values)) as IUser;
			if (!user) {
				logger.error(`routes/api/user/index.ts updateUser user with id ${req.body.id} is not exist`);
				res.status(HTTP_CODES.NOT_FOUND).send({ message: `User not found` });
			} else {
				logger.info(`routes/api/user/index.ts updateUser user with id ${user.id} successfully updated`);
				res.status(HTTP_CODES.OK).send(user);
			}
		} catch (err) {
			logger.error(`routes/api/user/index.ts updateUser failed: ${err.message}`);
			res.status(HTTP_CODES.BAD_REQUEST).send({ code: err.code, message: err.message });
		}
	};

	private deleteUser = async (req: IRequest, res: IResponse) => {
		try {
			const id = req.user.id;
			const isDeleted = await this.userService.DeleteUser(id);
			if (!isDeleted) {
				logger.error(`routes/api/user/index.ts getUserById, user ${id} not found`);
				res.status(HTTP_CODES.NOT_FOUND).send({ message: `User ${id} not found` });
			} else {
				res.status(HTTP_CODES.OK).send({ message: `User ${id} successfully deleted` });
			}
		} catch (err) {
			logger.error(`routes/api/user/index.ts deleteUser failed: ${err.message}`);
			res.status(HTTP_CODES.BAD_REQUEST).send({ code: err.code, message: err.message });
		}
	};

	private setRoutes = () => {
		this.userRouter.post('/create', this.createUser);
		this.userRouter.get('/get', middleware, this.getUser);
		this.userRouter.patch('/update', middleware, this.updateUser);
		this.userRouter.delete('/delete', middleware, this.deleteUser);
	};

	getRouterInstance(): IRouter {
		return this.userRouter;
	}
}

const user = new UserController();
const userRoutes = user.getRouterInstance();

export { userRoutes };
