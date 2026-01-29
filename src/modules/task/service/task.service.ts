import { TaskRepository } from "../repository/task.repository";
import { CreateTaskDTO } from "../types/task.types";
import { AppError } from "../../../common/errors/AppError";
import { ERROR_MESSAGES } from "../../../common/constants/errorMessages";
import { TaskSyncHelper } from "../../../common/helpers/task.sync";

export class TaskService {
  private repo = new TaskRepository();
  private sync = new TaskSyncHelper();

  /**
   * Create a new task
   */
  async createTask(data: CreateTaskDTO) {
    if (!data.title || data.title.trim() === "") {
      throw new AppError(ERROR_MESSAGES.TASK_TITLE_REQUIRED, 400);
    }

    try {
      const task = await this.repo.create({
        ...data,
        syncStatus: "PENDING"
      });

      // 🔁 async external sync
      this.sync.syncCreate(task.id);

      return task;
    } catch {
      throw new AppError(ERROR_MESSAGES.TASK_CREATE_FAILED, 500);
    }
  }

  /**
   * Get single task by ID
   */
  async getTaskById(id: string) {
    const task = await this.repo.findById(id);

    if (!task) {
      throw new AppError(ERROR_MESSAGES.TASK_NOT_FOUND, 404);
    }

    return task;
  }

  /**
   * Update task by ID
   */
  async updateTask(id: string, data: Partial<CreateTaskDTO>) {
    const existingTask = await this.repo.findById(id);

    if (!existingTask) {
      throw new AppError(ERROR_MESSAGES.TASK_NOT_FOUND, 404);
    }

    try {
      const updated = await this.repo.updateById(id, {
        ...data,
        syncStatus: "PENDING"
      });

      this.sync.syncUpdate(id);

      return updated;
    } catch {
      throw new AppError(ERROR_MESSAGES.TASK_UPDATE_FAILED, 500);
    }
  }

  /**
   * Delete task by ID
   */
  async deleteTask(id: string) {
    const existingTask = await this.repo.findById(id);

    if (!existingTask) {
      throw new AppError(ERROR_MESSAGES.TASK_NOT_FOUND, 404);
    }

    try {
      await this.repo.deleteById(id);

      this.sync.syncDelete(existingTask.externalId ?? undefined);

      return { message: ERROR_MESSAGES.TASK_DELETED };
    } catch {
      throw new AppError(ERROR_MESSAGES.TASK_DELETE_FAILED, 500);
    }
  }

  /**
   * Cursor-based pagination
   */
  async getTasksPaginated(limit: number, cursor?: string) {
    if (!Number.isInteger(limit) || limit <= 0 || limit > 100) {
      throw new AppError(ERROR_MESSAGES.INVALID_LIMIT, 400);
    }

    const tasks = await this.repo.findPaginated(limit, cursor);

    let nextCursor: string | null = null;
    if (tasks.length > limit) {
      nextCursor = tasks.pop()!.id;
    }

    return {
      data: tasks,
      nextCursor
    };
  }
}
