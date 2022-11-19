import { Endereco } from "./../models/endereco.model";
import { growdeversList } from "./../data/growdeversList";
import { Request, Response } from "express";
import { Growdever } from "../models/growdever";
import { dbConnection } from "../database/config/pg.database";
import { DatabaseConnection } from "../database/config/connection";
import { GrowdeverRepository } from "../database/repositories/growdever.repository";

export class GrowdeverController {
    public async list(req: Request, res: Response) {
        try {
            const repository = new GrowdeverRepository();
            const result = await repository.list();

            return res.status(200).send({
                ok: true,
                message: "Growdevers successfully listed",
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

            const repository = new GrowdeverRepository();
            const result = await repository.get(id);

            if (!result) {
                return res.status(404).send({
                    ok: false,
                    message: "Deu ruim! O Growdever não existe",
                });
            }

            const growdever = Growdever.create(
                result.nome,
                result.idade,
                result.cpf,
                result.id,
                result.skills?.split(",") ?? []
            );

            return res.status(200).send({
                ok: true,
                message: "Growdever successfully obtained",
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
            const { nome, cpf, idade, skills, endereco } = req.body;

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

            let endModel: Endereco | undefined = undefined;

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

                endModel = new Endereco(
                    endereco.rua,
                    endereco.cidade,
                    endereco.uf,
                    endereco.complemento
                );
            }

            const growdever = new Growdever(nome, cpf, idade, skills, endModel);

            const repository = new GrowdeverRepository();
            const result = await repository.create(growdever);

            return res.status(201).send({
                ok: true,
                message: "Growdever successfully created",
                data: result,
            });
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { nome, idade } = req.body;

            const repository = new GrowdeverRepository();
            const result = await repository.get(id);

            if (!result) {
                return res.status(404).send({
                    ok: false,
                    message: "Ng aruá!",
                });
            }

            const resultUpdate = repository.update(result, {
                nome,
                idade,
            });

            return res.status(200).send({
                ok: true,
                message: "Growdever atualizado com sucesso",
                data: resultUpdate,
            });
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const query = `SELECT * FROM public.growdever WHERE id = '${id}'`;

            const result = await dbConnection.query(query);

            if (result.rowCount <= 0) {
                return res.status(404).send("deu errado! :(");
            }

            await dbConnection.query(
                `DELETE FROM public.growdever WHERE id = '${id}'`
            );

            return res.status(200).send({
                ok: true,
                message: "Growdever successfully deleted",
            });
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }

    public getByCpf(cpf: number) {
        return growdeversList.find((item) => item.cpf === cpf);
    }
}
