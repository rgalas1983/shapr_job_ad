import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { OutputPreview } from './components/OutputPreview';
import { JobFormData, GenerationState } from './types';
import { generateJobAd } from './services/geminiService';

const App: React.FC = () => {
  const [formData, setFormData] = useState<JobFormData>({
    jobTitle: '',
    location: 'Budapest',
    isRelocationApplicable: false,
    rawNotes: '',
  });

  const [generationState, setGenerationState] = useState<GenerationState>({
    isLoading: false,
    content: null,
    error: null,
  });

  const handleGenerate = async () => {
    setGenerationState({ isLoading: true, content: null, error: null });

    try {
      const result = await generateJobAd(formData);
      setGenerationState({
        isLoading: false,
        content: result,
        error: null,
      });
    } catch (err: any) {
      setGenerationState({
        isLoading: false,
        content: null,
        error: err.message || "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
        <Header />
        
        <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 h-full min-h-[500px]">
            <InputForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleGenerate} 
              isLoading={generationState.isLoading}
            />
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8 h-full min-h-[500px]">
            <OutputPreview 
              content={generationState.content} 
              error={generationState.error} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;