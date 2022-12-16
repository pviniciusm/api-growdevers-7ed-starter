import { Endereco } from "../../../models/endereco.model";
import { EnderecoRepository } from "../../endereco/repositories/endereco.repository";
import { Growdever } from "../../../models/growdever.model";
import { DatabaseConnection } from "../../../../main/database/typeorm.connection";
import { GrowdeverEntity } from "../../../shared/entities/growdever.entity";

interface UpdateGrowdeverDTO {
    nome?: string;
    idade?: number;
}

export class GrowdeverRepository {
    private _repository =
        DatabaseConnection.connection.getRepository(GrowdeverEntity);

    public async list() {
        const result = await this._repository.find({
            relations: {
                avaliacoes: true,
            },
        });

        const growdevers = result.map((item) => {
            return this.mapEntityToModel(item);
        });

        return growdevers;
    }

    private mapEntityToModel(item: GrowdeverEntity) {
        let endereco = undefined;

        if (item.endereco) {
            endereco = Endereco.create(
                item.endereco.id,
                item.endereco.rua,
                item.endereco.cidade,
                item.endereco.uf,
                item.endereco.complemento
            );
        }

        return Growdever.create(
            item.nome,
            item.idade,
            item.cpf,
            item.id,
            item.skills?.split(","),
            endereco
        );
    }

    public async get(id: string) {
        const result = await this._repository.findOneBy({
            id,
        });

        if (!result) {
            return null;
        }

        return this.mapEntityToModel(result);
    }

    public async getByCpf(cpf: number) {
        const result = await this._repository.findOneBy({
            cpf,
        });

        if (!result) {
            return null;
        }

        return this.mapEntityToModel(result);
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

        const result = await this._repository.save(growdeverEntity);

        return this.mapEntityToModel(result);
    }

    public async update(growdever: Growdever) {
        const result = await this._repository.update(
            {
                id: growdever.id,
            },
            {
                nome: growdever.nome,
                idade: growdever.idade,
            }
        );

        return result.affected ?? 0;
    }

    // public async listQuery() {
    //     return await DatabaseConnection.connection.query(
    //         "SELECT * FROM public.growdever"
    //     );
    // }
}
