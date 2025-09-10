'use client';

import { ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import PasswordModal from './PasswordModal';

interface ProtectedContentProps {
  children: ReactNode;
}

export default function ProtectedContent({ children }: ProtectedContentProps) {
  const { isAuthenticated, authenticate } = useAuth();

  return (
    <>
      {/* Main Content - blurred when not authenticated */}
      <div className={`transition-all duration-300 ${!isAuthenticated ? 'blur-lg pointer-events-none select-none' : ''}`}>
        {children}
      </div>

      {/* Password Modal */}
      <PasswordModal 
        isOpen={!isAuthenticated} 
        onSuccess={authenticate}
      />

      {/* Overlay to prevent interaction when blurred */}
      {!isAuthenticated && (
        <div className="fixed inset-0 z-40 bg-transparent" />
      )}
    </>
  );
}