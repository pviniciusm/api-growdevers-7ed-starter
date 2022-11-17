import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { growdeverRoutes } from "./routes/growdever.routes";
import "reflect-metadata";
import { DatabaseConnection } from "./database/config/connection";
import { avaliacaoRoutes } from "./routes/avaliacao.routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/growdever", growdeverRoutes);
app.use("/avaliacao", avaliacaoRoutes);

DatabaseConnection.connect().then(() => {
    console.log("Database foi inicializada.");

    app.listen(process.env.PORT, () => {
        console.log("API rodando na porta " + process.env.PORT);
    });
});
