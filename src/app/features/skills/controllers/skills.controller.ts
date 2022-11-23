import { growdeversList } from "../../../shared/data/growdeversList";
import { Request, Response } from "express";

export class SkillsController {
    public listSkills(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const growdever = growdeversList.find((item) => item.id == id);

            if (!growdever) {
                return res.status(404).send({ ok: false });
            }

            return res.status(200).send({
                ok: true,
                data: growdever.skills,
            });
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }

    public createSkill(req: Request, res: Response) {
        try {
            const { skill } = req.body;
            const { id } = req.params;

            if (!skill) {
                return res.status(400).send({
                    ok: false,
                    message: "Skill not provided",
                });
            }

            const growdever = growdeversList.find(
                (growdever) => growdever.id === id
            );

            if (!growdever)
                return res
                    .status(404)
                    .send({ message: "Growdever não encontrado!" });

            growdever.skills.push(skill);

            return res.send({
                ok: true,
            });
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }

    public removeSkill(req: Request, res: Response) {
        try {
            const { id, skill } = req.params;

            const growdever = growdeversList.find(
                (growdever) => growdever.id === id
            );

            if (!growdever) {
                return res.status(404).send({
                    ok: false,
                    message: "growdever not found",
                });
            }

            const skillIndex = growdever.skills.findIndex(
                (item) => item === skill
            );

            if (skillIndex < 0) {
                return res.status(404).send({
                    ok: false,
                    message: "skill not found",
                });
            }

            growdever.skills.splice(skillIndex, 1);

            return res.send({
                ok: true,
            });
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString(),
            });
        }
    }
}
