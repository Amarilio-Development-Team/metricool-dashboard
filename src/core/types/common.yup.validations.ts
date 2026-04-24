import * as Yup from 'yup';

const REGEX = {
  CURP: /^[A-Z]{4}\d{6}[HM][A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]\d$/,
  NAME: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
  EMAIL: /^[a-zA-Z0-9ñÑ._%+-]+@[a-zA-Z0-9ñÑ.-]+\.[a-zA-Z]{2,}$/,
  ONLY_NUMBERS: /^[0-9]+$/,
  PASSWORD_COMPLEX: /^(?=.*[A-Z])(?=.*\d).{8,}$/,
};

export const emailValidation = Yup.string().trim().required('El correo es requerido').matches(REGEX.EMAIL, 'Ingresa un correo válido');

export const phoneValidation = Yup.string().matches(REGEX.ONLY_NUMBERS, 'Solo se permiten números').length(10, 'El teléfono debe ser de 10 dígitos').required('El teléfono es requerido');

export const curpValidation = Yup.string()
  .trim()
  .uppercase()
  .length(18, 'La CURP debe tener exactamente 18 caracteres')
  .matches(REGEX.CURP, 'El formato de la CURP es inválido')
  .required('La CURP es requerida');

export const birthdayValidation = Yup.string().required('La fecha de nacimiento es requerida');

export const selectValidation = (label: string) => Yup.string().required(label);

export const loginPasswordValidation = Yup.string().required('La contraseña es requerida');

export const strongPasswordValidation = Yup.string()
  .trim()
  .required('La contraseña es requerida')
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(50, 'La contraseña es muy larga (máximo 50 caracteres)')
  .matches(REGEX.PASSWORD_COMPLEX, 'La contraseña debe tener al menos una mayúscula y un número');

export const confirmPasswordValidation = Yup.string()
  .required('Debes confirmar la contraseña')
  .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden');

export const numericSelectValidation = (label: string) =>
  Yup.number()
    .transform(value => (Number.isNaN(value) ? null : value))
    .nullable()
    .moreThan(0, label)
    .required('Requerido');
