import React, { useState } from 'react';
import { StepContext } from './StepContext';

export const StepProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <StepContext.Provider value={{ currentStep, setCurrentStep }}>
      {children}
    </StepContext.Provider>
  );
};
