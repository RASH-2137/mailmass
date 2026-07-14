import api from "@/lib/api";

export async function getDashboardStats() {
  const response = await api.get("/dashboard");
  return response.data;
}