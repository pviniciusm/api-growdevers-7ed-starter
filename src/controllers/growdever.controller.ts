import { growdeversList } from "./../data/growdeversList";
import { Request, Response } from "express";
import { Growdever } from "../models/growdever";

export class GrowdeverController {
    public list(nome?: string, idade?: number) {
        let lista = growdeversList;

        if (nome) {
            lista = growdeversList.filter((item) => item.nome === nome);
        }

        if (idade) {
            lista = lista.filter((item) => item.idade == idade);
        }

        let listaRetorno = lista.map((growdever) => {
            return growdever.getGrowdever();
        });

        return listaRetorno;
    }

    public update(id: string, nome: string, idade: number) {
        const growdever = growdeversList.find((item) => item.id === id);

        if (!growdever) {
            return undefined;
        }

        growdever.nome = nome;
        growdever.idade = idade;

        return growdeversList;
    }

    public createSkill(req: Request, res: Response) {
        const { skill } = req.body;
        const { id } = req.params;

        const growdever = growdeversList.find(
            (growdever) => growdever.id === id
        );

        if (!growdever)
            return res
                .status(404)
                .json({ message: "Growdever não encontrado!" });

        // to-do
    }

    public removeSkill() {
        // to-do
    }

    public create(nome: string, cpf: number, idade: number, skills?: string[]) {
        const growdever = new Growdever(nome, cpf, idade, skills);
        growdeversList.push(growdever);
    }

    public getByCpf(cpf: number) {
        return growdeversList.find((item) => item.cpf === cpf);
    }
}
