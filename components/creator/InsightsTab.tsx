import React from 'react';
import Card from '../ui/Card';

const InsightsTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-text-light mb-2">Audience Insights</h2>
      <p className="text-brand-text-dark mb-8">Understand your audience and discover content opportunities with AI-driven analytics.</p>
      
      <Card>
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
          <p className="text-brand-text-dark max-w-md mx-auto">
            Deep dive into your analytics. See audience demographics, find out what content resonates most, and get AI suggestions for new video ideas your viewers will love.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default InsightsTab;
