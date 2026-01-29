import axios from "axios";

export class TodoistClient {
  private baseUrl = "https://api.todoist.com/rest/v2";

  constructor(private token: string) {}

  async createTask(title: string, description?: string) {
    return axios.post(
      `${this.baseUrl}/tasks`,
      {
        content: title,
        description
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    );
  }
}
