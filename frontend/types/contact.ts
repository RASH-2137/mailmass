export interface Contact {
  id: number;
  name: string;
  email: string;
}

export interface ContactsResponse {
  page: number;
  limit: number;
  total_contacts: number;
  contacts: Contact[];
}