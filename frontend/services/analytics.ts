import api from "@/lib/api";
import { DashboardStats } from "@/types/analytics";

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get("/dashboard");
  return response.data;
}
