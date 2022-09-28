import { NextFunction, Request, Response } from "express";
import { GrowdeverController } from "../controllers/growdever.controller";

export const cpfExistsMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { cpf } = req.body;

    const growdever = new GrowdeverController().getByCpf(cpf);

    if (growdever) {
        return res.status(400).send({
            ok: false,
            message: "Growdever already exists",
        });
    }

    next();
};
