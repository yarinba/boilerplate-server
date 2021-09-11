import express from 'express';

import { userRoutes } from './api/users';
import { IRouter } from '../types/interfaces/express.interface';

class Router {
	constructor() {}

	getRoutes() {
		const router: IRouter = express.Router();
		router.use('/users', userRoutes);
		return router;
	}
}

export { Router };
