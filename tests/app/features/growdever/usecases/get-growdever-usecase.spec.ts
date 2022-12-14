import { CacheConnection } from "../../../../../src/main/database/cache.connection";
import { DatabaseConnection } from "../../../../../src/main/database/typeorm.connection";
import { GetGrowdeverUseCase } from "../../../../../src/app/features/growdever/usecases/get-growdevers.usecase";
import { GrowdeverRepository } from "../../../../../src/app/features/growdever/repositories/growdever.repository";
import { CacheRepository } from "../../../../../src/app/shared/repositories/cache.repository";
import { Growdever } from "../../../../../src/app/models/growdever.model";

describe("Get growdever usecase tests", () => {
    beforeAll(async () => {
        await DatabaseConnection.connect();
        await CacheConnection.connect();
    });

    afterAll(async () => {
        await DatabaseConnection.connection.destroy();
        await CacheConnection.connection.quit();
    });

    const makeSut = () => {
        const sut = new GetGrowdeverUseCase(
            new GrowdeverRepository(),
            new CacheRepository()
        );

        return sut;
    };

    test("deve retornar um growdever valido se o id existir", async () => {
        const sut = makeSut();

        const growdever = new Growdever("abc", 132, 20, ["test"]);
        jest.spyOn(GrowdeverRepository.prototype, "get").mockResolvedValue(
            growdever
        );
        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);

        const result = await sut.execute(growdever.id);

        expect(result).not.toBeNull();
        expect(result.id).toBe(growdever.id);
    });

    test("deve retornar null quando o growdever não existe", async () => {
        const sut = makeSut();

        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
        jest.spyOn(GrowdeverRepository.prototype, "get").mockResolvedValue(
            null
        );

        const result = await sut.execute("id-qualquer");

        expect(result).toBeNull();
    });

    test("deve retornar um growdever caso esteja em cache", async () => {
        const sut = makeSut();

        const growdever = new Growdever("nome-teste", 123, 20);
        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(
            growdever.toJson()
        );

        const result = await sut.execute(growdever.id);

        expect(result).not.toBeNull();
        expect(result).toHaveProperty("id");
        expect(result.id).toBe(growdever.id);
    });
});
