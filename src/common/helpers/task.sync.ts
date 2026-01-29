import { prisma } from "../../config/prisma";
import { TodoistClient } from "./todoist.client";

const client = new TodoistClient(process.env.TODOIST_TOKEN!);

export async function syncTaskToTodoist(taskId: string) {
  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return;

    const response = await client.createTask(task.title, task.description);

    await prisma.task.update({
      where: { id: taskId },
      data: {
        todoistId: response.data.id,
        syncStatus: "SYNCED"
      }
    });

  } catch (error) {
    await prisma.task.update({
      where: { id: taskId },
      data: { syncStatus: "FAILED" }
    });
  }
}
