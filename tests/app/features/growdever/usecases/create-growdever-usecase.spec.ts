import { CacheConnection } from "../../../../../src/main/database/cache.connection";
import { DatabaseConnection } from "../../../../../src/main/database/typeorm.connection";
import { CreateGrowdeverUseCase } from "../../../../../src/app/features/growdever/usecases/create-growdever.usecase";
import { GrowdeverRepository } from "../../../../../src/app/features/growdever/repositories/growdever.repository";
import { CacheRepository } from "../../../../../src/app/shared/repositories/cache.repository";
import { Growdever } from "../../../../../src/app/models/growdever.model";
import { Endereco } from "../../../../../src/app/models/endereco.model";

describe("Create growdever usecase unit tests", () => {
    beforeAll(async () => {
        await DatabaseConnection.connect();
        await CacheConnection.connect();
    });

    afterAll(async () => {
        await DatabaseConnection.connection.destroy();
        await CacheConnection.connection.quit();
    });

    beforeEach(() => {
        jest.restoreAllMocks();

        jest.spyOn(GrowdeverRepository.prototype, "getByCpf").mockResolvedValue(
            null
        );
    });

    const makeSut = () => {
        const sut = new CreateGrowdeverUseCase(
            new GrowdeverRepository(),
            new CacheRepository()
        );

        return sut;
    };

    test("deve retornar os dados de um novo growdever ao executar o create com sucesso", async () => {
        const sut = makeSut();

        const growdever = {
            cpf: 123,
            nome: "José",
            idade: 30,
        };

        jest.spyOn(GrowdeverRepository.prototype, "create").mockResolvedValue(
            new Growdever(growdever.nome, growdever.cpf, growdever.idade)
        );

        jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

        const result = await sut.execute(growdever);

        expect(result).not.toBeNull();
        expect(result).toBeDefined();
        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("cpf", growdever.cpf);
        expect(result).toHaveProperty("nome", growdever.nome);
        expect(result).toHaveProperty("idade", growdever.idade);
        expect(result).toHaveProperty("skills", []);
    });

    test("deve retornar os dados de um novo growdever com skills ao executar o create com sucesso", async () => {
        const sut = makeSut();

        const growdever = {
            cpf: 123,
            nome: "José",
            idade: 30,
            skills: ["nodejs", "jest"],
        };

        jest.spyOn(GrowdeverRepository.prototype, "create").mockResolvedValue(
            new Growdever(
                growdever.nome,
                growdever.cpf,
                growdever.idade,
                growdever.skills
            )
        );

        jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

        const result = await sut.execute(growdever);

        expect(result).not.toBeNull();
        expect(result).toBeDefined();
        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("cpf", growdever.cpf);
        expect(result).toHaveProperty("nome", growdever.nome);
        expect(result).toHaveProperty("idade", growdever.idade);
        expect(result).toHaveProperty("skills", ["nodejs", "jest"]);
    });

    test("deve retornar os dados de um novo growdever e do seu endereco ao executar o create com sucesso", async () => {
        const sut = makeSut();

        const growdever = {
            cpf: 123,
            nome: "José",
            idade: 30,
            endereco: {
                rua: "Avenida X",
                cidade: "POA",
                uf: "RS",
            },
        };

        jest.spyOn(GrowdeverRepository.prototype, "create").mockResolvedValue(
            new Growdever(
                growdever.nome,
                growdever.cpf,
                growdever.idade,
                [],
                new Endereco(
                    growdever.endereco.rua,
                    growdever.endereco.cidade,
                    growdever.endereco.uf
                )
            )
        );

        jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

        const result = await sut.execute(growdever);

        expect(result).not.toBeNull();
        expect(result).toBeDefined();
        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("cpf", growdever.cpf);
        expect(result).toHaveProperty("nome", growdever.nome);
        expect(result).toHaveProperty("idade", growdever.idade);
        expect(result).toHaveProperty("skills", []);

        expect(result).toHaveProperty("endereco.rua", growdever.endereco.rua);
        expect(result).toHaveProperty(
            ["endereco", "cidade"],
            growdever.endereco.cidade
        );
        expect(result).toHaveProperty(
            ["endereco", "uf"],
            growdever.endereco.uf
        );
    });

    test("deve retornar null quando o growdever já existe", async () => {
        const sut = makeSut();

        const growdever = {
            cpf: 123,
            nome: "José",
            idade: 30,
        };

        jest.spyOn(GrowdeverRepository.prototype, "getByCpf").mockResolvedValue(
            new Growdever(growdever.nome, growdever.cpf, growdever.idade)
        );

        const result = await sut.execute(growdever);

        expect(result).toBeNull();
    });
});
