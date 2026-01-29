import { prisma } from "../../../config/prisma";
import { Prisma } from "@prisma/client";

export class TaskRepository {

  /**
   * Create a new task
   */
  async create(data: Prisma.TaskCreateInput) {
    return prisma.task.create({
      data
    });
  }

  /**
   * Find task by ID
   */
  async findById(id: string) {
    return prisma.task.findUnique({
      where: { id }
    });
  }

  /**
   * Update task by ID
   */
  async updateById(id: string, data: Partial<Prisma.TaskUpdateInput>) {
    return prisma.task.update({
      where: { id },
      data
    });
  }

  /**
   * Delete task by ID
   */
  async deleteById(id: string) {
    return prisma.task.delete({
      where: { id }
    });
  }

  /**
   * Cursor-based pagination
   * Supports limit + cursor (cuid)
   */
  async findPaginated(limit: number, cursor?: string) {
    return prisma.task.findMany({
      take: limit + 1,                 // fetch extra to detect next page
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1                        // skip cursor item itself
      }),
      orderBy: { id: "asc" }           // required for cursor pagination
    });
  }

  /**
   * Bulk create (future-proof for assignment / sync)
   */
  async createMany(tasks: Prisma.TaskCreateInput[]) {
    return prisma.task.createMany({
      data: tasks,
      skipDuplicates: true
    });
  }

  /**
   * Count total tasks (optional, useful for stats)
   */
  async count() {
    return prisma.task.count();
  }
}
