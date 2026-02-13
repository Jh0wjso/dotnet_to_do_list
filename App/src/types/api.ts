export interface User {
  id: number;
  name: string;
  email: string;
  isEmailConfirmed: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface TaskList {
  id: number;
  name: string;
  userId: number;
}

export interface TaskItem {
  id: number;
  description: string;
  status: number; // 0 = pending, 1 = completed
  taskListId: number;
}

export interface CreateTaskItemRequest {
  description: string;
  taskListId: number;
}

export interface UpdateTaskItemRequest {
  description: string;
  status: number;
}

export interface CreateTaskListRequest {
  name: string;
  userId: number;
}

export interface UpdateTaskListRequest {
  name: string;
}
