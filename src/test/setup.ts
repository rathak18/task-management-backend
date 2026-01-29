import { prisma } from "../config/prisma";

beforeAll(async () => {
  await prisma.task.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
