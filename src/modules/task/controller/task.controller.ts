import { Request, Response } from "express";
import { TaskService } from "../service/task.service";
import { sendSuccess } from "../../../common/helpers/response.helper";
import { catchAsync } from "../../../common/helpers/catchAsync";

const service = new TaskService();

export class TaskController {

  create = catchAsync(async (req: Request, res: Response) => {
    const task = await service.createTask(req.body);
    sendSuccess(res, 201, "Task created successfully", task);
  });

  getById = catchAsync(async (req: Request, res: Response) => {
    const task = await service.getTaskById(req.params.id as string);
    sendSuccess(res, 200, "Task fetched successfully", task);
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const task = await service.updateTask(req.params.id as string, req.body);
    sendSuccess(res, 200, "Task updated successfully", task);
  });

  delete = catchAsync(async (req: Request, res: Response) => {
    const result = await service.deleteTask(req.params.id as string);
    sendSuccess(res, 200, result.message);
  });

  list = catchAsync(async (req: Request, res: Response) => {
    const { limit = 10, cursor } = req.query;
    const result = await service.getTasksPaginated(
      Number(limit),
      cursor as string | undefined
    );
    sendSuccess(res, 200, "Tasks fetched successfully", result);
  });
}
