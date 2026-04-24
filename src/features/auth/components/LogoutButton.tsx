'use client';

import { logoutAction } from '@/features/auth/actions/auth.actions';
import { useState } from 'react';

interface LogoutButtonProps {
  children: (isPending: boolean) => React.ReactNode;
  className?: string;
}

export default function LogoutButton({ children, className }: LogoutButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    try {
      await logoutAction();
    } finally {
    }
  };

  return (
    <button onClick={handleLogout} disabled={isPending} className={className}>
      {children(isPending)}
    </button>
  );
}
