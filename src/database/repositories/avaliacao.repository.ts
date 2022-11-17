import { Avaliacao } from "../../models/avaliacao.model";
import { DatabaseConnection } from "../config/connection";
import { AvaliacaoEntity } from "../entities/avaliacao.entity";
import { GrowdeverEntity } from "../entities/growdever.entity";
import { GrowdeverRepository } from "./growdever.repository";

export class AvaliacaoRepository {
    private _repository =
        DatabaseConnection.connection.getRepository(AvaliacaoEntity);

    public async list() {
        return await this._repository.find({
            relations: {
                growdever: true,
            },
        });
    }

    public async get(id: string) {
        return await this._repository.findOneBy({
            id,
        });
    }

    public async create(avaliacao: Avaliacao) {
        const growdeverRepository = new GrowdeverRepository();
        const growdever = await growdeverRepository.get(avaliacao.growdever.id);

        if (!growdever) {
            throw new Error("Growdever não existe");
        }

        const avaliacaoEntity = this._repository.create({
            id: avaliacao.id,
            modulo: avaliacao.modulo,
            nota: avaliacao.nota,
            growdever,
        });

        return await this._repository.save(avaliacaoEntity);
    }
}
