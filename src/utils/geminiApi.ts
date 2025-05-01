import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { QuizDifficulty, QuizQuestion, QuizOption } from "../types";
import { v4 as uuidv4 } from 'uuid';

// --- IMPORTANT: API Key Configuration ---
// Add your Gemini API key to a .env file in the root of your project:
// VITE_GEMINI_API_KEY=YOUR_API_KEY
// Make sure .env is added to your .gitignore file!
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file.");
  // Optionally, throw an error or handle this case appropriately
  // throw new Error("Gemini API key not found.");
}

const genAI = new GoogleGenerativeAI(API_KEY || ""); // Initialize with API key or empty string if not found

// Function to generate quiz questions using the Gemini API
export const generateQuizFromText = async (
  text: string,
  difficulty: QuizDifficulty,
  numQuestions: number = 5 // Default number of questions
): Promise<QuizQuestion[]> => {
  if (!API_KEY) {
    throw new Error("API Key not configured. Cannot generate quiz.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Or choose another suitable model

  const generationConfig = {
    temperature: 0.7,
    topK: 1,
    topP: 1,
    maxOutputTokens: 8192, // Adjust as needed
    response_mime_type: "application/json", // Request JSON output
  };

  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ];

  // Determine the number of questions based on difficulty if not explicitly passed
  if (numQuestions === 5) { // Only override if default is used
      if (difficulty === 'Medium') numQuestions = 7;
      else if (difficulty === 'Hard') numQuestions = 10;
  }

  const prompt = `
    Based on the following text, generate ${numQuestions} multiple-choice quiz questions of ${difficulty} difficulty.

    Text:
    """
    ${text}
    """

    For each question, provide:
    1. The question text.
    2. Four options (A, B, C, D).
    3. Clearly indicate which option is the correct answer.

    Return the output ONLY as a valid JSON array of objects, where each object represents a question and has the following structure:
    {
      "text": "The question text?",
      "options": [
        { "id": "unique_id_A", "text": "Option A text", "isCorrect": false },
        { "id": "unique_id_B", "text": "Option B text (Correct)", "isCorrect": true },
        { "id": "unique_id_C", "text": "Option C text", "isCorrect": false },
        { "id": "unique_id_D", "text": "Option D text", "isCorrect": false }
      ]
    }

    Ensure exactly one option has "isCorrect" set to true for each question.
    Ensure each option has a unique "id". You can generate these using a UUID library or similar.
    Do not include any introductory text, explanations, or markdown formatting outside the JSON structure.
    The entire response should be the JSON array.
  `;

  try {
    console.log("Sending prompt to Gemini API...");
    const result = await model.generateContent(
        prompt,
        // Pass generationConfig and safetySettings if needed by the specific model/method
        // generationConfig, 
        // safetySettings
    );
    const response = result.response;
    const rawJsonText = response.text(); // Renamed for clarity
    console.log("Raw API Response Text:", rawJsonText);

    let jsonToParse = '';

    // Try to extract content between ```json and ```
    const jsonMatch = rawJsonText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonToParse = jsonMatch[1].trim();
      console.log("Extracted JSON content from fences.");
    } else {
      // Fallback: If fences aren't found, just trim the raw text
      jsonToParse = rawJsonText.trim();
      console.log("Fences not found, using trimmed raw text.");
    }

    let parsedQuestions: any[];
    try {
      parsedQuestions = JSON.parse(jsonToParse); // Parse the extracted/trimmed content
      if (!Array.isArray(parsedQuestions)) {
        throw new Error("Parsed response is not an array.");
      }
    } catch (parseError) {
      console.error("Failed to parse API response as JSON:", parseError);
      console.error("JSON Text Attempted to Parse:", jsonToParse); // Log the text that failed parsing
      throw new Error("API response was not valid JSON.");
    }

    // Validate structure and add unique IDs if missing
    const validatedQuestions: QuizQuestion[] = parsedQuestions.map((q: any, index: number): QuizQuestion => {
      if (!q.text || !Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Invalid structure for question ${index + 1}`);
      }

      let correctCount = 0;
      const validatedOptions: QuizOption[] = q.options.map((opt: any, optIndex: number): QuizOption => {
        if (typeof opt.text !== 'string' || typeof opt.isCorrect !== 'boolean') {
          throw new Error(`Invalid option structure in question ${index + 1}, option ${optIndex + 1}`);
        }
        if (opt.isCorrect) correctCount++;
        return {
          id: opt.id || uuidv4(), // Generate UUID if missing
          text: opt.text,
          isCorrect: opt.isCorrect,
        };
      });

      if (correctCount !== 1) {
        throw new Error(`Question ${index + 1} must have exactly one correct answer.`);
      }

      return {
        id: q.id || uuidv4(), // Generate UUID if missing
        text: q.text,
        options: validatedOptions,
      };
    });

    console.log("Parsed and validated questions:", validatedQuestions);
    return validatedQuestions;

  } catch (error) {
    console.error("Error calling Gemini API or processing response:", error);
    // Provide a more specific error message if possible
    if (error instanceof Error) {
        // Avoid duplicating the "Failed to generate quiz:" prefix if it's already there
        const message = error.message.startsWith("Failed to generate quiz:")
            ? error.message
            : `Failed to generate quiz: ${error.message}`;
        throw new Error(message);
    }
    throw new Error("An unknown error occurred while generating the quiz.");
  }
};