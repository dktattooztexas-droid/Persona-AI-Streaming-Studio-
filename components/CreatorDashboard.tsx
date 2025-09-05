import React, { useState, useEffect } from 'react';
import { User, UserRole, Creator, BackgroundSettings } from '../types';
import { 
    AssistantIcon, VideoCameraIcon, MagicWandIcon, StreamingIcon, ProjectsIcon,
    MonetizationIcon, AdminIcon, PaletteIcon, MusicIcon, InsightsIcon, CalendarIcon,
    MenuIcon, XIcon
} from '../constants';
import AssistantTab from './creator/AssistantTab';
import StreamingTab from './creator/StreamingTab';
import ProjectsTab from './creator/ProjectsTab';
import MonetizationTab from './creator/MonetizationTab';
import AdminPanelTab from './creator/AdminPanelTab';
import OnboardingFlow from './creator/OnboardingFlow';
import BrandKitTab from './creator/BrandKitTab';
import AudioSuiteTab from './creator/AudioSuiteTab';
import VideoLabTab from './creator/VideoLabTab';
import SchedulerTab from './creator/SchedulerTab';
import InsightsTab from './creator/InsightsTab';

interface CreatorDashboardProps {
  user: User;
  onLogout: () => void;
  backgroundSettings: BackgroundSettings;
  onBackgroundSettingsChange: (settings: BackgroundSettings) => void;
}

const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  user,
  onLogout,
  backgroundSettings,
  onBackgroundSettingsChange,
}) => {
  const [activeTab, setActiveTab] = useState('assistant');
  const [justOnboarded, setJustOnboarded] = useState(true);
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOnboardingComplete = () => {
      setIsOnboarding(false);
      setJustOnboarded(true);
      setActiveTab('assistant');
      setTimeout(() => setJustOnboarded(false), 500);
  }

  useEffect(() => {
    // Close menu on escape key press
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  if (isOnboarding && user.role === UserRole.CREATOR) {
    return <OnboardingFlow user={user as Creator} onComplete={handleOnboardingComplete} />;
  }
  
  const tabs = [
    { id: 'assistant', label: 'AI Assistant', Icon: AssistantIcon, component: <AssistantTab user={user} justOnboarded={justOnboarded} /> },
    { id: 'brand_kit', label: 'Brand Kit', Icon: PaletteIcon, component: <BrandKitTab user={user as Creator} /> },
    { id: 'audio_suite', label: 'Audio Suite', Icon: MusicIcon, component: <AudioSuiteTab /> },
    { id: 'video_lab', label: 'Video Lab', Icon: VideoCameraIcon, component: <VideoLabTab /> },
    { id: 'streaming', label: 'Streaming', Icon: StreamingIcon, component: <StreamingTab /> },
    { id: 'scheduler', label: 'Scheduler', Icon: CalendarIcon, component: <SchedulerTab /> },
    { id: 'insights', label: 'Insights', Icon: InsightsIcon, component: <InsightsTab /> },
    { id: 'projects', label: 'Projects', Icon: ProjectsIcon, component: <ProjectsTab /> },
    { id: 'monetization', label: 'Monetization', Icon: MonetizationIcon, component: <MonetizationTab /> },
  ];
  
  if (user.role === UserRole.ADMIN) {
    tabs.push({ id: 'admin', label: 'Admin Panel', Icon: AdminIcon, component: <AdminPanelTab settings={backgroundSettings} onSettingsChange={onBackgroundSettingsChange}/> });
  }

  const renderTabContent = () => {
    const tab = tabs.find(t => t.id === activeTab);
    return tab ? tab.component : <div>Select a tab</div>;
  };

  const NavLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => (
    <nav className={isMobile ? "flex flex-col space-y-2 px-2" : "flex flex-col"}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id);
            setIsMenuOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left ${
            activeTab === tab.id
              ? 'bg-brand-primary text-white shadow'
              : 'text-brand-text-dark hover:bg-brand-surface hover:text-brand-text-light'
          }`}
        >
          <tab.Icon className="w-5 h-5" />
          {tab.label}
        </button>
      ))}
       <div className="border-t border-gray-700/50 my-2"></div>
        <button
          onClick={() => { onLogout(); setIsMenuOpen(false); }}
          className="w-full text-left px-3 py-2.5 text-sm text-brand-text-dark hover:bg-brand-surface hover:text-brand-text-light rounded-md"
        >
          Logout
        </button>
    </nav>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-brand-surface/80 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-primary rounded-lg">
                <MagicWandIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold">Persona <span className="text-brand-primary">AI</span></h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-surface transition-colors"
                >
                  <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm text-brand-text-light text-left">{user.name}</p>
                    <p className="text-xs text-brand-text-dark capitalize text-left">{user.role}</p>
                  </div>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-brand-surface/95 backdrop-blur-xl border border-gray-700/50 rounded-lg shadow-2xl p-2 animate-fade-in-down">
                    <NavLinks />
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-brand-text-dark hover:text-brand-text-light hover:bg-brand-surface focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <XIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="md:hidden bg-brand-surface/95 backdrop-blur-xl border-t border-gray-700/50 py-4 animate-fade-in-down">
            <div className="px-2 space-y-3">
              <div className="flex items-center gap-3 p-2 mb-2">
                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold text-sm text-brand-text-light">{user.name}</p>
                  <p className="text-xs text-brand-text-dark capitalize">{user.role}</p>
                </div>
              </div>
              <NavLinks isMobile />
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-24 lg:pt-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto">
          {renderTabContent()}
        </div>
      </main>
      
      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CreatorDashboard;