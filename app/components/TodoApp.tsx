'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { Button } from '@/app/components/ui/button';
import { authService } from '@/services/authService';
import { todoService } from '@/services/todoService';
import { ApiError } from '@/services/api';
import { Todo } from '@/types/api-todo';

export default function TodoApp() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>(''); // State untuk menampung nama user

  // Auth Guard & Pemuatan Data Awal saat halaman dibuka
  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    // Ambil data user di client-side untuk mencegah Hydration Error
    const user = authService.getUser();
    if (user?.username) {
      setUsername(user.username);
    }

    const loadTodos = async () => {
      try {
        setLoading(true);
        const data = await todoService.getTodos();
        const formatted: Todo[] = data.map((item) => ({
          id: item.id,
          title: item.todo,
          completed: Boolean(item.completed),
          createdAt: new Date().toISOString().split('T')[0],
        }));
        setTodos(formatted);
      } catch (err) {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          authService.logout();
          router.replace('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, [router]);

  // Handler Tambah Tugas Baru (Create - POST /api/todos)
  const handleAddTodo = async (title: string) => {
    try {
      const created = await todoService.createTodo(title);
      const newTodo: Todo = {
        id: created.id,
        title: created.todo,
        completed: Boolean(created.completed),
        createdAt: new Date().toISOString().split('T')[0],
      };
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan';
      alert(`Gagal menambah tugas: ${message}`);
    }
  };

  // Handler Checklist / Toggle Status Completed (Update - PUT /api/todos/:id)
  const handleToggleTodo = async (id: number) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    const nextCompleted = !target.completed;
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t))
    );

    try {
      await todoService.updateTodo(id, { is_completed: nextCompleted });
    } catch (err) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: target.completed } : t))
      );
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan';
      alert(`Gagal memperbarui status tugas: ${message}`);
    }
  };

  // Handler Hapus Tugas (Delete - DELETE /api/todos/:id)
  const handleDeleteTodo = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tugas ini?')) return;

    const prevTodos = [...todos];
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      await todoService.deleteTodo(id);
    } catch (err) {
      setTodos(prevTodos);
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan';
      alert(`Gagal menghapus tugas: ${message}`);
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.replace('/login');
  };

  return (
    <div className="space-y-6">
      {/* Banner Sapaan User */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center md:text-left">
        <span className="text-sm font-medium text-gray-700">
          Selamat datang, <strong className="text-blue-600">{username || 'User'}</strong>!
        </span>
      </div>

      {/* Form Input Tugas */}
      <TodoForm onAddTodo={handleAddTodo} />

      {/* Daftar Tugas */}
      {loading ? (
        <div className="text-center py-8 text-gray-400 text-sm">Memuat data tugas...</div>
      ) : (
        <TodoList
          todos={todos}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
        />
      )}

      {/* Tombol Logout Merah di Bagian Bawah */}
      <div className="pt-4 border-t border-gray-100 flex justify-center">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200 shadow-xs"
        >
          Logout
        </button>
      </div>
    </div>
  );
}