import axios, { AxiosInstance } from "axios";

export class TodoistClient {
  private client: AxiosInstance;

  constructor(private token: string) {
    this.client = axios.create({
      baseURL: "https://api.todoist.com/rest/v2",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json"
      }
    });
  }

  async createTask(title: string, description?: string) {
    const res = await this.client.post("/tasks", {
      content: title,
      description
    });
    return res.data; // 👈 return parsed data
  }

  async updateTask(
    externalId: string,
    data: { title?: string; completed?: boolean }
  ) {
    await this.client.post(`/tasks/${externalId}`, {
      content: data.title,
      completed: data.completed
    });
  }

  async deleteTask(externalId: string) {
    await this.client.delete(`/tasks/${externalId}`);
  }
}
