import React from 'react';
import { UserRole } from '../types';
import Button from './ui/Button';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center p-8 bg-brand-surface/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl max-w-md animate-fade-in">
        <h1 className="text-5xl font-bold text-brand-text-light mb-2">
          Persona <span className="text-brand-primary">AI</span>
        </h1>
        <p className="text-lg text-brand-text-dark mb-8">Your AI-Powered Streaming Studio</p>
        <div className="space-y-4">
            <p className="text-brand-text-dark">Select your role to continue:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => onLogin(UserRole.CREATOR)} className="w-full sm:w-auto">
                I'm a Creator
                </Button>
                <Button onClick={() => onLogin(UserRole.COLLABORATOR)} variant="secondary" className="w-full sm:w-auto">
                I'm a Collaborator
                </Button>
            </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;