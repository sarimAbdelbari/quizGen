import React from 'react';
import { QuizDifficulty } from '../types';
import { BookCopy, Sparkles } from 'lucide-react';

interface QuizControlsProps {
  difficulty: QuizDifficulty;
  onDifficultyChange: (difficulty: QuizDifficulty) => void;
  onGenerateQuiz: () => void;
  isGenerating: boolean; // Combined loading state (text extraction + quiz generation)
  isDisabled: boolean; // Explicit disabled state from App.tsx
}

const QuizControls: React.FC<QuizControlsProps> = ({
  difficulty,
  onDifficultyChange,
  onGenerateQuiz,
  isGenerating,
  isDisabled // Use the isDisabled prop
}) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
        <BookCopy className="mr-2 text-blue-600" size={20} />
        Generate Quiz
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Difficulty Level
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['Easy', 'Medium', 'Hard'] as QuizDifficulty[]).map((level) => (
            <button
              key={level}
              onClick={() => onDifficultyChange(level)}
              disabled={isGenerating} // Disable difficulty change while generating
              className={`py-2 px-4 text-sm font-medium rounded-md transition-all ${
                difficulty === level
                  ? 'bg-blue-100 text-blue-700 border-blue-300 border'
                  : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onGenerateQuiz}
        disabled={isDisabled} // Use the isDisabled prop passed from App.tsx
        className={`w-full flex items-center justify-center py-3 px-4 rounded-md text-white font-medium transition-all ${
          isDisabled // Use isDisabled for styling
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
        }`}
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {/* Provide more specific loading text if needed, e.g., based on isExtractingText vs isLoadingQuiz */}
            Processing...
          </>
        ) : (
          <>
            <Sparkles className="mr-2" size={20} />
            Generate Quiz
          </>
        )}
      </button>

      {/* Conditional message based on isDisabled and isGenerating */}
      {isDisabled && !isGenerating && (
        <p className="mt-2 text-sm text-orange-600">
          Please upload a PDF first.
        </p>
      )}
       {isGenerating && (
         <p className="mt-2 text-sm text-blue-600">
           Processing PDF and generating quiz...
         </p>
       )}
    </div>
  );
};

export default QuizControls;