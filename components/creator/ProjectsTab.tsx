
import React from 'react';
import Card from '../ui/Card';

const ProjectsTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-text-light mb-2">Projects & Collaborations</h2>
      <p className="text-brand-text-dark mb-8">Manage all your collaborations, from proposals to payments.</p>
      
      <Card>
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
          <p className="text-brand-text-dark max-w-md mx-auto">
            Track project progress, communicate with sponsors and collaborators, and manage deliverables all in one place.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ProjectsTab;
