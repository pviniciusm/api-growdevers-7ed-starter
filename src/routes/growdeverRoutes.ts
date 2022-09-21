import { Router } from "express";
import { growdeversList } from "../data/growdeversList";
import { Growdever } from "../models/growdever";

const growdeverRoutes = Router();

// GET http://localhost:3000/growdever
// Listar todos os growdevers
growdeverRoutes.get("/all", (req, res) => {
    return res.send({
        ok: true,
        message: "Growdevers successfully listed",
        data: growdeversList,
    });
});

// GET http://localhost:3000/growdever (com query nome e idade)
// Listar todos os growdevers filtrando por nome e idade
growdeverRoutes.get("/", (req, res) => {
    try {
        const { nome, idade } = req.query;

        let lista = growdeversList;

        if (nome) {
            lista = growdeversList.filter((item) => {
                return item._nome === nome;
            });
        }

        if (idade) {
            lista = lista.filter((item) => item._idade == Number(idade));
        }

        return res.send({
            ok: true,
            message: "Growdevers successfully listed",
            data: lista,
        });
    } catch (error: any) {
        return res.status(500).send({
            ok: false,
            message: "Instabilidade no servidor",
            error: error.toString(),
        });
    }
});

// GET http://localhost:3000/growdever/abc-12
// Route param
growdeverRoutes.get("/:id", (req, res) => {
    const { id } = req.params;

    let growdever = growdeversList.find((item) => item._id === id);

    if (!growdever) {
        return res.status(404).send({
            ok: false,
            message: "Growdever not found",
        });
    }

    return res.status(200).send({
        ok: true,
        message: "Growdever successfully obtained",
        data: growdever,
    });
});

// POST http://localhost:3000/growdever
// Parâmetros => body
growdeverRoutes.post("/", (req, res) => {
    const { nome, idade, skills } = req.body;

    if (!nome) {
        return res.status(400).send({
            ok: false,
            message: "Nome not provided",
        });
    }

    if (!idade) {
        return res.status(400).send({
            ok: false,
            message: "Idade not provided",
        });
    }

    // if(!nome || !idade) {
    //     return res.status(400).send({
    //         ok: false,
    //         message: `Nome/idade not provided`,
    //     });
    // }

    const growdever = new Growdever(nome, idade, skills);
    growdeversList.push(growdever);

    return res.status(201).send({
        ok: true,
        message: "Growdever successfully created",
        data: growdeversList,
    });
});

// DELETE http://localhost:3000/growdever/id-123
// Route param
growdeverRoutes.delete("/:id", (req, res) => {
    const { id } = req.params;

    let growdeverIndex = growdeversList.findIndex((item) => item._id === id);

    if (growdeverIndex < 0) {
        return res.status(404).send({
            ok: false,
            message: "Growdever not found",
        });
    }

    growdeversList.splice(growdeverIndex, 1);

    return res.status(200).send({
        ok: true,
        message: "Growdever successfully deleted",
        data: growdeversList,
    });
});

export { growdeverRoutes };
