import express from "express";
import { growdeverRoutes } from "./routes/growdeverRoutes";

const app = express();
app.use(express.json());

// GET http://localhost:3000/teste
app.get("/teste", (req, res) => {
    // req => dados da requisição
    // res => controle da resposta
    console.log("Entrou na rota /teste");

    res.send({
        ok: true,
        message: "teste ok",
    });
});

app.use("/growdever", growdeverRoutes);

app.listen(3000, () => {
    console.log("API rodando...");
});
