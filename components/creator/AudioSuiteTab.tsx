import React from 'react';
import Card from '../ui/Card';

const AudioSuiteTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-text-light mb-2">Audio Suite</h2>
      <p className="text-brand-text-dark mb-8">Find copyright-free music, generate sound effects, and clean up your audio with AI.</p>
      
      <Card>
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
          <p className="text-brand-text-dark max-w-md mx-auto">
            A complete toolkit for your stream's audio. Search a library of licensed music, generate custom SFX with a prompt, and use AI to remove background noise from your recordings.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AudioSuiteTab;
