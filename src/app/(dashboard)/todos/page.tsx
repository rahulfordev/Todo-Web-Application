"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableTodoCard } from "@/components/todos/DraggableTodoCard";
import { AddTodoModal } from "@/components/todos/AddTodoModal";
import { FilterDropdown } from "@/components/todos/FilterDropdown";
import { Button } from "@/components/ui/Button";
import { todosApi } from "@/lib/api/todos";
import { Todo, CreateTodoData, TodoFilters } from "@/types/todo";
import { Plus, Search, ArrowUpDown } from "lucide-react";
import Image from "next/image";
import emptyTodo from "../../../../public/images/icon-no-projects.svg";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/Input";

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filters, setFilters] = useState<TodoFilters>({});

  // Setup sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTodos();
  }, [filters]);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await todosApi.getTodos(filters);
      const sortedTodos = response.results.sort(
        (a, b) => a.position - b.position
      );
      setTodos(sortedTodos);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      toast.error("Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setFilters({ ...filters, search: searchQuery.trim() });
    } else {
      // Remove search filter if query is empty
      const { search, ...restFilters } = filters;
      setFilters(restFilters);
    }
  };

  // Handle Enter key for search
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleAddTodo = async (data: CreateTodoData) => {
    setLoading(true);
    try {
      if (editingTodo) {
        await todosApi.updateTodo(editingTodo.id, data);
        toast.success("Task updated successfully!");
      } else {
        await todosApi.createTodo(data);
        toast.success("Task created successfully!");
      }
      setModalOpen(false);
      setEditingTodo(null);
      fetchTodos();
    } catch (error: any) {
      const message = error.response?.data?.detail || "Failed to save task";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await todosApi.deleteTodo(id);
      toast.success("Task deleted successfully!");
      fetchTodos();
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setModalOpen(true);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = todos.findIndex((todo) => todo.id === active.id);
    const newIndex = todos.findIndex((todo) => todo.id === over.id);

    const newTodos = arrayMove(todos, oldIndex, newIndex);
    setTodos(newTodos);

    try {
      const movedTodo = newTodos[newIndex];
      await todosApi.updateTodo(movedTodo.id, { position: newIndex + 1 });

      const updatePromises = newTodos.map((todo, index) => {
        if (todo.position !== index + 1) {
          return todosApi.updateTodo(todo.id, { position: index + 1 });
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);
      toast.success("Task reordered successfully!");
    } catch (error) {
      console.error("Failed to update positions:", error);
      toast.error("Failed to reorder tasks");
      fetchTodos();
    }
  };

  const handleFilterChange = (filterValue: string) => {
    const today = new Date();

    // Toggle filter selection
    const newSelectedFilters = selectedFilters.includes(filterValue)
      ? selectedFilters.filter((f) => f !== filterValue)
      : [filterValue]; // Only one filter at a time

    setSelectedFilters(newSelectedFilters);

    // Apply filter based on selection
    if (newSelectedFilters.length === 0) {
      // Remove date filter but keep other filters
      const { todo_date, ...restFilters } = filters;
      setFilters(restFilters);
    } else {
      const selectedFilter = newSelectedFilters[0];
      let newFilters = { ...filters };

      switch (selectedFilter) {
        case "today":
          newFilters.todo_date = today.toISOString().split("T")[0];
          break;
        case "5days":
          const fiveDaysLater = new Date(today);
          fiveDaysLater.setDate(today.getDate() + 5);
          newFilters.todo_date = fiveDaysLater.toISOString().split("T")[0];
          break;
        case "10days":
          const tenDaysLater = new Date(today);
          tenDaysLater.setDate(today.getDate() + 10);
          newFilters.todo_date = tenDaysLater.toISOString().split("T")[0];
          break;
        case "30days":
          const thirtyDaysLater = new Date(today);
          thirtyDaysLater.setDate(today.getDate() + 30);
          newFilters.todo_date = thirtyDaysLater.toISOString().split("T")[0];
          break;
        default:
          // Remove date filter
          const { todo_date, ...restFilters } = newFilters;
          newFilters = restFilters;
      }

      setFilters(newFilters);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedFilters([]);
    setSearchQuery("");
    setFilters({});
  };

  return (
    <>
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-semibold text-background-dark border-b-2 border-primary pb-1">
            Todos
          </h3>

          <Button
            onClick={() => {
              setEditingTodo(null);
              setModalOpen(true);
            }}
            variant="primary"
            icon={<Plus size={20} />}
            className="font-normal"
          >
            New Task
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-4 relative">
            <div className="flex-1 relative">
              <Input
                placeholder="Search your task here.."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white !py-2.5"
              />
              <button
                onClick={handleSearch}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 cursor-pointer border border-border bg-white rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-700">
                  {selectedFilters.length > 0
                    ? `Filtered (${selectedFilters.length})`
                    : "Filter By"}
                </span>
                <ArrowUpDown size={14} className="text-gray-600" />
              </button>

              {/* Filter Dropdown */}
              <FilterDropdown
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                onFilterChange={handleFilterChange}
                selectedFilters={selectedFilters}
              />
            </div>
          </div>
        </div>

        {/* Todos List with Drag & Drop */}
        {loading && todos.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl border border-border">
            <Image src={emptyTodo} alt="Empty Todo" />
            <h3 className="text-2xl font-normal text-[#201F1E]">
              {filters.search || selectedFilters.length > 0
                ? "No matching todos found"
                : "No todos yet"}
            </h3>
            {(filters.search || selectedFilters.length > 0) && (
              <button
                onClick={handleClearFilters}
                className="mt-4 text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Tasks
              {todos.length > 0 && (
                <span className="ml-2 text-sm text-gray-500 font-normal">
                  ({todos.length} {todos.length === 1 ? "task" : "tasks"})
                </span>
              )}
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={todos.map((todo) => todo.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {todos.map((todo) => (
                    <DraggableTodoCard
                      key={todo.id}
                      todo={todo}
                      onEdit={handleEditTodo}
                      onDelete={handleDeleteTodo}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AddTodoModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={handleAddTodo}
        editingTodo={editingTodo}
        loading={loading}
      />
    </>
  );
}
