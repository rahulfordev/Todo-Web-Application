import { apiClient } from "./client";
import {
  Todo,
  TodosResponse,
  CreateTodoData,
  UpdateTodoData,
  TodoFilters,
} from "@/types/todo";

export const todosApi = { 
  getTodos: async (filters?: TodoFilters & { page?: number }): Promise<TodosResponse> => {
    const params = new URLSearchParams();

    if (filters?.page) {
      params.append("page", String(filters.page));
    }
 
    if (filters?.is_completed !== undefined) {
      params.append("is_completed", String(filters.is_completed));
    }

    if (filters?.priority) {
      params.append("priority", filters.priority);
    }
  
    if (filters?.todo_date) {
      params.append("todo_date", filters.todo_date);
    }

    if (filters?.search && filters.search.trim() !== "") {
      params.append("search", filters.search.trim());
    }

    const queryString = params.toString();
    const url = queryString ? `/api/todos/?${queryString}` : "/api/todos/";

    return apiClient.get<TodosResponse>(url);
  },

  // Create a new todo
  createTodo: async (data: CreateTodoData): Promise<Todo> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("priority", data.priority);
    formData.append("todo_date", data.todo_date);

    return apiClient.postFormData<Todo>("/api/todos/", formData);
  },

  // Update a todo
  updateTodo: async (id: number, data: UpdateTodoData): Promise<Todo> => {
    const formData = new FormData();

    if (data.title !== undefined) formData.append("title", data.title);
    if (data.description !== undefined)
      formData.append("description", data.description);
    if (data.priority !== undefined) formData.append("priority", data.priority);
    if (data.todo_date !== undefined)
      formData.append("todo_date", data.todo_date);
    if (data.is_completed !== undefined)
      formData.append("is_completed", String(data.is_completed));
    if (data.position !== undefined)
      formData.append("position", String(data.position));

    return apiClient.updateFormData<Todo>(`/api/todos/${id}/`, formData);
  },

  // Delete a todo
  deleteTodo: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/api/todos/${id}/`);
  },

  // Toggle todo completion status
  toggleComplete: async (id: number, isCompleted: boolean): Promise<Todo> => {
    const formData = new FormData();
    formData.append("is_completed", String(isCompleted));

    return apiClient.postFormData<Todo>(`/api/todos/${id}/`, formData);
  },
};
