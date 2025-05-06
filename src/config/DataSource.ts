import 'dotenv/config';
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import 'reflect-metadata';


export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [`${__dirname}/../entities/*{.js,.ts}`],
    migrations: [`${__dirname}/../migrations/*{.js,.ts}`],
});


export const getDataSource = (): DataSource => AppDataSource;

export const getTypeORMRepository = <T extends ObjectLiteral>(
    model: EntityTarget<T>,
): Repository<T> => getDataSource().getRepository(model);