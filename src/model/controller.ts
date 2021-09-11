import express from 'express';

import { IRouter } from '../types/interfaces/express.interface';
import { IController } from '../types/interfaces/controller.interface';

export class Controller implements IController {
	private router: IRouter;

	constructor() {
		this.router = express.Router();
	}

	getRouter(): IRouter {
		return this.router;
	}
}