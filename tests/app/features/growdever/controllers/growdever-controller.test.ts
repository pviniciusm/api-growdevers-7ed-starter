import { createServer } from "../../../../../src/main/config/express.config";
import { closeConnection } from "../../../../util/close-connection";
import { openConnection } from "../../../../util/open-connection";

import request from "supertest";
import { DatabaseConnection } from "../../../../../src/main/database/typeorm.connection";
import { GrowdeverEntity } from "../../../../../src/app/shared/entities/growdever.entity";

describe("Get growdever by id - integration controller test", () => {
    beforeAll(async () => await openConnection());
    afterAll(async () => await closeConnection());

    const makeSut = () => {
        const sut = createServer();
        return sut;
    };

    // e2e => end-to-end

    beforeEach(async () => {
        const growdeverRepository =
            DatabaseConnection.connection.getRepository(GrowdeverEntity);

        await growdeverRepository.delete({
            id: "abc",
        });
    });

    test("deve retornar 404 se o growdever não existir", async () => {
        const app = makeSut();

        const result = await request(app).get("/growdever/abc").send();

        expect(result).not.toBeNull();
        expect(result.statusCode).toEqual(404);
        expect(result).toHaveProperty("body.ok", false);
    });
});
