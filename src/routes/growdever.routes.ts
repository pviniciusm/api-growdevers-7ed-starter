import { Request, Response, Router } from "express";

import { GrowdeverController } from "../controllers/growdever.controller";
import { growdeversList } from "../data/growdeversList";
import { cpfExistsMiddleware } from "../middlewares/cpf-exists.middleware";
import { cpfValidatorMiddleware } from "../middlewares/cpf-validator.middleware";
import { logGetMiddleware } from "../middlewares/log-get.middleware";
import { logMiddleware } from "../middlewares/log.middleware";

const growdeverRoutes = Router();

growdeverRoutes.use(logMiddleware);

// GET http://localhost:3000/growdever/ (com query nome e idade)
// Listar todos os growdevers filtrando por nome e idade
growdeverRoutes.get("/", [logGetMiddleware], (req: Request, res: Response) => {
    try {
        const { nome, idade } = req.query;

        const controller = new GrowdeverController();

        const result = controller.list(
            nome as string,
            idade ? Number(idade) : undefined
        );

        return res.status(200).send({
            ok: true,
            message: "Growdevers successfully listed",
            data: result,
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

    let growdever = growdeversList.find((item) => item.id === id);

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
growdeverRoutes.post(
    "/",
    [cpfValidatorMiddleware, cpfExistsMiddleware],
    (req: Request, res: Response) => {
        const { nome, cpf, idade, skills } = req.body;

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

        if (!cpf) {
            return res.status(400).send({
                ok: false,
                message: "CPF not provided",
            });
        }

        new GrowdeverController().create(nome, cpf, idade, skills);

        return res.status(201).send({
            ok: true,
            message: "Growdever successfully created",
            data: growdeversList,
        });
    }
);

// DELETE http://localhost:3000/growdever/id-123
// Route param
growdeverRoutes.delete("/:id", (req, res) => {
    const { id } = req.params;

    let growdeverIndex = growdeversList.findIndex((item) => item.id === id);

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

// PUT http://localhost:3000/growdever/id-123
// id => route param
// dados alteracao => body
growdeverRoutes.put("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { nome, idade } = req.body;

        const controller = new GrowdeverController();
        const result = controller.update(id, nome, idade);

        if (!result) {
            return res.status(404).send({
                ok: false,
                message: "Cliente não existe",
            });
        }

        return res.status(200).send({
            ok: true,
            message: "Growdever atualizado com sucesso",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).send({
            ok: false,
            message: "Instabilidade no servidor",
            error: error.toString(),
        });
    }
});

// GET http://localhost:3000/growdever/id-123/skills
growdeverRoutes.get("/:id/skills", (req, res) => {
    const { id } = req.params;

    const growdever = growdeversList.find((item) => item.id == id);
    if (!growdever) {
        return res.status(404).send({ ok: false });
    }

    return res.status(200).send({
        ok: true,
        data: growdever.skills,
    });
});

// to-do: finalizar a rota de criar skill
growdeverRoutes.post(
    "/create-skill/:id",
    new GrowdeverController().createSkill
);

// to-do: delete de skill

export { growdeverRoutes };
