import { NextFunction, Request, Response } from "express";

export const createGrowdeverValidator = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { nome, cpf, idade, endereco } = req.body;

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

    if (endereco) {
        if (!endereco.rua) {
            return res.status(400).send({
                ok: false,
                message: "endereco.rua not provided",
            });
        }

        if (!endereco.cidade) {
            return res.status(400).send({
                ok: false,
                message: "endereco.cidade not provided",
            });
        }

        if (!endereco.uf) {
            return res.status(400).send({
                ok: false,
                message: "endereco.uf not provided",
            });
        }
    }

    next();
};
