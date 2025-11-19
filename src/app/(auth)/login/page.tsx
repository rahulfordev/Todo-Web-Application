"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/lib/api/auth";
import { LoginData } from "@/types/auth";
import loginIllustration from "../../../../public/images/login-illustration.svg";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    try {
      await authApi.login(data);

      toast.success("Login successful! Redirecting...");
      setTimeout(() => router.push("/todos"), 1500);
    } catch (error: any) {
      const message =
        error.response?.data?.detail ||
        "Invalid email or password. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#E2ECF8] items-center justify-center p-12">
        <div className="max-w-md w-full">
          <Image
            src={loginIllustration}
            alt="Login Illustration"
            width={500}
            height={500}
            priority
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-background-dark">
              Log in to your account
            </h1>
            <p className="mt-2 text-gray">
              Start managing your tasks efficiently
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
              error={errors.password?.message}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-light focus:ring-blue-light"
                />
                <span className="text-sm text-gray-dark">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary font-medium"
              >
                Forgot your password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full"
            >
              Log In
            </Button>
          </form>

          <p className="mt-4 text-center text-gray">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-primary hover:text-primary-600 font-medium"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
