import { UpdateGrowdeverUseCase } from "./../usecases/update-growdever.usecase";
import { CacheRepository } from "./../../../shared/repositories/cache.repository";
import { Endereco } from "../../../models/endereco.model";
import { growdeversList } from "../../../shared/data/growdeversList";
import { Request, Response } from "express";
import { Growdever } from "../../../models/growdever.model";
import { dbConnection } from "../../../../main/database/pg.connection";
import { DatabaseConnection } from "../../../../main/database/typeorm.connection";
import { GrowdeverRepository } from "../repositories/growdever.repository";
import { serverError, success } from "../../../shared/util/response.helper";
import { ListGrowdeversUseCase } from "../usecases/list-growdevers.usecase";
import { CreateGrowdeverUseCase } from "../usecases/create-growdever.usecase";
import { GetGrowdeverUseCase } from "../usecases/get-growdevers.usecase";

export class GrowdeverController {
    public async list(req: Request, res: Response) {
        try {
            const usecase = new ListGrowdeversUseCase(new GrowdeverRepository(), new CacheRepository());

            const result = await usecase.execute();
            return success(res, result, "Growdevers successfully listed");
        } catch (error: any) {
            return serverError(res, error);
        }
    }

    public async get(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const usecase = new GetGrowdeverUseCase(new GrowdeverRepository(), new CacheRepository());
            const result = await usecase.execute(id);

            if (!result) {
                return res.status(404).send({
                    ok: false,
                    message: "Growdever not found",
                });
            }

            return res.status(200).send({
                ok: true,
                message: "Growdever successfully obtained",
                data: result,
            });
        } catch (error: any) {
            return serverError(res, error);
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const { nome, cpf, idade, skills, endereco } = req.body;

            const usecase = new CreateGrowdeverUseCase(new GrowdeverRepository(), new CacheRepository());
            const result = await usecase.execute({
                nome,
                cpf,
                idade,
                skills,
                endereco,
            });

            return success(res, result, "Growdever successfully created");
        } catch (error: any) {
            return serverError(res, error);
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { nome, idade } = req.body;

            const usecase = new UpdateGrowdeverUseCase(new GrowdeverRepository(), new CacheRepository());

            const result = await usecase.execute({
                id,
                nome,
                idade,
            });

            if (result === null) {
                return res.status(404).send({
                    ok: false,
                    message: "Growdever not found",
                });
            }

            return res.status(200).send({
                ok: true,
                message: "Growdever atualizado com sucesso",
                data: result,
            });
        } catch (error: any) {
            return serverError(res, error);
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const query = `SELECT * FROM public.growdever WHERE id = '${id}'`;

            const result = await dbConnection.query(query);

            if (result.rowCount <= 0) {
                return res.status(404).send("deu errado! :(");
            }

            await dbConnection.query(`DELETE FROM public.growdever WHERE id = '${id}'`);

            return res.status(200).send({
                ok: true,
                message: "Growdever successfully deleted",
            });
        } catch (error: any) {
            return serverError(res, error);
        }
    }

    public getByCpf(cpf: number) {
        return growdeversList.find((item) => item.cpf === cpf);
    }
}
