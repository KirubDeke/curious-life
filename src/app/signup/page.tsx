"use client";

import { useState, FormEvent, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import ClientLayout from "../../../components/ClientLayout";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "gray",
  });
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check password strength whenever password changes
    if (formData.password) {
      checkPasswordStrength(formData.password);
    } else {
      setPasswordStrength({
        score: 0,
        message: "",
        color: "gray",
      });
    }
  }, [formData.password]);

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let message = "";
    let color = "gray";

    // Minimum length requirement
    if (password.length < 6) {
      message = "Password must be at least 6 characters";
      color = "red";
    } else {
      score += 1;

      // Check for uppercase letters
      if (/[A-Z]/.test(password)) score += 1;
      // Check for numbers
      if (/\d/.test(password)) score += 1;
      // Check for special characters
      if (/[^A-Za-z0-9]/.test(password)) score += 1;
      // Check length
      if (password.length >= 8) score += 1;

      // Determine message based on score
      if (score <= 2) {
        message = "Weak";
        color = "red";
      } else if (score <= 3) {
        message = "Medium";
        color = "orange";
      } else {
        message = "Strong";
        color = "green";
      }
    }

    setPasswordStrength({
      score,
      message,
      color,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      return toast.error("❌ Password must be at least 6 characters");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("❌ Passwords do not match");
    }

    const loadingToast = toast.loading("Creating your account...");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/curious-life/signup`,
        {
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );

      if (response.status === 400) {
        const errorMessage = "Email already exists";
        toast.error(`Signup failed: ${errorMessage}`, { id: loadingToast });
        return;
      }

      if (response.status !== 201) {
        const errorMessage =
          response.data?.message || "Something went wrong during signup";
        toast.error(`Signup failed: ${errorMessage}`, { id: loadingToast });
        return;
      }

      toast.success("Signup successful!", { id: loadingToast });
      await login(formData.email, formData.password);
      router.push("/");

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err: unknown) {
      toast.error("Signup failed: Network error", { id: loadingToast });
      console.error(
        "Unexpected error:",
        err instanceof Error ? err.message : err
      );
    }
  };

  return (
    <ClientLayout>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Create an account
            </h1>
            <p className="text-gray-600 mt-2">
              Enter your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password (min 6 characters)
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                {formData.password && (
                  <div className="mt-1 flex items-center">
                    <span className="text-xs">Strength: </span>
                    <span
                      className={`ml-1 text-xs font-medium text-${passwordStrength.color}-500`}
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.message}
                    </span>
                    <div className="ml-2 flex-1 flex space-x-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full ${
                            i <= passwordStrength.score
                              ? passwordStrength.color === "red"
                                ? "bg-red-500"
                                : passwordStrength.color === "orange"
                                ? "bg-orange-500"
                                : "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                {formData.password && formData.confirmPassword && (
                  <p
                    className={`mt-1 text-xs ${
                      formData.password === formData.confirmPassword
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {formData.password === formData.confirmPassword
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={
                    passwordStrength.score === 0 ||
                    formData.password !== formData.confirmPassword
                  }
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
