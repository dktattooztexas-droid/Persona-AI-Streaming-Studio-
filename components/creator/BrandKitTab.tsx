import React, { useState, useEffect } from 'react';
import { Creator, BrandKit } from '../../types';
import * as brandService from '../../services/brandService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { SpinnerIcon } from '../../constants';

interface BrandKitTabProps {
  user: Creator;
}

const BrandKitTab: React.FC<BrandKitTabProps> = ({ user }) => {
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKit = async () => {
      setIsLoading(true);
      const kit = await brandService.getBrandKit(user);
      setBrandKit(kit);
      setIsLoading(false);
    };
    fetchKit();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <SpinnerIcon className="w-10 h-10 text-brand-primary" />
      </div>
    );
  }

  if (!brandKit) {
    return <p className="text-brand-text-dark">Could not load brand kit.</p>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-text-light mb-2">Brand Kit</h2>
      <p className="text-brand-text-dark mb-8">Your central hub for all brand assets. Keep your content consistent and on-point.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Color Palette</h3>
          <div className="flex gap-4">
            {Object.entries(brandKit.colors).map(([name, color]) => (
              <div key={name} className="flex-1">
                <div className="w-full h-24 rounded-lg" style={{ backgroundColor: color }}></div>
                <p className="text-sm font-medium mt-2 capitalize">{name}</p>
                <p className="text-xs text-brand-text-dark">{color}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold mb-4">Logos</h3>
          <div className="flex gap-4">
            {brandKit.logos.map((logo, index) => (
              <img key={index} src={logo} alt={`Logo ${index + 1}`} className="w-24 h-24 rounded-lg bg-gray-700 object-cover" />
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold mb-4">Fonts</h3>
          <div>
            <p className="text-sm text-brand-text-dark">Heading Font</p>
            <p className="text-3xl" style={{ fontFamily: brandKit.fonts.heading }}>{brandKit.fonts.heading.split(',')[0]}</p>
          </div>
          <div className="mt-4">
            <p className="text-sm text-brand-text-dark">Body Font</p>
            <p className="text-lg" style={{ fontFamily: brandKit.fonts.body }}>{brandKit.fonts.body.split(',')[0]}</p>
          </div>
        </Card>

        <Card className="md:col-span-2">
           <h3 className="text-xl font-semibold mb-4">Brand Voice & Slogan</h3>
           <p className="text-brand-text-dark italic">"{brandKit.slogan}"</p>
           <div className="mt-6">
             <h4 className="font-semibold mb-2">Generate with AI</h4>
             <div className="flex gap-2">
                <input type="text" placeholder="e.g., 'a new slogan for a retro gaming channel'" className="flex-1 bg-brand-surface border border-gray-700/50 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all" />
                <Button size="sm">Generate</Button>
             </div>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default BrandKitTab;
