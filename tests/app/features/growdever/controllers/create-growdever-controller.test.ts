import { createServer } from "../../../../../src/main/config/express.config";
import { closeConnection } from "../../../../util/close-connection";
import { openConnection } from "../../../../util/open-connection";

import request from "supertest";
import { DatabaseConnection } from "../../../../../src/main/database/typeorm.connection";
import { GrowdeverEntity } from "../../../../../src/app/shared/entities/growdever.entity";
import { Growdever } from "../../../../../src/app/models/growdever.model";
import { GrowdeverRepository } from "../../../../../src/app/features/growdever/repositories/growdever.repository";
import { Endereco } from "../../../../../src/app/models/endereco.model";
import { EnderecoEntity } from "../../../../../src/app/shared/entities/endereco.entity";

describe("Create growdever - integration controller test", () => {
    beforeAll(async () => await openConnection());
    afterAll(async () => await closeConnection());

    const makeSut = () => {
        const sut = createServer();
        return sut;
    };

    // e2e => end-to-end

    beforeEach(async () => {
        const manager = DatabaseConnection.connection.manager;

        await manager.clear(GrowdeverEntity);
        await manager.clear(EnderecoEntity);
    });

    const createGrowdever = async () => {
        const growdever = new Growdever(
            "Teste",
            23131,
            20,
            ["jest"],
            new Endereco("Rua teste", "cidade", "RS", "abc 123")
        );

        const growdeverRepository = new GrowdeverRepository();
        await growdeverRepository.create(growdever);

        return growdever;
    };
});
