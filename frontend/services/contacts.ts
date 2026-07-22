import api from "@/lib/api";
import {
  ContactsResponse,
} from "@/types/contact";

export type ContactImportPreview = {
  total_rows: number;
  valid_contacts: number;
  duplicates: number;
  already_exists: number;
  invalid_contacts: number;
  preview: {
    name: string;
    email: string;
  }[];
  import_id: string;
};

export type ContactImportConfirmResult = {
  message: string;
  contacts_imported: number;
};

export async function getContacts(
  search?: string,
  page: number = 1,
  limit: number = 20
): Promise<ContactsResponse> {
  const response = await api.get("/contacts", {
    params: {
      page,
      limit,
      ...(search ? { search } : {}),
    },
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

export async function previewContactsImport(
  file: File
): Promise<ContactImportPreview> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    "/contacts/import/preview",
    formData
  );

  return response.data;
}

export async function confirmContactsImport(
  importId: string
): Promise<ContactImportConfirmResult> {
  const response = await api.post(
    "/contacts/import/confirm",
    {
      import_id: importId,
    }
  );

  return response.data;
}

export async function exportContacts(): Promise<Blob> {
  const response = await api.get("/contacts/export", {
    responseType: "blob",
  });

  return response.data;
}
