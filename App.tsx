import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, BackgroundSettings, BackgroundMode } from './types';
import { getMockUser } from './services/mockData';
import LoginScreen from './components/LoginScreen';
import CreatorDashboard from './components/CreatorDashboard';
import { SpinnerIcon } from './constants';
import DynamicBackground from './components/DynamicBackground';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>({
    mode: BackgroundMode.PAPARAZZI,
    intensity: 1.5,
  });

  const handleLogin = useCallback((role: UserRole) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockUser = getMockUser(role);
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    // Simulate checking for an existing session
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <SpinnerIcon className="w-12 h-12 text-brand-primary" />
        </div>
      );
    }

    return user ? (
      <CreatorDashboard 
        user={user} 
        onLogout={handleLogout} 
        backgroundSettings={backgroundSettings}
        onBackgroundSettingsChange={setBackgroundSettings}
      />
    ) : (
      <LoginScreen onLogin={handleLogin} />
    );
  };

  return (
    <div className="min-h-screen text-brand-text-light font-sans">
      <DynamicBackground settings={backgroundSettings} />
      <main className="relative z-10">{renderContent()}</main>
    </div>
  );
};

export default App;
