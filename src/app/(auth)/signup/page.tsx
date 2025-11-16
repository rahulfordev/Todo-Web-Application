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
import { SignupData } from "@/types/auth";
import signupIllustration from "../../../../public/images/signup-illustration.svg";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupData & { confirmPassword: string }>();

  const password = watch("password");

  const onSubmit = async (data: SignupData & { confirmPassword: string }) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match", { duration: 4000 });
      return;
    }

    setLoading(true);
    try {
      await authApi.signup({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      });

      toast.success("Account created successfully! Redirecting to login...", {
        duration: 2000,
      });
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      const message =
        error.response?.data?.detail ||
        "Failed to create account. Please try again.";
      toast.error(message, { duration: 4000 });
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
            src={signupIllustration}
            alt="Signup Illustration"
            width={500}
            height={500}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-background-dark">
              Create your account
            </h1>
            <p className="mt-2 text-gray">
              Start managing your tasks efficiently
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                {...register("first_name", {
                  required: "First name is required",
                  pattern: {
                    value: /^[A-Za-z]+$/,
                    message: "Please enter a valid name format.",
                  },
                })}
                error={errors.first_name?.message}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                {...register("last_name", {
                  required: "Last name is required",
                  pattern: {
                    value: /^[A-Za-z]+$/,
                    message: "Please enter a valid name format.",
                  },
                })}
                error={errors.last_name?.message}
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="john.doe@example.com"
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
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "6 characters minimum.",
                },
              })}
              error={errors.password?.message}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              error={errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full"
            >
              Sign Up
            </Button>
          </form>

          <p className="mt-4 text-center text-gray">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary-600 font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
