import 'reflect-metadata';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import express, { Express } from 'express';
import bodyParser from 'body-parser';
import ownerRoute from './routes/owner.router';
import { AppDataSource } from './config/db';
import userRoute from './routes/user.router';
import petRoute from './routes/pet.router';

const app: Express = express();

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/owner', ownerRoute)
app.use('/api/user', userRoute)
app.use('/api/pet', petRoute)

AppDataSource.initialize()
    .then(() => {
        console.log("✔ Connected to Supabase");

        const port = Number(process.env.PORT) || 3000;
        app.listen(port, () => {
            console.log(`🚀 Server listening on http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error("❌ DataSource initialization failed:", err);
    });
