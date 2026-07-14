import api from "@/lib/api";
import {
  ContactsResponse,
} from "@/types/contact";

export async function getContacts(
  search?: string
): Promise<ContactsResponse> {
  const response = await api.get("/contacts", {
    params: search ? { search } : undefined,
  });

  return response.data;
}

export async function createContact(
  name: string,
  email: string
) {
  const response = await api.post("/contacts", {
    name,
    email,
  });

  return response.data;
}

export async function deleteContact(
  contactId: number
) {
  const response = await api.delete(
    `/contacts/${contactId}`
  );

  return response.data;
}

export async function updateContact(
  contactId: number,
  name: string,
  email: string
) {
  const response = await api.put(
    `/contacts/${contactId}`,
    {
      name,
      email,
    }
  );

  return response.data;
}
