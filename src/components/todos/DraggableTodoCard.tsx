import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit2, Trash2, GripVertical } from "lucide-react";
import { Todo, Priority } from "@/types/todo";
import { format } from "date-fns";

interface DraggableTodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

const priorityConfig: Record<
  Priority,
  { bg: string; text: string; label: string }
> = {
  extreme: {
    bg: "bg-red-50",
    text: "text-red-600",
    label: "Extreme",
  },
  moderate: {
    bg: "bg-green-50",
    text: "text-green-600",
    label: "Moderate",
  },
  low: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    label: "Low",
  },
};

export const DraggableTodoCard: React.FC<DraggableTodoCardProps> = ({
  todo,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityStyle = priorityConfig[todo.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${
        priorityStyle.bg
      } rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all ${
        isDragging ? "z-50 shadow-2xl" : ""
      }`}
    >
      {/* Header: Title and Priority Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-gray-900 text-base leading-tight flex-1">
          {todo.title}
        </h3>

        <div className="flex items-center gap-1">
          {/* Priority Badge */}
          <span
            className={`px-2.5 py-1 rounded text-xs font-medium ${priorityStyle.text} bg-white/80 backdrop-blur-sm`}
          >
            {priorityStyle.label}
          </span>

          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none p-1"
          >
            <GripVertical size={16} />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
        {todo.description}
      </p>

      {/* Footer: Due Date and Actions */}
      <div className="flex items-center justify-between">
        <span className="text-gray-600 text-sm">
          Due {format(new Date(todo.todo_date), "MMM dd, yyyy")}
        </span>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(todo)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit task"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Completion Badge (if completed) */}
      {todo.is_completed && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <span className="inline-flex items-center gap-1 text-green-600 font-medium text-xs">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Completed
          </span>
        </div>
      )}
    </div>
  );
};
