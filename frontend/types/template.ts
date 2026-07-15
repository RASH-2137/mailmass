export interface Template {
  id: number;
  name: string;
  subject: string;
  body: string;
}

export type CreateTemplateRequest = {
  name: string;
  subject: string;
  body: string;
};