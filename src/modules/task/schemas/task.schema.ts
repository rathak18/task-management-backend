import { z } from "zod";

/**
 * Create Task - request body
 */
export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional()
});

/**
 * Update Task - request body
 * All fields optional
 */
export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional()
});

/**
 * Task ID - route params
 * cuid is a string, so validate as non-empty string
 */
export const taskIdParamSchema = z.object({
  id: z.string().min(1, "Task ID is required")
});

/**
 * Pagination - query params
 */
export const paginationQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform(val => (val ? Number(val) : 10))
    .refine(val => val > 0 && val <= 100, {
      message: "Limit must be between 1 and 100"
    }),

  cursor: z.string().optional()
});
