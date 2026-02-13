import type {
  User, AuthResponse, LoginRequest, SignupRequest,
  TaskList, TaskItem,
  CreateTaskItemRequest, UpdateTaskItemRequest,
  CreateTaskListRequest, UpdateTaskListRequest,
} from "@/types/api";

const MOCK_USER: User = {
  id: 1,
  name: "João Silva",
  email: "joao@email.com",
  isEmailConfirmed: true,
};

const MOCK_PASSWORD = "123456";

let taskLists: TaskList[] = [
  { id: 1, name: "Trabalho", userId: 1 },
  { id: 2, name: "Pessoal", userId: 1 },
  { id: 3, name: "Estudos", userId: 1 },
];

let taskItems: TaskItem[] = [
  { id: 1, description: "Revisar pull request", status: 0, taskListId: 1 },
  { id: 2, description: "Reunião com o time", status: 1, taskListId: 1 },
  { id: 3, description: "Deploy da v2.0", status: 0, taskListId: 1 },
  { id: 4, description: "Comprar frutas", status: 0, taskListId: 2 },
  { id: 5, description: "Agendar dentista", status: 1, taskListId: 2 },
  { id: 6, description: "Estudar TypeScript", status: 0, taskListId: 3 },
  { id: 7, description: "Ler documentação do React", status: 0, taskListId: 3 },
  { id: 8, description: "Praticar algoritmos", status: 1, taskListId: 3 },
];

let nextTaskListId = 4;
let nextTaskItemId = 9;

// Auth
export const authApi = {
  login(data: LoginRequest): AuthResponse {
    if (data.email === MOCK_USER.email && data.password === MOCK_PASSWORD) {
      return { token: "mock-jwt-token-abc123", user: MOCK_USER };
    }
    throw new Error("Credenciais inválidas");
  },

  signup(data: SignupRequest): AuthResponse {
    if (data.password !== data.confirmPassword) {
      throw new Error("Senhas não coincidem");
    }
    return { token: "mock-jwt-token-abc123", user: { ...MOCK_USER, isEmailConfirmed: false } };
  },

  confirmEmail(token: string): void {
    if (!token || token.trim() === "") {
      throw new Error("Código inválido");
    }
    // Mock: any non-empty token is accepted
  },

  resendConfirmation(email: string): void {
    if (!email || email.trim() === "") {
      throw new Error("Email inválido");
    }
    // Mock: always succeeds
  },
};

// TaskList
export const taskListApi = {
  getAll(): TaskList[] {
    return [...taskLists];
  },

  getById(id: number): TaskList | undefined {
    return taskLists.find((tl) => tl.id === id);
  },

  create(data: CreateTaskListRequest): TaskList {
    const newList: TaskList = { id: nextTaskListId++, ...data };
    taskLists.push(newList);
    return newList;
  },

  update(id: number, data: UpdateTaskListRequest): void {
    taskLists = taskLists.map((tl) => (tl.id === id ? { ...tl, ...data } : tl));
  },

  delete(id: number): void {
    taskLists = taskLists.filter((tl) => tl.id !== id);
    taskItems = taskItems.filter((ti) => ti.taskListId !== id);
  },
};

// TaskItem
export const taskItemApi = {
  getAll(): TaskItem[] {
    return [...taskItems];
  },

  getByListId(listId: number): TaskItem[] {
    return taskItems.filter((ti) => ti.taskListId === listId);
  },

  getById(id: number): TaskItem | undefined {
    return taskItems.find((ti) => ti.id === id);
  },

  create(data: CreateTaskItemRequest): TaskItem {
    const newItem: TaskItem = { id: nextTaskItemId++, status: 0, ...data };
    taskItems.push(newItem);
    return newItem;
  },

  update(id: number, data: UpdateTaskItemRequest): void {
    taskItems = taskItems.map((ti) => (ti.id === id ? { ...ti, ...data } : ti));
  },

  delete(id: number): void {
    taskItems = taskItems.filter((ti) => ti.id !== id);
  },
};
