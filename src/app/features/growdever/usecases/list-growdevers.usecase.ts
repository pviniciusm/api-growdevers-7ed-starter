import { Endereco } from "../../../models/endereco.model";
import { Growdever } from "../../../models/growdever.model";
import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { GrowdeverRepository } from "../repositories/growdever.repository";

export class ListGrowdeversUseCase {
    constructor(private repository: GrowdeverRepository, private cacheRepository: CacheRepository) {}

    public async execute() {
        const cachedList = await this.cacheRepository.get("growdevers");
        if (cachedList) {
            return {
                cache: true,
                data: cachedList,
            };
        }

        const result = await this.repository.list();
        const resultJson = result.map((item) => item.toJson());

        await this.cacheRepository.set("growdevers", resultJson);

        return resultJson;
    }
}
