import { growdeversList } from "./../data/growdeversList";
import { Request, Response } from "express";
import { Growdever } from "../models/growdever";
import { dbConnection } from "../database/pg.database";

export class GrowdeverController {
    public async list(req: Request, res: Response) {
        try {
            const { nome, idade } = req.query;

            let where = "";

            if (nome) {
                where = `WHERE nome LIKE '%${nome}%'`;
            }

            const result = await dbConnection.query(
                "SELECT * FROM public.growdever " + where
            );

            return res.status(200).send({
                ok: true,
                message: "Growdevers successfully listed",
                data: result.rows,
            });
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }

    public get(req: Request, res: Response) {
        try {
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
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }

    public async create(req: Request, res: Response) {
        try {
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

            const growdever = new Growdever(nome, cpf, idade, skills);

            const query = `INSERT INTO public.growdever (id, nome, cpf, idade, skills) values ('${
                growdever.id
            }', '${growdever.nome}', ${growdever.cpf}, ${
                growdever.idade
            }, '${growdever.skills.join(",")}')`;

            const result = await dbConnection.query(query);

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

    public update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { nome, idade } = req.body;

            const growdever = growdeversList.find((item) => item.id === id);

            if (!growdever) {
                return res.status(404).send({
                    ok: false,
                    message: "Growdever não existe",
                });
            }

            growdever.nome = nome;
            growdever.idade = idade;

            return res.status(200).send({
                ok: true,
                message: "Growdever atualizado com sucesso",
                data: growdeversList,
            });
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }

    public delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            let growdeverIndex = growdeversList.findIndex(
                (item) => item.id === id
            );

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
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }

    public listSkills(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const growdever = growdeversList.find((item) => item.id == id);

            if (!growdever) {
                return res.status(404).send({ ok: false });
            }

            return res.status(200).send({
                ok: true,
                data: growdever.skills,
            });
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }

    public createSkill(req: Request, res: Response) {
        try {
            const { skill } = req.body;
            const { id } = req.params;

            if (!skill) {
                return res.status(400).send({
                    ok: false,
                    message: "Skill not provided",
                });
            }

            const growdever = growdeversList.find(
                (growdever) => growdever.id === id
            );

            if (!growdever)
                return res
                    .status(404)
                    .send({ message: "Growdever não encontrado!" });

            growdever.skills.push(skill);

            return res.send({
                ok: true,
            });
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }

    public removeSkill(req: Request, res: Response) {
        try {
            const { id, skill } = req.params;

            const growdever = growdeversList.find(
                (growdever) => growdever.id === id
            );

            if (!growdever) {
                return res.status(404).send({
                    ok: false,
                    message: "growdever not found",
                });
            }

            const skillIndex = growdever.skills.findIndex(
                (item) => item === skill
            );

            if (skillIndex < 0) {
                return res.status(404).send({
                    ok: false,
                    message: "skill not found",
                });
            }

            growdever.skills.splice(skillIndex, 1);

            return res.send({
                ok: true,
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
