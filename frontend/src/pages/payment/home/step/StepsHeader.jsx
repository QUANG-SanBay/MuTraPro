import React from 'react';
import { Check } from 'lucide-react';

export default function StepsHeader({ steps, currentStep }) {
  return (
    <div className="steps-header card">
      <div className="steps-inner">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const Icon = step.icon;
          return (
            <React.Fragment key={step.number}>
              <div className="step-item">
                <div className={`step-circle ${isCompleted ? 'completed' : isActive ? 'active' : ''}`}>
                  {isCompleted ? <Check size={16} color="#fff" /> : <Icon size={16} color="#fff" />}
                </div>
                <div className={`step-label ${isActive ? 'text-active' : isCompleted ? 'text-completed' : ''}`}>
                  {step.name}
                </div>
              </div>
              {index < steps.length - 1 && <div className={`step-line ${currentStep > step.number ? 'line-active' : ''}`} />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
