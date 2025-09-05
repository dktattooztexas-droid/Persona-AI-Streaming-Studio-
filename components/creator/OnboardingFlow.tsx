import React, { useState } from 'react';
import { Creator } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface OnboardingFlowProps {
  user: Creator;
  onComplete: () => void;
}

const TOTAL_STEPS = 7;

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    contentType: '',
    nsfwPreferences: [] as string[],
    niche: '',
    vibe: '',
    links: '',
    goals: [] as string[],
  });

  const handleNext = () => {
    // Skip the NSFW step if the content type is not 'Adult / NSFW Content'
    if (step === 2 && formData.contentType !== 'Adult / NSFW Content') {
        setStep(4);
    } else {
        setStep(prev => Math.min(prev + 1, TOTAL_STEPS + 1));
    }
  };

  const handleBack = () => {
    // Skip back over the NSFW step if the content type is not 'Adult / NSFW Content'
    if (step === 4 && formData.contentType !== 'Adult / NSFW Content') {
        setStep(2);
    } else {
        setStep(prev => Math.max(prev - 1, 1));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
        ...prev,
        goals: prev.goals.includes(goal)
            ? prev.goals.filter(g => g !== goal)
            : [...prev.goals, goal]
    }));
  };
  
  const handleContentTypeSelect = (type: string) => {
    setFormData(prev => ({ ...prev, contentType: type }));
  };

  const handleNsfwPrefToggle = (pref: string) => {
    setFormData(prev => ({
        ...prev,
        nsfwPreferences: prev.nsfwPreferences.includes(pref)
            ? prev.nsfwPreferences.filter(p => p !== pref)
            : [...prev.nsfwPreferences, pref]
    }));
  };

  const renderStep = () => {
    const inputClasses = "w-full bg-gray-800 border-gray-700 rounded-md p-3 text-sm focus:ring-brand-primary focus:border-brand-primary transition-colors";
    const goalOptions = ["Grow my audience", "Create better branding", "Monetize content", "Find collaborators"];
    const contentTypeOptions = ["Gaming", "Art & Design", "Lifestyle & Vlogging", "Educational", "Adult / NSFW Content", "Other"];
    const nsfwPrefOptions = ["Artistic Nudity", "Erotic Literature", "Adult Gaming Streams", "Performance Art"];

    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold">Welcome, {user.creatorName}!</h2>
            <p className="text-brand-text-dark mt-2">Let's set up your AI Assistant to perfectly match your brand. A few questions will help us personalize your experience.</p>
          </>
        );
      case 2:
        return (
            <>
              <h2 className="text-xl font-semibold">What best describes your content?</h2>
              <p className="text-brand-text-dark text-sm mb-4">This helps us enable the right set of tools for you.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {contentTypeOptions.map(type => (
                      <button 
                          key={type}
                          onClick={() => handleContentTypeSelect(type)}
                          className={`p-3 rounded-lg text-sm text-center transition-all duration-200 border-2 ${
                              formData.contentType === type
                                  ? 'bg-brand-primary border-brand-primary text-white font-semibold'
                                  : 'bg-gray-800 border-gray-700 hover:border-brand-secondary'
                          }`}
                      >
                         {type}
                      </button>
                  ))}
              </div>
            </>
        );
      case 3:
          if (formData.contentType !== 'Adult / NSFW Content') return null;
          return (
            <>
              <h2 className="text-xl font-semibold">Tailoring your NSFW AI Tools</h2>
              <p className="text-brand-text-dark text-sm mb-4">
                To provide the best results, please specify the nature of your work.
                <span className="font-bold text-brand-secondary block mt-1">An NSFW mode will be enabled for your account.</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                  {nsfwPrefOptions.map(pref => (
                      <button 
                          key={pref}
                          onClick={() => handleNsfwPrefToggle(pref)}
                          className={`p-3 rounded-lg text-sm text-left transition-all duration-200 border-2 ${
                              formData.nsfwPreferences.includes(pref)
                                  ? 'bg-brand-primary border-brand-primary text-white font-semibold'
                                  : 'bg-gray-800 border-gray-700 hover:border-brand-secondary'
                          }`}
                      >
                         {pref}
                      </button>
                  ))}
              </div>
            </>
          );
      case 4:
        return (
          <>
            <h2 className="text-xl font-semibold">What is your primary content niche?</h2>
            <p className="text-brand-text-dark text-sm mb-4">Be specific! e.g., "Let's Plays of indie horror games," "Creating synthwave logos"</p>
            <input type="text" name="niche" value={formData.niche} onChange={handleInputChange} className={inputClasses} placeholder="Enter your specific niche..." />
          </>
        );
      case 5:
        return (
          <>
            <h2 className="text-xl font-semibold">Describe your brand's vibe in a few words.</h2>
            <p className="text-brand-text-dark text-sm mb-4">This helps the AI match your tone. e.g., "Energetic and funny," "Calm and educational"</p>
            <textarea name="vibe" value={formData.vibe} onChange={handleInputChange} className={`${inputClasses} min-h-[100px]`} placeholder="Describe your vibe..."></textarea>
          </>
        );
       case 6:
        return (
          <>
            <h2 className="text-xl font-semibold">Link your main channel or profile. (Optional)</h2>
            <p className="text-brand-text-dark text-sm mb-4">The AI can analyze your existing content to learn your style.</p>
            <input type="text" name="links" value={formData.links} onChange={handleInputChange} className={inputClasses} placeholder="https://youtube.com/yourchannel" />
          </>
        );
      case 7:
        return (
          <>
            <h2 className="text-xl font-semibold">What are your main goals?</h2>
            <p className="text-brand-text-dark text-sm mb-4">Select all that apply. This helps us suggest the right tools.</p>
            <div className="grid grid-cols-2 gap-3">
                {goalOptions.map(goal => (
                    <button 
                        key={goal}
                        onClick={() => handleGoalToggle(goal)}
                        className={`p-3 rounded-lg text-sm text-left transition-all duration-200 border-2 ${
                            formData.goals.includes(goal)
                                ? 'bg-brand-primary border-brand-primary text-white font-semibold'
                                : 'bg-gray-800 border-gray-700 hover:border-brand-secondary'
                        }`}
                    >
                       {goal}
                    </button>
                ))}
            </div>
          </>
        );
      default:
        return (
          <>
            <h2 className="text-2xl font-bold">You're all set!</h2>
            <p className="text-brand-text-dark mt-2">Your AI Assistant is now calibrated to your creative style. Let's start creating!</p>
          </>
        );
    }
  };

  const progress = ((step - 1) / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-xl w-full animate-fade-in-up">
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
            <div className="bg-brand-primary h-2 rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
        </div>
        
        <div className="min-h-[220px]">
            {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
            <div>
                {step > 1 && step <= TOTAL_STEPS && (
                    <Button variant="ghost" onClick={handleBack}>Back</Button>
                )}
            </div>
            <div>
                {step <= TOTAL_STEPS ? (
                    <Button onClick={handleNext} disabled={step === 2 && !formData.contentType}>
                        {step === TOTAL_STEPS ? 'Finish' : 'Next'}
                    </Button>
                ) : (
                    <Button onClick={onComplete}>Enter Studio</Button>
                )}
            </div>
        </div>
      </Card>
        <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default OnboardingFlow;