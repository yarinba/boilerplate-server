export interface IConfig {
	dbConfig: IDbConfig;
	jwtConfig: IJwtConfig;
}

interface IDbConfig {
	DB_USER: string;
	DB_HOST: string;
	DB_DATABASE: string;
	DB_PASSWORD: string;
	DB_PORT: number;
}

interface IJwtConfig {
	USER_SECRET_TOKEN: string;
}
