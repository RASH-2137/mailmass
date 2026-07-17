import api from "@/lib/api";

export type Profile = {
  id: number;
  name: string;
  email: string;
};

export async function getProfile(): Promise<Profile> {
  const response = await api.get("/profile");
  return response.data;
}
