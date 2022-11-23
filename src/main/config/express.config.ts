import express from "express";
import cors from "cors";
import { growdeverRoutes } from "../../app/features/growdever/routes/growdever.routes";
import { avaliacaoRoutes } from "../../app/features/avaliacao/routes/avaliacao.routes";

export const createServer = () => {
    const app = express();
    app.use(express.json());
    app.use(cors());

    app.use("/growdever", growdeverRoutes);
    app.use("/avaliacao", avaliacaoRoutes);

    return app;
};
