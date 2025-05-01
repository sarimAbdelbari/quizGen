import React, { useState } from 'react';
import { QuizQuestion as QuizQuestionType, QuizOption } from '../types';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  showAnswers: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  showAnswers
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const isAnswered = selectedOptionId !== null;
  
  const handleSelectOption = (optionId: string) => {
    if (!isAnswered) {
      setSelectedOptionId(optionId);
    }
  };
  
  const getSelectedOption = () => {
    return question.options.find(option => option.id === selectedOptionId);
  };
  
  const isCorrectAnswer = () => {
    const selected = getSelectedOption();
    return selected?.isCorrect || false;
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6 transition-all hover:shadow-md">
      <div className="flex items-start">
        <span className="flex items-center justify-center bg-blue-100 text-blue-800 rounded-full h-8 w-8 mr-3 text-sm font-semibold flex-shrink-0">
          {questionNumber}
        </span>
        <h3 className="text-lg font-medium text-gray-800">{question.text}</h3>
      </div>
      
      <div className="mt-4 space-y-3">
        {question.options.map((option: QuizOption) => {
          const isSelected = selectedOptionId === option.id;
          const showCorrectness = showAnswers && isAnswered;
          
          let optionClasses = "flex items-center p-3 rounded-md border transition-all cursor-pointer";
          
          if (isSelected && showCorrectness) {
            optionClasses += option.isCorrect
              ? " bg-green-50 border-green-300"
              : " bg-red-50 border-red-300";
          } else if (isSelected) {
            optionClasses += " bg-blue-50 border-blue-300";
          } else if (showCorrectness && option.isCorrect) {
            optionClasses += " bg-green-50 border-green-300";
          } else {
            optionClasses += " border-gray-200 hover:bg-gray-50";
          }
          
          return (
            <div
              key={option.id}
              className={optionClasses}
              onClick={() => handleSelectOption(option.id)}
            >
              <div className={`h-5 w-5 rounded-full border flex-shrink-0 flex items-center justify-center mr-3 ${
                isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              }`}>
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-white"></span>
                )}
              </div>
              
              <span className="text-gray-700">{option.text}</span>
              
              {showCorrectness && (
                <>
                  {option.isCorrect ? (
                    <CheckCircle className="ml-auto text-green-500" size={20} />
                  ) : isSelected && !option.isCorrect ? (
                    <XCircle className="ml-auto text-red-500" size={20} />
                  ) : null}
                </>
              )}
            </div>
          );
        })}
      </div>
      
      {isAnswered && showAnswers && (
        <div className={`mt-4 p-3 rounded-md ${
          isCorrectAnswer() ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {isCorrectAnswer() ? (
            <div className="flex items-center">
              <CheckCircle size={18} className="mr-2" />
              <span>Correct! Well done.</span>
            </div>
          ) : (
            <div className="flex items-center">
              <XCircle size={18} className="mr-2" />
              <span>Incorrect. The correct answer is highlighted in green.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;