import { apiClient } from '@/services/api';

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
  // Mengambil daftar todo asli milik user dari backend Express
  async getTodos(): Promise<BackendTodo[]> {
    const res = await apiClient<TodosResponse>('/todos?perPage=50');
    return res.data || [];
  },

  // Mengambil detail todo berdasarkan ID
  async getTodoById(id: number | string): Promise<BackendTodo> {
    const res = await apiClient<SingleTodoResponse>(`/todos/${id}`);
    return res.data;
  },

  // Menambahkan todo baru ke database MySQL
  async createTodo(payload: string): Promise<BackendTodo> {
    const res = await apiClient<SingleTodoResponse>('/todos', {
      method: 'POST',
      body: JSON.stringify({ task: payload }),
    });
    return res.data;
  },

  // Memperbarui status / task di database MySQL
  async updateTodo(
    id: number | string,
    payload: { task?: string; is_completed?: boolean }
  ): Promise<void> {
    await apiClient(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // Menghapus todo dari database MySQL
  async deleteTodo(id: number | string): Promise<void> {
    await apiClient(`/todos/${id}`, {
      method: 'DELETE',
    });
  },
};