import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import logger from './utils/logger';
import { Database } from './db';
import { Router } from './routes';

dotenv.config();

const PORT = process.env.PORT || 3120;

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
	app.use(cors());
}

app.get('/', (req, res) => {
	res.send('OK');
});

const appRouter = new Router().getRoutes();
app.use('/api', appRouter);

const initDB = async () => {
	try {
		new Database();
	} catch (err) {
		logger.error(`src/index.ts, initDB Error: ${err.message}`);
	}
};

initDB();

app.listen(PORT, () => {
	logger.info(`Boilerplate Server is listening on port ${PORT}`);
});
