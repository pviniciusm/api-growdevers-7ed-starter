import { closeConnection } from "../../../../util/close-connection";
import { openConnection } from "../../../../util/open-connection";

import { GrowdeverRepository } from "../../../../../src/app/features/growdever/repositories/growdever.repository";
import { Growdever } from "../../../../../src/app/models/growdever.model";
import { Endereco } from "../../../../../src/app/models/endereco.model";
import { EnderecoRepository } from "../../../../../src/app/features/endereco/repositories/endereco.repository";
import { UpdateEnderecoUseCase } from "../../../../../src/app/features/endereco/usecases/update-endereco.usecase";

describe("Update Endereco unit tests", () => {
    beforeAll(async () => await openConnection());
    afterAll(async () => await closeConnection());

    const makeSut = () => {
        const sut = new UpdateEnderecoUseCase(
            new GrowdeverRepository(),
            new EnderecoRepository()
        );
        return sut;
    };

    test("deve retornar erro NotFound se o growdever não existe", async () => {
        const sut = makeSut();

        jest.spyOn(GrowdeverRepository.prototype, "get").mockResolvedValue(
            null
        );

        const enderecoDTO = {
            id: "any_id",
            rua: "teste",
            cidade: "teste",
            uf: "RS",
        };
        const result = await sut.execute(enderecoDTO);

        expect(result).not.toBeNull();
        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", false);
        expect(result).toHaveProperty("message", "growdever não existe");
        expect(result).toHaveProperty("code", "NotFound");
    });

    test("deve retornar erro AddressNotFound se o growdever não possui endereço", async () => {
        const sut = makeSut();

        jest.spyOn(GrowdeverRepository.prototype, "get").mockResolvedValue(
            new Growdever("Teste", 12345, 20)
        );

        const enderecoDTO = {
            id: "any_id",
            rua: "teste",
            cidade: "teste",
            uf: "RS",
        };
        const result = await sut.execute(enderecoDTO);

        expect(result).not.toBeNull();
        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", false);
        expect(result).toHaveProperty(
            "message",
            "growdever não possui endereço"
        );
        expect(result).toHaveProperty("code", "AddressNotFound");
    });

    test("deve retornar erro InvalidValueError se a UF informada possuir um tamanho diferente de 2 caracteres", async () => {
        const sut = makeSut();

        jest.spyOn(GrowdeverRepository.prototype, "get").mockResolvedValue(
            new Growdever(
                "Teste",
                12345,
                20,
                ["node"],
                new Endereco("teste", "teste", "RS")
            )
        );

        const enderecoDTO = {
            id: "any_id",
            rua: "teste",
            cidade: "teste",
            uf: "UF_Invalida",
        };
        const result = await sut.execute(enderecoDTO);

        expect(result).not.toBeNull();
        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", false);
        expect(result).toHaveProperty("message", "a UF é inválida");
        expect(result).toHaveProperty("code", "InvalidValueError");
    });

    test("deve retornar erro InvalidValueError se a UF informada não representar algum estado brasileiro", async () => {
        const sut = makeSut();

        jest.spyOn(GrowdeverRepository.prototype, "get").mockResolvedValue(
            new Growdever(
                "Teste",
                12345,
                20,
                ["node"],
                new Endereco("teste", "teste", "RS")
            )
        );

        const enderecoDTO = {
            id: "any_id",
            rua: "teste",
            cidade: "teste",
            uf: "PP",
        };
        const result = await sut.execute(enderecoDTO);

        expect(result).not.toBeNull();
        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", false);
        expect(result).toHaveProperty("message", "a UF é inválida");
        expect(result).toHaveProperty("code", "InvalidValueError");
    });

    test("deve retornar sucesso se o endereço for atualizado com sucesso", async () => {
        const sut = makeSut();

        jest.spyOn(GrowdeverRepository.prototype, "get").mockResolvedValue(
            new Growdever(
                "Teste",
                12345,
                20,
                ["node"],
                new Endereco("teste", "teste", "RS")
            )
        );

        jest.spyOn(EnderecoRepository.prototype, "update").mockResolvedValue();

        const enderecoDTO = {
            id: "any_id",
            rua: "teste",
            cidade: "teste",
            uf: "RS",
        };
        const result = await sut.execute(enderecoDTO);

        expect(result).not.toBeNull();
        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", true);
        expect(result).toHaveProperty(
            "message",
            "o endereço foi atualizado com sucesso"
        );
    });
});
