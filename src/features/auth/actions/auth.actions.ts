'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthValues } from '../types/auth.types';

export async function loginWithFormikAction(values: AuthValues) {
  const { email, password } = values;
  const BACKEND_ENDPOINT_BASE_URL = process.env.BACKEND_ENDPOINT_BASE_URL;

  try {
    const res = await fetch(`${BACKEND_ENDPOINT_BASE_URL}auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      return { success: false, error: 'Correo o contraseña incorrectos, por favor verifique sus datos' };
    }

    const data = await res.json();
    const cookieStore = await cookies();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    cookieStore.set('session_token', data.access_token, {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === 'production'
      sameSite: 'lax',
      expires: expires,
      path: '/',
    });

    cookieStore.set('user_info', JSON.stringify(data.user), {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === 'production'
      sameSite: 'lax',
      expires: expires,
      path: '/',
    });

    return { success: true, user: data.user };
  } catch (error) {
    console.log(error);
    return { success: false, error: 'Error de conexión con el servidor' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session_token');
  cookieStore.delete('user_info');

  redirect('/administracion/inicio-sesion');
}
