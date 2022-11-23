import { Endereco } from "../../../models/endereco.model";
import { EnderecoEntity } from "../../../shared/entities/endereco.entity";
import { DatabaseConnection } from "../../../../main/database/typeorm.connection";

export class EnderecoRepository {
    private _repository =
        DatabaseConnection.connection.getRepository(EnderecoEntity);

    public async create(endereco: Endereco) {
        const enderecoEntity = this._repository.create({
            rua: endereco.rua,
            cidade: endereco.cidade,
            complemento: endereco.complemento,
            uf: endereco.uf,
        });

        return await this._repository.save(enderecoEntity);
    }
}
