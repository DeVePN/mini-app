import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className, onClick, hoverable = false }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-gray-200 p-4',
        {
          'cursor-pointer hover:shadow-md transition-shadow': hoverable || onClick,
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
