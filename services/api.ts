const API_BASE_URL = 'https://dummyjson.com';

export class ApiError extends Error {
  status: number;
  statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.status = status;
    this.statusText = statusText;
  }
}

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ...options?.headers,
    },
    cache: 'no-store',
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(
      `Gagal mengambil data dari API (Status: ${response.status} ${response.statusText})`,
      response.status,
      response.statusText
    );
  }

  return response.json();
}