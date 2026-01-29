import request from "supertest";
import app from "../../app";
import { prisma } from "../../config/prisma";

describe("Task API", () => {
  let taskId: string;

  beforeAll(async () => {
    await prisma.task.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a task", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({
        title: "Test Task",
        description: "Testing create",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Test Task");

    taskId = res.body.data.id;
  });

it("should fail validation when title missing", async () => {
  const res = await request(app).post("/tasks").send({});
  expect(res.status).toBe(400);
  expect(res.body.success).toBe(false);
});

  it("should get task by id", async () => {
    const res = await request(app).get(`/tasks/${taskId}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(taskId);
  });

  it("should return 404 for non-existing task", async () => {
    const res = await request(app).get("/tasks/invalid-id");

    expect(res.status).toBe(404);
  });

  it("should update task", async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .send({ completed: true });

    expect(res.status).toBe(200);
    expect(res.body.data.completed).toBe(true);
  });

  it("should paginate tasks", async () => {
    const res = await request(app).get("/tasks?limit=5");

    expect(res.status).toBe(200);
  });

  it("should delete task", async () => {
    const res = await request(app).delete(`/tasks/${taskId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
