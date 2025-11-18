"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LogOut } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { User as UserType } from "@/types/auth";
import { User } from "../../../public/images/User";
import { Todo } from "../../../public/images/Todo";

export const Sidebar: React.FC = () => {
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
    <div className="h-screen w-80 bg-background-dark text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 flex flex-col items-center">
        <div className="size-[86px] rounded-full bg-white overflow-hidden mb-4 ring-2 ring-white">
          {user?.profile_image ? (
            <img
              src={user.profile_image}
              alt={user.first_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-white text-base font-semibold">
              {user?.first_name?.[0]}
              {user?.last_name?.[0]}
            </div>
          )}
        </div>
        <h3 className="text-white text-base font-semibold">
          {user?.first_name || "User"}
        </h3>
        <p className="text-xs text-white font-normal mt-0.5">
          {user?.email || "user@example.com"}
        </p>
      </div>

      <nav className="flex-1 py-6">
        {menuItems
          .filter((item) => !item.hidden)
          .map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(90deg, rgba(82, 114, 255, 0.25) 1.44%, rgba(13, 34, 74, 0.25) 74.16%)",
                      }
                    : {}
                }
                className={`
                flex items-center gap-4 text-base font-medium px-6 py-4 transition-all duration-200
                ${isActive ? "text-white" : "text-blue-light"}
              `}
              >
                <Icon size={24} color={isActive ? "white" : "#8CA3CD"} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
      </nav>

      <div className="p-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 text-blue-light hover:text-white transition-colors w-full cursor-pointer"
        >
          <LogOut size={24} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
