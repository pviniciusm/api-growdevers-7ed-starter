import { growdeversList } from "../data/growdeversList";

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
}
