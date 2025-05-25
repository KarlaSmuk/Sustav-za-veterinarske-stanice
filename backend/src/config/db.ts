import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: false,
    migrationsRun: true,
    entities: ["src/**/*.entity{.ts,.js}"]
});
