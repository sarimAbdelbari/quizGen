import { QuizDifficulty, QuizQuestion, QuizOption } from "../types";
import { v4 as uuidv4 } from 'uuid'; // Import uuid

// Simulate calling an external API (like Gemini)
export const generateMockQuiz = async (
  text: string,
  difficulty: QuizDifficulty // Use correct type
): Promise<QuizQuestion[]> => {
  console.log(`Mock API: Generating ${difficulty} quiz for text starting with: "${text.substring(0, 50)}..."`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Determine the number of questions based on difficulty
  let numQuestions = 5; // Default to 5 for Easy
  if (difficulty === 'Medium') {
    numQuestions = 10; // Increase for Medium
  } else if (difficulty === 'Hard') {
    numQuestions = 15; // Increase for Hard
  }

  // Generate mock questions conforming to the types
  const questions: QuizQuestion[] = [];
  for (let i = 1; i <= numQuestions; i++) {
    const questionId = uuidv4(); // Generate unique ID for the question
    const correctOptionId = uuidv4(); // Generate unique ID for the correct option
    const options: QuizOption[] = [
      {
        id: uuidv4(),
        text: `Option A for Q${i}`,
        isCorrect: false,
      },
      {
        id: correctOptionId,
        text: `Option B for Q${i} (Correct)`,
        isCorrect: true, // Mark the correct answer
      },
      {
        id: uuidv4(),
        text: `Option C for Q${i}`,
        isCorrect: false,
      },
      {
        id: uuidv4(),
        text: `Option D for Q${i}`,
        isCorrect: false,
      },
    ];

    questions.push({
      id: questionId,
      text: `This is ${difficulty} question ${i} based on the provided text? Placeholder text snippet: "${text.substring(i * 10, i * 10 + 30)}..."`,
      options: options, // Assign the generated options array
    });
  }

  console.log(`Mock API: Generated ${questions.length} questions.`);
  return questions;
};