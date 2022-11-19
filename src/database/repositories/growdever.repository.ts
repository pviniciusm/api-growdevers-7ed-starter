import { Endereco } from "./../../models/endereco.model";
import { EnderecoRepository } from "./endereco.repository";
import { Growdever } from "../../models/growdever";
import { DatabaseConnection } from "../config/connection";
import { GrowdeverEntity } from "../entities/growdever.entity";

interface UpdateGrowdeverDTO {
    nome?: string;
    idade?: number;
}

export class GrowdeverRepository {
    private _repository =
        DatabaseConnection.connection.getRepository(GrowdeverEntity);

    public async list() {
        return await this._repository.find({
            relations: {
                avaliacoes: true,
            },
        });
    }

    public async get(id: string) {
        return await this._repository.findOneBy({
            id,
        });
    }

    public async create(growdever: Growdever) {
        // Criar o endereço
        const growdeverEntity = this._repository.create({
            id: growdever.id,
            cpf: growdever.cpf,
            idade: growdever.idade,
            nome: growdever.nome,
            skills: growdever.skills.join(","),
        });

        if (growdever.endereco) {
            const enderecoRepository = new EnderecoRepository();
            const result = await enderecoRepository.create(growdever.endereco);

            growdeverEntity.id_endereco = result.id;
        }

        return await this._repository.save(growdeverEntity);
    }

    public async update(
        growdeverEntity: GrowdeverEntity,
        data: UpdateGrowdeverDTO
    ) {
        if (data.idade) {
            growdeverEntity.idade = data.idade;
        }

        if (data.nome) {
            growdeverEntity.nome = data.nome;
        }

        return await this._repository.save(growdeverEntity);
    }

    // public async listQuery() {
    //     return await DatabaseConnection.connection.query(
    //         "SELECT * FROM public.growdever"
    //     );
    // }
}
