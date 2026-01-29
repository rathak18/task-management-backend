import { TaskRepository } from "../repository/task.repository";
import { CreateTaskDTO } from "../types/task.types";
import { AppError } from "../../../common/errors/AppError";
import { ERROR_MESSAGES } from "../../../common/constants/errorMessages";

export class TaskService {
  private repo = new TaskRepository();

  /**
   * Create a new task
   */
  async createTask(data: CreateTaskDTO) {
    try {
      return await this.repo.create(data);
    } catch (error) {
      // Database or unexpected failure
      throw new AppError(
        ERROR_MESSAGES.TASK_CREATE_FAILED,
        500
      );
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
      return await this.repo.updateById(id, data);
    } catch (error) {
      throw new AppError(
        ERROR_MESSAGES.TASK_UPDATE_FAILED,
        500
      );
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
      return { message: ERROR_MESSAGES.TASK_DELETED };
    } catch (error) {
      throw new AppError(
        ERROR_MESSAGES.TASK_DELETE_FAILED,
        500
      );
    }
  }

  /**
   * Cursor-based pagination
   */
  async getTasksPaginated(limit: number, cursor?: string) {
    // Guard against invalid input (double safety)
    if (!Number.isInteger(limit) || limit <= 0 || limit > 100) {
      throw new AppError(ERROR_MESSAGES.INVALID_LIMIT, 400);
    }

    try {
      const tasks = await this.repo.findPaginated(limit, cursor);

      let nextCursor: string | null = null;

      // Check if there is a next page
      if (tasks.length > limit) {
        const nextItem = tasks.pop();
        nextCursor = nextItem!.id;
      }

      return {
        data: tasks,
        nextCursor
      };
    } catch (error) {
      throw new AppError(
        ERROR_MESSAGES.TASK_FETCH_FAILED,
        500
      );
    }
  }
}
