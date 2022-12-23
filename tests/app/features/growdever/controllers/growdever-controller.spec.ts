import { closeConnection } from "../../../../util/close-connection";
import { openConnection } from "../../../../util/open-connection";
import { GrowdeverController } from "../../../../../src/app/features/growdever/controllers/growdever.controller";
import { createServer } from "../../../../../src/main/config/express.config";

import request from "supertest";
import { CreateGrowdeverUseCase } from "../../../../../src/app/features/growdever/usecases/create-growdever.usecase";
import { Growdever } from "../../../../../src/app/models/growdever.model";

describe.skip("Growdever controller tests", () => {
    beforeAll(async () => await openConnection());
    afterAll(async () => await closeConnection());

    const makeSut = () => {
        const sut = createServer();
        return sut;
    };

    test("deve retornar HTTP 400 quando o nome nao for informado", async () => {
        const app = makeSut();

        const result = await request(app).post("/growdever").send({});

        expect(result.statusCode).toBe(400);
    });

    test("deve retornar HTTP 200 quando o growdever for criado com sucesso", async () => {
        const app = makeSut();

        const growdever = {
            nome: "abc",
            idade: 20,
            cpf: 1234,
        };

        jest.spyOn(
            CreateGrowdeverUseCase.prototype,
            "execute"
        ).mockResolvedValue(
            new Growdever(
                growdever.nome,
                growdever.cpf,
                growdever.idade
            ).toJson()
        );

        const result = await request(app).post("/growdever").send(growdever);

        expect(result.statusCode).toBe(201);
        expect(result.body).not.toBeNull();
        expect(result).toHaveProperty("body.ok", true);
        expect(result).toHaveProperty(
            "body.mensagem",
            "Growdever successfully created"
        );
    });

    test("deve retornar HTTP 500 quando o usecase gerar excecao", async () => {
        const app = makeSut();

        const growdever = {
            nome: "abc",
            idade: 20,
            cpf: 1234,
        };

        jest.spyOn(
            CreateGrowdeverUseCase.prototype,
            "execute"
        ).mockImplementation(() => {
            throw new Error("Erro no teste unitario");
        });

        const result = await request(app).post("/growdever").send(growdever);

        expect(result.statusCode).toBe(500);
        expect(result.body).not.toBeNull();
        expect(result).toHaveProperty("body.ok", false);
        expect(result).toHaveProperty(
            "body.message",
            new Error("Erro no teste unitario").toString()
        );
    });

    test("Exemplos de get, put, delete", async () => {
        const app = makeSut();

        const growdever = {
            nome: "abc",
            idade: 20,
            cpf: 1234,
            id: "123",
        };

        // const result = await request(app).get("/growdever").send();

        // const result = await request(app)
        //     .get(`/growdever/${growdever.id}`)
        //     .send();

        // const result = await request(app)
        //     .get(`/growdever`)
        //     .query({
        //         nome: growdever.nome
        //     })
        //     .send();

        // const result = await request(app)
        //     .put(`/growdever/${growdever.id}`)
        //     .send({
        //         idade: 35
        //     });

        // const result = await request(app)
        //     .delete(`/growdever/${growdever.id}`)
        //     .send();
    });
});
