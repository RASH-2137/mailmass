"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export function GoogleLoginButton() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      setError("");
      // Send ID token to our backend
      const response = await api.post("/google-login", {
        credential: credentialResponse.credential,
      });

      // Handle standard MailMass JWT
      localStorage.setItem("access_token", response.data.access_token);
      document.cookie = `access_token=${response.data.access_token}; path=/; max-age=86400; SameSite=Lax`;
      
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Google login backend error:", err);
      setError(err.response?.data?.detail || "Failed to authenticate with Google.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {error && (
        <div className="mb-4 w-full rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20 text-center">
          {error}
        </div>
      )}
      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            console.error("Google Login Failed");
            setError("Google login failed. Please try again.");
          }}
          useOneTap={false}
          theme="outline"
          shape="rectangular"
          width="100%"
          text="continue_with"
        />
      </div>
    </div>
  );
}
