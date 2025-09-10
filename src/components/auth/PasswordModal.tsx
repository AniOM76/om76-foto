'use client';

import { useState } from 'react';

interface PasswordModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export default function PasswordModal({ isOpen, onSuccess }: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // You can change this code - consider moving to environment variable later
  const CORRECT_PASSWORD = 'OM76portfolio2025';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Small delay to prevent instant brute force
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === CORRECT_PASSWORD) {
      // Store authentication in session storage
      sessionStorage.setItem('om76_authenticated', 'true');
      onSuccess();
    } else {
      setError('Incorrect access code. Please try again.');
      setPassword('');
    }
    
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome To OM76 Photography
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-center text-lg tracking-wider"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-lg font-medium"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Enter'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}