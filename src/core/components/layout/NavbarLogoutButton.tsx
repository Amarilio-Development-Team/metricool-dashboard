'use client';

import LogoutButton from '@/features/auth/components/LogoutButton';

export default function NavbarLogoutButton() {
  return (
    <LogoutButton>
      {isPending => (
        <div className={`flex w-full cursor-pointer text-sm font-medium transition-colors ${isPending ? 'cursor-not-allowed' : 'text-red-500'}`}>
          {isPending ? 'Cerrando sesión...' : 'Cerrar Sesión'}
        </div>
      )}
    </LogoutButton>
  );
}
