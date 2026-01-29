import { Router } from "express";
import { TaskController } from "./task.controller";
import { validate } from "../../../common/middleware/validate.middleware";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
  paginationQuerySchema
} from "../schemas/task.schema";

const router = Router();
const controller = new TaskController();

router.post(
  "/",
  validate(createTaskSchema, "body"),
  controller.create
);

router.get(
  "/",
  validate(paginationQuerySchema, "query"),
  controller.list
);

router.get(
  "/:id",
  validate(taskIdParamSchema, "params"),
  controller.getById
);

router.put(
  "/:id",
  validate(taskIdParamSchema, "params"),
  validate(updateTaskSchema, "body"),
  controller.update
);

router.delete(
  "/:id",
  validate(taskIdParamSchema, "params"),
  controller.delete
);

export default router;
