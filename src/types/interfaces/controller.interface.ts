import { IRouter } from './express.interface';

export interface IController {
	getRouter(): IRouter;
}