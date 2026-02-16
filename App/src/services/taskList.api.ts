import { API_ENDPOINTS } from "@/hooks/useAPIEndpoints.api";
import type {
  TaskList,
  TaskItem,
  CreateTaskItemRequest,
  UpdateTaskItemRequest,
  CreateTaskListRequest,
  UpdateTaskListRequest,
} from "@/types/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("todo_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const taskListApi = {
  async getAll(): Promise<TaskList[]> {
    const response = await fetch(API_ENDPOINTS.TASK_LIST.GET_ALL, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch task lists");
    return response.json();
  },

  async getById(id: number): Promise<TaskList> {
    const response = await fetch(API_ENDPOINTS.TASK_LIST.GET_BY_ID(id), {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch task list");
    return response.json();
  },

  async create(data: CreateTaskListRequest): Promise<TaskList> {
    const response = await fetch(API_ENDPOINTS.TASK_LIST.CREATE, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create task list");
    return response.json();
  },

  async update(id: number, data: UpdateTaskListRequest): Promise<void> {
    const response = await fetch(API_ENDPOINTS.TASK_LIST.UPDATE(id), {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update task list");
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(API_ENDPOINTS.TASK_LIST.DELETE(id), {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete task list");
  },
};
