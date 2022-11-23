import { Endereco } from "../../../models/endereco.model";
import { Growdever } from "../../../models/growdever.model";
import { GrowdeverRepository } from "../repositories/growdever.repository";

export class ListGrowdeversUseCase {
    constructor(private repository: GrowdeverRepository) {}

    public async execute() {
        const result = await this.repository.list();

        return result.map((item) => item.toJson());
    }
}
