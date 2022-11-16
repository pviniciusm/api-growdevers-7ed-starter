import { DataSource } from "typeorm";
import "dotenv/config";

const config = new DataSource({
    type: "postgres",
    url: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

export class DatabaseConnection {
    private static _connection: DataSource;

    public static async connect() {
        console.log(process.env.DB_URL);

        if (!this._connection) {
            this._connection = await config.initialize();
        }
    }

    public static get connection() {
        if (!this._connection) {
            throw new Error("A database não tá inicializada, aruá");
        }

        return this._connection;
    }
}
