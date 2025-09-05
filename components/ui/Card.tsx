import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={`bg-brand-surface/80 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-lg p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-brand-primary/20 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;