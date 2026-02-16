export const API_LINK = import.meta.env.VITE_API_LINK;

export const API_ENDPOINTS = {
  TASK_ITEM: {
    GET_ALL: `${API_LINK}/api/TaskItem`,
    CREATE: `${API_LINK}/api/TaskItem`,
    GET_BY_ID: (id: number) => `${API_LINK}/api/TaskItem/${id}`,
    UPDATE: (id: number) => `${API_LINK}/api/TaskItem/${id}`,
    DELETE: (id: number) => `${API_LINK}/api/TaskItem/${id}`,
  },
  TASK_LIST: {
    GET_ALL: `${API_LINK}/api/TaskList`,
    CREATE: `${API_LINK}/api/TaskList`,
    GET_BY_ID: (id: number) => `${API_LINK}/api/TaskList/${id}`,
    UPDATE: (id: number) => `${API_LINK}/api/TaskList/${id}`,
    DELETE: (id: number) => `${API_LINK}/api/TaskList/${id}`,
  },
};
