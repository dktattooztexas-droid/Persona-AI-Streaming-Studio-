import React from 'react';
import Card from '../ui/Card';

const SchedulerTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-text-light mb-2">Content Scheduler</h2>
      <p className="text-brand-text-dark mb-8">Plan and automate your content calendar across all platforms.</p>
      
      <Card>
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
          <p className="text-brand-text-dark max-w-md mx-auto">
            Visually plan your content schedule. Get AI suggestions for the best times to post, and automatically publish your videos and posts to Twitch, YouTube, TikTok and more.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SchedulerTab;
