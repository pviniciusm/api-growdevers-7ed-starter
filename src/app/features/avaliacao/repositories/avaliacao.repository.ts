import { Avaliacao } from "../../../models/avaliacao.model";
import { DatabaseConnection } from "../../../../main/database/typeorm.connection";
import { AvaliacaoEntity } from "../../../shared/entities/avaliacao.entity";
import { GrowdeverEntity } from "../../../shared/entities/growdever.entity";
import { GrowdeverRepository } from "../../growdever/repositories/growdever.repository";

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
        const avaliacaoEntity = this._repository.create({
            id: avaliacao.id,
            modulo: avaliacao.modulo,
            nota: avaliacao.nota,
            id_growdever: avaliacao.growdever.id,
        });

        return await this._repository.save(avaliacaoEntity);
    }
}
