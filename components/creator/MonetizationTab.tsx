
import React from 'react';
import Card from '../ui/Card';

const MonetizationTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-text-light mb-2">Monetization</h2>
      <p className="text-brand-text-dark mb-8">Track your earnings, manage payouts, and explore new revenue streams.</p>

      <Card>
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
          <p className="text-brand-text-dark max-w-md mx-auto">
            Your financial dashboard. View detailed earnings reports, connect your payment accounts, and withdraw your available balance.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MonetizationTab;
