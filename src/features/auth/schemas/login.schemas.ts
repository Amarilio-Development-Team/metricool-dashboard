import * as Yup from 'yup';
import { emailValidation, loginPasswordValidation, strongPasswordValidation } from '@/core/types/common.yup.validations';

export const loginSchema = Yup.object({
  email: emailValidation,
  password: loginPasswordValidation,
});

export const registerSchema = Yup.object({
  email: emailValidation,
  password: strongPasswordValidation,
});
