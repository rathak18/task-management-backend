import { TodoistClient } from "../../common/helpers/todoist.client";
import { TaskRepository } from "../../modules/task/repository/task.repository";

const todoist = new TodoistClient(process.env.TODOIST_API_TOKEN!);

export class TaskSyncHelper {
  private repo = new TaskRepository();

  async syncCreate(taskId: string) {
    const task = await this.repo.findById(taskId);
    if (!task) return;

    try {
      const external = await todoist.createTask(
        task.title,
        task.description ?? undefined
      );

      await this.repo.updateById(taskId, {
        externalId: external.id,
        syncStatus: "SYNCED"
      });
    } catch {
      await this.repo.updateById(taskId, {
        syncStatus: "FAILED"
      });
    }
  }

  async syncUpdate(taskId: string) {
    const task = await this.repo.findById(taskId);
    if (!task || !task.externalId) return;

    try {
      await todoist.updateTask(task.externalId, {
        title: task.title,
        completed: task.completed
      });

      await this.repo.updateById(taskId, {
        syncStatus: "SYNCED"
      });
    } catch {
      await this.repo.updateById(taskId, {
        syncStatus: "FAILED"
      });
    }
  }

  async syncDelete(externalId?: string) {
    if (!externalId) return;
    try {
      await todoist.deleteTask(externalId);
    } catch {
      // best-effort delete
    }
  }
}
