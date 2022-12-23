import { closeConnection } from "../../../../util/close-connection";
import { openConnection } from "../../../../util/open-connection";

import { GrowdeverRepository } from "../../../../../src/app/features/growdever/repositories/growdever.repository";
import { Growdever } from "../../../../../src/app/models/growdever.model";
import { Endereco } from "../../../../../src/app/models/endereco.model";

interface UpdateEnderecoDTO {
    id: string;
    rua: string;
    cidade: string;
    uf: string;
}

class UpdateEnderecoUseCase {
    constructor(private growdeverRepository: GrowdeverRepository) {}

    public async execute(data: UpdateEnderecoDTO) {
        const growdever = await this.growdeverRepository.get(data.id);

        // Regra 1 - verificar se o growdever existe
        if (!growdever) {
            return {
                ok: false,
                message: "growdever não existe",
                code: "NotFound",
            };
        }

        // Regra 2 - verificar se o growdever possui endereço
        if (!growdever.endereco) {
            return {
                ok: false,
                message: "growdever não possui endereço",
                code: "AddressNotFound",
            };
        }

        // Regra 3.1 - verificar se a UF é válida (2 caracteres)
        // Regra 3.2 - verificar se a UF é válida (representa um estado brasileiro)
        if (!this.verificaValidadeUF(data.uf)) {
            return {
                ok: false,
                message: "a UF é inválida",
                code: "InvalidValueError",
            };
        }
    }

    private verificaValidadeUF(uf: string) {
        if (uf.length != 2) {
            return false;
        }

        const ufsValidas = [
            "AC",
            "AL",
            "AP",
            "AM",
            "BA",
            "CE",
            "DF",
            "ES",
            "GO",
            "MA",
            "MT",
            "MS",
            "MG",
            "PA",
            "PB",
            "PR",
            "PE",
            "PI",
            "RJ",
            "RN",
            "RS",
            "RO",
            "RR",
            "SC",
            "SP",
            "SE",
            "TO",
        ];

        return ufsValidas.includes(uf);
    }
}

describe("Update Endereco unit tests", () => {
    beforeAll(async () => await openConnection());
    afterAll(async () => await closeConnection());

    const makeSut = () => {
        const sut = new UpdateEnderecoUseCase(new GrowdeverRepository());
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
});

// Cenários de teste - Atualizar o endereço de um growdever

// 1- verificar se o growdever existe
// {
//     ok: false,
//     message: "growdever não existe",
//     code: "NotFound"
// }

// 2- verificar se o growdever possui endereço
// {
//     ok: false,
//     message: "growdever não possui endereço",
//     code: "AddressNotFound"
// }

// 3- verificar se a UF é válida (2 caracteres e for de um estado existente)
// {
//     ok: false,
//     message: "a UF é inválida",
//     code: "InvalidValueError"
// }

// 4- garantir que o endereço seja atualizado

// {
//     ok: false/true,
//     message: string;
//     code: string;
//     data: qualquer coisa
// }
