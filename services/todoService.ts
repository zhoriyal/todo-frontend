import { apiClient } from './api';

export interface BackendTodo {
  id: number;
  todo: string;
  completed: boolean;
}

export interface TodosResponse {
  success: boolean;
  message: string;
  data: BackendTodo[];
}

export interface SingleTodoResponse {
  success: boolean;
  message: string;
  data: BackendTodo;
}

export const todoService = {
  // Ambil daftar todo khusus user yang sedang login dari backend Express
  async getTodos(): Promise<BackendTodo[]> {
    const res = await apiClient<TodosResponse>('/todos?perPage=50');
    return res.data || [];
  },

  // Ambil detail todo berdasarkan ID
  async getTodoById(id: number | string): Promise<BackendTodo> {
    const res = await apiClient<SingleTodoResponse>(`/todos/${id}`);
    return res.data;
  },

  // Tambah todo baru ke database MySQL
  async createTodo(payload: string): Promise<BackendTodo> {
    const res = await apiClient<SingleTodoResponse>('/todos', {
      method: 'POST',
      body: JSON.stringify({ task: payload }),
    });
    return res.data;
  },

  // Update status/task di database MySQL
  async updateTodo(
    id: number | string,
    payload: { task?: string; is_completed?: boolean }
  ): Promise<void> {
    await apiClient(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // Hapus todo dari database MySQL
  async deleteTodo(id: number | string): Promise<void> {
    await apiClient(`/todos/${id}`, {
      method: 'DELETE',
    });
  },
};