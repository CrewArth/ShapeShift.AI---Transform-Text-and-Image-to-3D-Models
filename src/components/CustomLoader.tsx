import React from 'react';

interface CustomLoaderProps {
  message?: string;
  progress?: number;
}

export const CustomLoader: React.FC<CustomLoaderProps> = ({ message, progress }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-24 h-24">
        <circle fill="#FF156D" stroke="#FF156D" strokeWidth="15" r="15" cx="40" cy="100">
          <animate 
            attributeName="opacity" 
            calcMode="spline" 
            dur="2" 
            values="1;0;1;" 
            keySplines=".5 0 .5 1;.5 0 .5 1" 
            repeatCount="indefinite" 
            begin="-.4"
          />
        </circle>
        <circle fill="#FF156D" stroke="#FF156D" strokeWidth="15" r="15" cx="100" cy="100">
          <animate 
            attributeName="opacity" 
            calcMode="spline" 
            dur="2" 
            values="1;0;1;" 
            keySplines=".5 0 .5 1;.5 0 .5 1" 
            repeatCount="indefinite" 
            begin="-.2"
          />
        </circle>
        <circle fill="#FF156D" stroke="#FF156D" strokeWidth="15" r="15" cx="160" cy="100">
          <animate 
            attributeName="opacity" 
            calcMode="spline" 
            dur="2" 
            values="1;0;1;" 
            keySplines=".5 0 .5 1;.5 0 .5 1" 
            repeatCount="indefinite" 
            begin="0"
          />
        </circle>
      </svg>
      {message && (
        <p className="text-[var(--foreground)] text-lg font-medium text-center">
          {message}
        </p>
      )}
      {progress !== undefined && (
        <div className="w-full max-w-xs">
          <div className="h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#FF156D] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[var(--foreground-secondary)] text-sm text-center mt-2">
            {progress}%
          </p>
        </div>
      )}
    </div>
  );
}; 