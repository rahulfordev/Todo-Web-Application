"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/lib/api/auth";
import { User } from "@/types/auth";
import { Camera, Upload, Calendar } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    contact_number: "",
    birthday: "",
    bio: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = await authApi.getProfile();
      setUser(userData);
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        address: userData.address || "",
        contact_number: userData.contact_number || "",
        birthday: userData.birthday || "",
        bio: userData.bio || "",
      });
      if (userData.profile_image) {
        setPreviewUrl(userData.profile_image);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authApi.updateProfile(formData, profileImage || undefined);
      toast.success("Profile updated successfully!");
      fetchProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        address: user.address || "",
        contact_number: user.contact_number || "",
        birthday: user.birthday || "",
        bio: user.bio || "",
      });
      setPreviewUrl(user.profile_image || "");
      setProfileImage(null);
    }
  };

  return (
    <div className="mx-auto">
      <div className="bg-white rounded-2xl p-6">
        <h3 className="text-2xl font-semibold text-background-dark border-b-2 border-primary pb-1 inline-block mb-8">
          Account Information
        </h3>

        {/* Profile Image Upload */}
        <div className="flex items-center gap-6 mb-8 border border-[#A1A3ABA1] rounded-2xl px-6 py-4 w-fit">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden ring-4 ring-gray-100">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                  <Camera size={32} />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2.5 bg-primary text-white rounded-full hover:bg-primary-600 transition-colors shadow-lg"
            >
              <Camera size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
          <div>
            <Button
              type="button"
              variant="primary"
              onClick={() => fileInputRef.current?.click()}
              icon={<Upload size={18} />}
              className="mb-2"
            >
              Upload New Photo
            </Button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-2 border border-[#A1A3ABA1] rounded-2xl py-4 px-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="John"
            />
            <Input
              label="Last Name"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Doe"
            />
          </div>

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="bg-gray-50 cursor-not-allowed"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="123 Main St, City"
            />
            <Input
              label="Contact Number"
              type="tel"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleInputChange}
              placeholder="+1234567890"
            />
          </div>

          <div className="relative">
            <Input
              label="Birthday"
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-border text-blue-light focus:outline-none focus:ring-1 focus:ring-blue-light focus:border-transparent
              transition-all duration-200 resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-6">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              size="lg"
              className="px-10 text-sm"
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              size="lg"
              className="px-10 text-sm"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
