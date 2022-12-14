import { Request, Response } from "express";
import { AvaliacaoRepository } from "../repositories/avaliacao.repository";
import { GrowdeverRepository } from "../../growdever/repositories/growdever.repository";
import { Avaliacao } from "../../../models/avaliacao.model";
import { Growdever } from "../../../models/growdever.model";

export class AvaliacaoController {
    public async list(req: Request, res: Response) {
        try {
            const repository = new AvaliacaoRepository();
            const result = await repository.list();

            return res.status(200).send({
                ok: true,
                data: result,
            });
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }

    public async get(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const repository = new AvaliacaoRepository();
            const result = await repository.get(id);

            if (!result) {
                return res.status(404).send({
                    ok: false,
                    message: "Avaliacao not found",
                });
            }

            return res.status(200).send({
                ok: true,
                data: result,
            });
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const { modulo, nota, idGrowdever } = req.body;

            if (!modulo) {
                return res.status(400).send({
                    ok: false,
                    message: "Modulo não foi informado",
                });
            }

            if (!nota) {
                return res.status(400).send({
                    ok: false,
                    message: "Nota não foi informada",
                });
            }

            if (!idGrowdever) {
                return res.status(400).send({
                    ok: false,
                    message: "Growdever (idGrowdever) não foi informado",
                });
            }

            // 1- verificar se o growdever existe
            const growdeverRepository = new GrowdeverRepository();
            const growdeverResult = await growdeverRepository.get(idGrowdever);

            if (!growdeverResult) {
                return res.status(404).send({
                    ok: false,
                    message: "Growdever não existe",
                });
            }

            const growdever = Growdever.create(
                growdeverResult.nome,
                growdeverResult.idade,
                growdeverResult.cpf,
                growdeverResult.id
                // growdeverResult.skills?.split(",")
            );

            // 2- criar uma avaliação (model)
            const avaliacao = new Avaliacao(modulo, nota, growdever);

            // 3 - salvar a avaliação no BD
            const avaliacaoRepository = new AvaliacaoRepository();
            const result = await avaliacaoRepository.create(avaliacao);

            return res.status(201).send({
                ok: true,
                data: result,
            });
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }
}
