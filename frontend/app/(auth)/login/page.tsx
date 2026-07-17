"use client";

import { useState } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthFooter } from "@/components/auth/auth-footer";

import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      document.cookie = `access_token=${response.data.access_token}; path=/; max-age=86400; SameSite=Lax`;

      router.push("/dashboard");

    } 
    catch (error: unknown) {
        console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
      <AuthCard>

        <AuthHeader />

        <div className="mt-8 space-y-5">

          <AuthInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <AuthInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            type="button"
            className="h-11 w-full rounded-md bg-red-600 text-white"
          >
            login
          </button>

          <AuthFooter />

        </div>

      </AuthCard>
    </div>
  );
}