export type FormState = {
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
  success?: boolean;
};

export interface AuthValues {
  email: string;
  password: string;
}
