import 'dotenv/config';
import "reflect-metadata";
import app from "./app";

import { AppDataSource } from "./config/database/data-source";
import redis from "./config/cache/redis";

async function startServer() {
    try {
        await AppDataSource.initialize();
        console.log("✅ Database connected");

        redis.on('connect', () => console.log('✅ Redis connected'));

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
    } catch (err) {
        console.error("❌ Failed to start server", err);
        process.exit(1);
    }
}

startServer();
