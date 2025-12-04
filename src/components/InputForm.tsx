import React, { useEffect } from 'react';
import { JobFormData, LocationType } from '../types';
import { MapPin, Briefcase, FileText, Send } from 'lucide-react';

interface InputFormProps {
  formData: JobFormData;
  setFormData: React.Dispatch<React.SetStateAction<JobFormData>>;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ formData, setFormData, onSubmit, isLoading }) => {
  
  const handleChange = (field: keyof JobFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const showRelocation = ['Denver', 'Budapest'].includes(formData.location);

  // Reset relocation if switching to remote
  useEffect(() => {
    if (!showRelocation && formData.isRelocationApplicable) {
       handleChange('isRelocationApplicable', false);
    }
  }, [formData.location, showRelocation]);

  return (
    <div className="bg-shapr-card border border-shapr-border rounded-lg p-6 h-full flex flex-col">
      <div className="mb-6 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-gray-400" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">ROLE DETAILS</h3>
      </div>

      <div className="space-y-6 flex-grow">
        {/* Job Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Job Title</label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            placeholder="e.g. Senior iOS Engineer"
            className="w-full bg-black border border-shapr-border rounded p-3 text-white placeholder-gray-600 focus:outline-none focus:border-shapr-blue focus:ring-1 focus:ring-shapr-blue transition-all"
          />
        </div>

        {/* Location & Relocation Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location
            </label>
            <div className="relative">
              <select
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value as LocationType)}
                className="w-full bg-black border border-shapr-border rounded p-3 text-white appearance-none focus:outline-none focus:border-shapr-blue cursor-pointer"
              >
                <option value="Budapest">Budapest</option>
                <option value="Denver">Denver</option>
                <option value="Remote">Remote</option>
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Conditional Relocation Input (Denver & Budapest) */}
          <div className={`${showRelocation ? 'block' : 'hidden'}`}>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Relocation Support?</label>
             <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleChange('isRelocationApplicable', true)}
                  className={`flex-1 p-3 rounded border text-sm font-medium transition-colors ${
                    formData.isRelocationApplicable 
                      ? 'bg-shapr-blue border-shapr-blue text-white' 
                      : 'bg-black border-shapr-border text-gray-400 hover:border-gray-500'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('isRelocationApplicable', false)}
                  className={`flex-1 p-3 rounded border text-sm font-medium transition-colors ${
                    !formData.isRelocationApplicable 
                      ? 'bg-white text-black border-white' 
                      : 'bg-black border-shapr-border text-gray-400 hover:border-gray-500'
                  }`}
                >
                  No
                </button>
             </div>
          </div>
        </div>

        {/* Raw Notes */}
        <div className="flex-grow flex flex-col">
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase flex items-center gap-1">
            <FileText className="w-3 h-3" /> Requirements & Context
          </label>
          <textarea
            value={formData.rawNotes}
            onChange={(e) => handleChange('rawNotes', e.target.value)}
            placeholder="Paste raw bullet points, hiring manager notes, or basic requirements here. The AI will structure and tone-check this content."
            className="w-full flex-grow bg-black border border-shapr-border rounded p-3 text-white placeholder-gray-600 focus:outline-none focus:border-shapr-blue focus:ring-1 focus:ring-shapr-blue transition-all min-h-[200px] font-mono text-sm leading-relaxed"
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <button
          onClick={onSubmit}
          disabled={isLoading || !formData.jobTitle || !formData.rawNotes}
          className={`w-full py-4 rounded font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
            isLoading || !formData.jobTitle || !formData.rawNotes
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-shapr-blue hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              Generate Advert <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};