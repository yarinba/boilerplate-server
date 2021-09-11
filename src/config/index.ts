
import devConfig from './development.json';
import prodConfig from './production.json';
import dotenv from 'dotenv';

import {IConfig} from '../types/interfaces/config.interface';

dotenv.config();

export class Config {
    private environment: string = process.env.NODE_ENV || 'development';
    private config: IConfig;

    constructor() {
        this.config = this.environment === 'development' ? devConfig : prodConfig;
    }

    getConfig() {
        return this.config;
    }
}