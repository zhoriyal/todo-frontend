import { todoService, FetchTodosParams } from '@/services/todoService';
import { ApiTodo, TaskItem } from '@/types/api-todo';

export function formatApiTodoToTask(raw: ApiTodo): TaskItem {
  return {
    id: raw.id,
    title: raw.todo,
    completed: raw.completed,
    userId: raw.userId,
    source: 'dummyjson-api',
  };
}

const FALLBACK_TASKS: TaskItem[] = [
  { id: 1, title: 'Do something nice for someone you care about', completed: false, userId: 152, source: 'dummyjson-api' },
  { id: 2, title: 'Memorize a poem', completed: true, userId: 13, source: 'dummyjson-api' },
  { id: 3, title: 'Watch a classic movie', completed: true, userId: 68, source: 'dummyjson-api' },
  { id: 4, title: 'Watch a documentary', completed: false, userId: 84, source: 'dummyjson-api' },
  { id: 5, title: 'Invest in cryptocurrency', completed: false, userId: 163, source: 'dummyjson-api' },
  { id: 6, title: 'Contribute code or a monetary donation to an open-source software project', completed: false, userId: 69, source: 'dummyjson-api' },
];

export async function getTasks(params?: FetchTodosParams) {
  try {
    const response = await todoService.fetchTodos(params);
    return {
      tasks: response.todos.map(formatApiTodoToTask),
      total: response.total,
      limit: response.limit,
      skip: response.skip,
    };
  } catch (error) {
    console.warn('[lib/tasks.ts] Menggunakan data cadangan karena koneksi API gagal:', error);
    return {
      tasks: FALLBACK_TASKS,
      total: FALLBACK_TASKS.length,
      limit: params?.limit || 10,
      skip: params?.skip || 0,
    };
  }
}

export async function getTaskById(id: number | string): Promise<TaskItem | null> {
  const numericId = Number(id);
  try {
    const raw = await todoService.fetchTodoById(id);
    return formatApiTodoToTask(raw);
  } catch (error) {
    console.warn(`[lib/tasks.ts] Fetch task ID ${id} dari API gagal, mencari di fallback data...`, error);
    const found = FALLBACK_TASKS.find((t) => t.id === numericId);
    return found || null;
  }
}