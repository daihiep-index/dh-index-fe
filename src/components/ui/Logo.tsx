import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'default' | 'login';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const subtitleSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
    xl: 'gap-5'
  };

  if (variant === 'login') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-green-600/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-2xl">
            <img
              src="/logo-daihiep.png"
              alt="DaiHiep Index Logo"
              className={`${sizeClasses[size]} object-contain mx-auto`}
            />
          </div>
        </div>
        {showText && (
          <div className="text-center">
            <h1 className={`${textSizeClasses[size]} font-bold text-white leading-tight mb-1`}>
              DaiHiep
            </h1>
            <span className={`text-emerald-400 ${subtitleSizeClasses[size]} font-semibold tracking-wider`}>
              INDEX
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${gapClasses[size]} ${className}`}>
      <div className="flex-shrink-0 relative">
        <div className="absolute inset-0 bg-emerald-600/20 rounded-xl blur-sm"></div>
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-2 rounded-xl border border-slate-700/50">
          <img
            src="/logo-daihiep.png"
            alt="DaiHiep Index Logo"
            className={`${sizeClasses[size]} object-contain`}
          />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold text-white leading-tight`}>
            DaiHiep
          </h1>
          <span className={`text-emerald-400 ${subtitleSizeClasses[size]} font-semibold tracking-wide -mt-1`}>
            INDEX
          </span>
        </div>
      )}
    </div>
  );
};

