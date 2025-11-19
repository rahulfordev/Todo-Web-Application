"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LogOut } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { User as UserType } from "@/types/auth";
import { User } from "../../../public/images/User";
import { Todo } from "../../../public/images/Todo";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await authApi.getProfile();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    router.push("/login");
    onClose?.();
  };

  const handleMenuClick = () => {
    if (window.innerWidth < 1024) {
      onClose?.();
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: Home,
      path: "/dashboard",
      hidden: true,
    },
    { name: "Todos", icon: Todo, path: "/todos" },
    { name: "Account Information", icon: User, path: "/profile" },
  ];

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen w-72 bg-background-dark text-white flex flex-col
        transform transition-transform duration-300 ease-in-out z-50
        lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* User Profile Section */}
      <div className="p-6 flex flex-col items-center">
        <div className="size-20 sm:size-[86px] rounded-full bg-white overflow-hidden mb-3 sm:mb-4 ring-2 ring-white">
          {user?.profile_image ? (
            <img
              src={user.profile_image}
              alt={user.first_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-white text-sm sm:text-base font-semibold">
              {user?.first_name?.[0]}
              {user?.last_name?.[0]}
            </div>
          )}
        </div>
        <h3 className="text-white text-sm sm:text-base font-semibold truncate w-full text-center">
          {user?.first_name || "User"}
        </h3>
        <p className="text-xs text-white font-normal mt-0.5 truncate w-full text-center px-2">
          {user?.email || "user@example.com"}
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4 sm:py-6 overflow-y-auto">
        {menuItems
          .filter((item) => !item.hidden)
          .map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={handleMenuClick}
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(90deg, rgba(82, 114, 255, 0.25) 1.44%, rgba(13, 34, 74, 0.25) 74.16%)",
                      }
                    : {}
                }
                className={`
                  flex items-center gap-3 sm:gap-4 text-sm sm:text-base font-medium px-4 sm:px-6 py-3 sm:py-4 transition-all duration-200
                  ${
                    isActive
                      ? "text-white"
                      : "text-blue-light hover:bg-blue-900/20"
                  }
                `}
              >
                <Icon
                  size={20}
                  className="sm:w-6 sm:h-6 flex-shrink-0"
                  color={isActive ? "white" : "#8CA3CD"}
                />
                <span className="font-medium truncate">{item.name}</span>
              </Link>
            );
          })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 sm:p-6 border-t border-blue-900/30">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 sm:gap-4 text-blue-light hover:text-white transition-colors w-full cursor-pointer py-2"
        >
          <LogOut size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
          <span className="font-medium text-sm sm:text-base">Logout</span>
        </button>
      </div>
    </aside>
  );
};
