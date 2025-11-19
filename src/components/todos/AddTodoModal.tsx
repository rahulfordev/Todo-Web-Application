import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Calendar, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CreateTodoData, Priority, Todo } from "@/types/todo";

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTodoData) => void;
  editingTodo?: Todo | null;
  loading?: boolean;
}

export const AddTodoModal: React.FC<AddTodoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTodo,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateTodoData>();

  useEffect(() => {
    if (editingTodo) {
      setValue("title", editingTodo.title);
      setValue("description", editingTodo.description);
      setValue("priority", editingTodo.priority);
      setValue("todo_date", editingTodo.todo_date);
    } else {
      reset();
    }
  }, [editingTodo, setValue, reset]);

  const handleFormSubmit = (data: CreateTodoData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 bg-opacity-50
           bg-background-dark/10 backdrop-blur-xl transition-all duration-300"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-primary pb-1 inline-block">
            {editingTodo ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-900 font-semibold underline"
          >
            Go Back
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <Input
            label="Title"
            placeholder="Enter task title"
            {...register("title", { required: "Title is required" })}
            error={errors.title?.message}
          />

          <Input
            label="Date"
            type="date"
            icon={<Calendar size={20} />}
            {...register("todo_date", { required: "Date is required" })}
            error={errors.todo_date?.message}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Priority
            </label>
            <div className="flex gap-6">
              {(["extreme", "moderate", "low"] as Priority[]).map(
                (priority) => (
                  <label
                    key={priority}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <div className="relative">
                      <input
                        type="radio"
                        value={priority}
                        {...register("priority", {
                          required: "Priority is required",
                        })}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 rounded border-2 border-gray-300 peer-checked:border-primary peer-checked:bg-primary transition-all"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-medium capitalize ${
                        priority === "extreme"
                          ? "text-red-600"
                          : priority === "moderate"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      ● {priority}
                    </span>
                  </label>
                )
              )}
            </div>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-500">
                {errors.priority.message}
              </p>
            )}
          </div>

          <Input
            as="textarea"
            label="Task Description"
            rows={6}
            placeholder="Start writing here....."
            {...register("description", {
              required: "Description is required",
            })}
            error={errors.description?.message}
          />

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="px-8"
              onClick={handleSubmit(handleFormSubmit)}
            >
              {editingTodo ? "Update" : "Done"}
            </Button>
            <button
              type="button"
              onClick={handleClose}
              className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
