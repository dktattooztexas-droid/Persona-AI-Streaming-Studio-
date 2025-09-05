import React from 'react';
import Card from '../ui/Card';

const VideoLabTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-text-light mb-2">Video Lab</h2>
      <p className="text-brand-text-dark mb-8">AI-powered video editing tools to streamline your workflow.</p>
      
      <Card>
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
          <p className="text-brand-text-dark max-w-md mx-auto">
            Automatically find the best moments from your streams, generate highlight reels, create vertical clips for social media, and get AI-powered editing suggestions.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default VideoLabTab;
