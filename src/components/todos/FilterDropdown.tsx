"use client";

import React, { useRef, useEffect } from "react";

interface FilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (value: string) => void;
  selectedFilters: string[];
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isOpen,
  onClose,
  onFilterChange,
  selectedFilters,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dateFilters = [
    { label: "Deadline Today", value: "today" },
    { label: "Expires in 5 days", value: "5days" },
    { label: "Expires in 10 days", value: "10days" },
    { label: "Expires in 30 days", value: "30days" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-slide-down"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Date</h3>
      </div>

      {/* Filter Options */}
      <div className="p-3 space-y-2">
        {dateFilters.map((option) => {
          const isChecked = selectedFilters.includes(option.value);

          return (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onFilterChange(option.value)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-1 focus:ring-primary cursor-pointer"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
