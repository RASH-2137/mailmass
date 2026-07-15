import api from "@/lib/api";
import { Template } from "@/types/template";

export async function getTemplates(): Promise<Template[]> {
  const response = await api.get("/templates");
  return response.data;
}

export async function createTemplate(
  name: string,
  subject: string,
  body: string
) {
  const response = await api.post("/templates", {
    name,
    subject,
    body,
  });

  return response.data;
}

export async function updateTemplate(
  templateId: number,
  name: string,
  subject: string,
  body: string
) {
  const response = await api.put(
    `/templates/${templateId}`,
    {
      name,
      subject,
      body,
    }
  );

  return response.data;
}

export async function deleteTemplate(
  templateId: number
) {
  const response = await api.delete(
    `/templates/${templateId}`
  );

  return response.data;
}