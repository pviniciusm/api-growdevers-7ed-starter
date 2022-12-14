import { GrowdeverRepository } from "../src/app/features/growdever/repositories/growdever.repository";
import { ListGrowdeversUseCase } from "../src/app/features/growdever/usecases/list-growdevers.usecase";
import { CacheRepository } from "../src/app/shared/repositories/cache.repository";
import { CacheConnection } from "../src/main/database/cache.connection";
import { DatabaseConnection } from "../src/main/database/typeorm.connection";

describe("Testes iniciais", () => {
    // Vai rodar antes de todos os testes
    // do conjunto atual
    beforeAll(async () => {
        await DatabaseConnection.connect();
        await CacheConnection.connect();
    });

    afterAll(async () => {
        await DatabaseConnection.connection.destroy();
        await CacheConnection.connection.quit();
    });

    test("deve retornar 2 quando somar 1 + 1", () => {
        const result = 1 + 1;
        expect(result).toBe(2);
    });

    test("um objeto usuario deve conter um atributo id se o usuario for valido", () => {
        const user = {
            id: "1345-abc",
            nome: "Joao",
            idade: 60,
        };

        expect(user).toHaveProperty("id");
        expect(user.idade).toBeGreaterThan(50);
    });

    test("deve testar um usecase só pra cobertura", async () => {
        const sut = new ListGrowdeversUseCase(
            new GrowdeverRepository(),
            new CacheRepository()
        );

        const result = await sut.execute();

        expect(result).toBeDefined();
        expect(result).not.toBeNull();
    });
});
