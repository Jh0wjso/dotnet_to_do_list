import { API_ENDPOINTS } from "@/hooks/useAPIEndpoints.api";
import type {
  TaskList,
  TaskItem,
  CreateTaskItemRequest,
  UpdateTaskItemRequest,
} from "@/types/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("todo_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const taskItemApi = {
  async getAll(): Promise<TaskItem[]> {
    const response = await fetch(API_ENDPOINTS.TASK_ITEM.GET_ALL, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch task items");
    return response.json();
  },

  async getById(id: number): Promise<TaskItem> {
    const response = await fetch(API_ENDPOINTS.TASK_ITEM.GET_BY_ID(id), {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch task item");
    return response.json();
  },

  async create(data: CreateTaskItemRequest): Promise<TaskItem> {
    const response = await fetch(API_ENDPOINTS.TASK_ITEM.CREATE, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create task item");
    return response.json();
  },

  async update(id: number, data: UpdateTaskItemRequest): Promise<void> {
    const response = await fetch(API_ENDPOINTS.TASK_ITEM.UPDATE(id), {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update task item");
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(API_ENDPOINTS.TASK_ITEM.DELETE(id), {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete task item");
  },
};
