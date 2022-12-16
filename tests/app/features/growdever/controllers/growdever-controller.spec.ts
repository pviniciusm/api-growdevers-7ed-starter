import { closeConnection } from "../../../../util/close-connection";
import { openConnection } from "../../../../util/open-connection";
import { GrowdeverController } from "../../../../../src/app/features/growdever/controllers/growdever.controller";

describe("Growdever controller tests", () => {
    beforeAll(async () => await openConnection());
    afterAll(async () => await closeConnection());

    const makeSut = () => {
        const sut = new GrowdeverController();

        return sut;
    };

    test("deve retornar HTTP 200 quando o growdever for criado com sucesso", async () => {
        const sut = makeSut();

        // const result = await sut.create();

        // ...
    });
});
