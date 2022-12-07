import "reflect-metadata";
import { CacheConnection } from "./main/database/cache.connection";
import { DatabaseConnection } from "./main/database/typeorm.connection";
import { runServer } from "./main/server/express.server";

Promise.all([DatabaseConnection.connect(), CacheConnection.connect()]).then(() => {
    runServer();
});
