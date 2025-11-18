"use client";
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import logo from "../../../public/images/logo.svg";
import notification from "../../../public/images/notification.svg";
import calendar from "../../../public/images/calendar.svg";
import Image from "next/image";
import { Menu, X } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background-light">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 lg:hidden 
           bg-background-dark/10 backdrop-blur-sm transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:ml-72 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? (
                  <X size={26} className="text-background-dark" />
                ) : (
                  <Menu size={26} className="text-background-dark" />
                )}
              </button>

              <div className="flex-shrink-0">
                <Image src={logo} alt="Logo" className="h-8 w-auto" priority />
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
              <button
                className="flex items-center justify-center cursor-pointer size-8 sm:size-9 lg:size-[34px] rounded-lg bg-primary text-white hover:bg-primary-600 transition-colors"
                aria-label="Notifications"
              >
                <Image
                  src={notification}
                  alt="Notification"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </button>

              <button
                className="flex items-center justify-center cursor-pointer size-8 sm:size-9 lg:size-[34px] rounded-lg bg-primary text-white hover:bg-primary-600 transition-colors"
                aria-label="Calendar"
              >
                <Image
                  src={calendar}
                  alt="Calendar"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </button>

              <div className="hidden sm:block text-left">
                <div className="text-sm lg:text-[15px] font-medium text-background-dark leading-tight">
                  {currentDate.split(",")[0]}
                </div>
                <div className="text-xs lg:text-sm text-background-dark opacity-80">
                  {currentDate.split(",").slice(1).join(",")}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};
