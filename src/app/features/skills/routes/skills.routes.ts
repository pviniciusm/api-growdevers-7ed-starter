import { Router } from "express";
import { GrowdeverController } from "../../growdever/controllers/growdever.controller";
import { SkillsController } from "../controllers/skills.controller";

export const skillsRoutes = Router({
    mergeParams: true,
});

skillsRoutes.get("/", new SkillsController().listSkills);
skillsRoutes.post("/", new SkillsController().createSkill);
skillsRoutes.delete("/:skill", new SkillsController().removeSkill);
