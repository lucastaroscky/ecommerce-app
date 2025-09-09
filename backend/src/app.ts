import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './modules/auth/auth.router';
import productRouter from './modules/products/product.router';
import orderRouter from './modules/orders/order.router';

const routes = [
    authRouter,
    productRouter,
    orderRouter,
]

const app = express();

app.use(express.json());

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}))

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(morgan('dev'));

app.use(routes);

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        pid: process.pid,
        platform: process.platform,
        nodeVersion: process.version,
        cpuUsage: process.cpuUsage(),
        env: process.env.NODE_ENV || 'development'
    });
});

export default app;