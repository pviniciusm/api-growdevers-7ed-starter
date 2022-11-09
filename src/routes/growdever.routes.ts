import { Router } from "express";

import { GrowdeverController } from "../controllers/growdever.controller";
import { cpfExistsMiddleware } from "../middlewares/cpf-exists.middleware";
import { cpfValidatorMiddleware } from "../middlewares/cpf-validator.middleware";
import { logGetMiddleware } from "../middlewares/log-get.middleware";
import { skillsRoutes } from "./skills.routes";

const growdeverRoutes = Router();

growdeverRoutes.get("/", [logGetMiddleware], new GrowdeverController().list);
growdeverRoutes.get("/:id", new GrowdeverController().get);
growdeverRoutes.post(
    "/",
    [cpfExistsMiddleware],
    new GrowdeverController().create
);
growdeverRoutes.delete("/:id", new GrowdeverController().delete);
growdeverRoutes.put("/:id", new GrowdeverController().update);

growdeverRoutes.use("/:id/skills", skillsRoutes);

export { growdeverRoutes };
