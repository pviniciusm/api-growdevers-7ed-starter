import { Router } from "express";
import { GrowdeverController } from "../controllers/growdever.controller";

export const skillsRoutes = Router({
    mergeParams: true,
});

skillsRoutes.get("/", new GrowdeverController().listSkills);
skillsRoutes.post("/", new GrowdeverController().createSkill);
skillsRoutes.delete("/:skill", new GrowdeverController().removeSkill);
