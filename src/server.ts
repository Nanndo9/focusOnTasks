import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/DataSource';
import { userRoute } from './routes/UserRoute';
import { authRoute } from './routes/AuthRoute';
import { taskRoute } from './routes/TaskRoute';
import { errorHandler } from './middlewares/errorHandlerMiddleware';
dotenv.config();

AppDataSource.initialize()
    .then(() => {
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cors());


        app.use("/user", userRoute.getRoute())
        app.use("/", authRoute.getRoute())
        app.use("/task", taskRoute.getRoute())

        app.use(errorHandler)
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`✅ Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Error initializing database:', err);
    });