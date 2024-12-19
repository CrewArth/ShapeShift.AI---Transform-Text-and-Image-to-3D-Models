'use client';

import { LoaderCircle } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  progress?: number;
  message?: string;
}

export const LoadingSpinner = ({ size = 24, progress, message }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <LoaderCircle className="animate-spin" size={size} />
      {progress !== undefined && (
        <div className="w-full max-w-xs bg-[var(--background-secondary)] rounded-full h-2.5">
          <div 
            className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      {message && (
        <p className="text-[var(--foreground)] text-center">{message}</p>
      )}
    </div>
  );
} 