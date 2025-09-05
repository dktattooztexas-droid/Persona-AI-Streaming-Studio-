import React from 'react';
import { BackgroundSettings, BackgroundMode } from '../../types';
import Card from '../ui/Card';

interface AdminPanelTabProps {
  settings: BackgroundSettings;
  onSettingsChange: (settings: BackgroundSettings) => void;
}

const AdminPanelTab: React.FC<AdminPanelTabProps> = ({ settings, onSettingsChange }) => {
  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, mode: e.target.value as BackgroundMode });
  };

  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, intensity: parseFloat(e.target.value) });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-text-light mb-2">Admin Panel</h2>
      <p className="text-brand-text-dark mb-8">Control the app's visual experience.</p>
      
      <Card>
        <h3 className="text-xl font-semibold mb-6">Background Effect Controls</h3>
        <div className="space-y-6">
          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-brand-text-light mb-2">Effect Mode</label>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* FIX: Explicitly cast Object.values to BackgroundMode[] to satisfy strict TypeScript rules. */}
              {(Object.values(BackgroundMode) as BackgroundMode[]).map((mode) => (
                <label key={mode} className="flex items-center gap-2 cursor-pointer p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <input
                    type="radio"
                    name="background-mode"
                    value={mode}
                    checked={settings.mode === mode}
                    onChange={handleModeChange}
                    className="h-4 w-4 text-brand-primary bg-gray-700 border-gray-600 focus:ring-brand-primary accent-brand-primary"
                  />
                  <span className="text-brand-text-light">{mode}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Intensity Slider */}
          <div>
            <label htmlFor="intensity-slider" className="block text-sm font-medium text-brand-text-light">
              Effect Intensity: <span className="font-bold text-brand-secondary">{settings.intensity.toFixed(1)}</span>
            </label>
            <input
              id="intensity-slider"
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={settings.intensity}
              onChange={handleIntensityChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-primary mt-2"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminPanelTab;
