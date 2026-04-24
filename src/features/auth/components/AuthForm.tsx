'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import { Formik, Form } from 'formik';
import { InputField } from '@/core/components/form-components/InputField';
import { InputFieldPassword } from '@/core/components/form-components/InputFieldPassword';
import { loginSchema, registerSchema } from '../schemas/login.schemas';

const AuthForm: React.FC<{ isSignIn: boolean }> = ({ isSignIn }) => {
  const validationSchema = isSignIn ? loginSchema : registerSchema;

  return (
    <>
      <article className="flex flex-col gap-3">
        <button className="container-color btn flex w-full items-center justify-center gap-4 rounded-[5px] px-6 py-3">
          <Icon icon="devicon:google" className="size-6" />
          <span className="text-strong text-sm font-medium md:text-[16px]">Continuar con Google</span>
        </button>
      </article>

      <article className="flex items-center justify-center gap-1.5">
        <div className="line-separator h-[0.5px] w-full"></div>
        <span className="text-placeholder text-base">Ó</span>
        <div className="line-separator h-[0.5px] w-full"></div>
      </article>

      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={async values => {
          //   await handleEmailAuth(values, isSignIn);
          console.log(values);
        }}
      >
        {() => (
          <Form className="flex flex-col gap-8">
            <div className="w-full">
              <InputField label="Correo electrónico" name="email" type="text" placeholder="Ej. correo@ejemplo.com" />
            </div>

            <div className="w-full">
              <InputFieldPassword isSignIn={isSignIn} label="Contraseña" name="password" type="password" placeholder="* * * * * * * *" />
            </div>

            <button className="primary-color-500 w-full rounded-[5px] px-6 py-2.5 text-center transition-colors duration-200 hover:primary-color-400" type="submit">
              <span className="font-semibold leading-none text-black">{isSignIn ? 'Iniciar sesión' : 'Continuar'}</span>
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AuthForm;
