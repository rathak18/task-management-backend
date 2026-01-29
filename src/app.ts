import express from "express";
// import { errorHandler } from "../common/middleware/error.middleware";
// import taskRoutes from "../modules/task/controller/task.routes";

const app = express();

app.use(express.json());
// app.use("/tasks", taskRoutes);
// app.use(errorHandler);

export default app;
