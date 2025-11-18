export type Priority = "extreme" | "moderate" | "low";

export interface Todo {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  is_completed: boolean;
  position: number;
  todo_date: string;
  created_at: string;
  updated_at: string;
}

export interface TodosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Todo[];
}

export interface CreateTodoData {
  title: string;
  description: string;
  priority: Priority;
  todo_date: string;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  priority?: Priority;
  todo_date?: string;
  is_completed?: boolean;
  position?: number;
}

export interface TodoFilters {
  is_completed?: boolean;
  priority?: Priority;
  todo_date?: string;
  search?: string;
}
