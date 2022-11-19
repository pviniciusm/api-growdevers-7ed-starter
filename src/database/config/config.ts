import { DataSource } from "typeorm";
import "dotenv/config";

export default new DataSource({
    type: "postgres",
    url: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    synchronize: false,
    entities: ["src/database/entities/**/*.ts"],
    migrations: ["src/database/migrations/**/*.ts"],
    schema: "aula",
});
