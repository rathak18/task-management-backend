export interface CreateTaskDTO {
  title: string;
  description?: string;
}
export interface Task extends CreateTaskDTO {
  id: string;
}   