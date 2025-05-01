import React, { useState } from 'react';
import { QuizQuestion as QuizQuestionType } from '../types';
import QuizQuestion from './QuizQuestion';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

interface QuizResultsProps {
  questions: QuizQuestionType[];
}

const QuizResults: React.FC<QuizResultsProps> = ({ questions }) => {
  const [showAnswers, setShowAnswers] = useState(false);

  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Quiz Results</h2>
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="flex items-center text-sm font-medium px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          aria-pressed={showAnswers}
        >
          {showAnswers ? (
            <>
              <EyeOffIcon size={16} className="mr-2" />
              Hide Answers
            </>
          ) : (
            <>
              <EyeIcon size={16} className="mr-2" />
              Show Answers
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <QuizQuestion
            key={question.id}
            question={question}
            questionNumber={index + 1}
            showAnswers={showAnswers}
          />
        ))}
      </div>

      <p className="text-sm text-gray-500 mt-6 text-center">
        {showAnswers
          ? "Review the correct answers highlighted above."
          : "Select your answers, then click 'Show Answers' to check."}
      </p>
    </div>
  );
};

export default QuizResults;