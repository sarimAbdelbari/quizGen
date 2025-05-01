import { useState, useEffect } from 'react'; // Import useEffect
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import Header from './components/Header';
import PDFUploader from './components/PDFUploader';
import PDFViewer from './components/PDFViewer'; // Corrected import name
import QuizControls from './components/QuizControls';
import QuizResults from './components/QuizResults';
import { Difficulty, QuizQuestion } from './types';
import { extractTextFromPDF, truncateText } from './utils/pdfUtils';
// Import the actual API function (placeholder for now)
import { generateQuizFromText } from './utils/geminiApi'; // Changed from mock

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0); // Keep track of numPages for viewer
  const [extractedText, setExtractedText] = useState<string>(''); // Store full extracted text
  const [isExtractingText, setIsExtractingText] = useState<boolean>(false); // State for text extraction
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Add error state

  const handleFileChange = (file: File | null) => {
    setPdfFile(file);
    setNumPages(0); // Reset numPages
    setExtractedText(''); // Clear previous text
    setQuizQuestions([]); // Clear previous questions
    setError(null); // Clear errors
    setIsExtractingText(false); // Reset extraction status
    if (file) {
      // Start text extraction immediately after file selection
      extractFullPDFText(file);
    }
  };

  // Function to extract text from the entire PDF
  const extractFullPDFText = async (file: File) => {
    setIsExtractingText(true);
    setError(null);
    try {
      console.log("Starting full text extraction...");
      const text = await extractTextFromPDF(file);
      setExtractedText(text);
      console.log(`Text extracted successfully (${text.length} characters).`);
    } catch (err) {
      console.error("Error extracting text from PDF:", err);
      setError("Failed to extract text from the PDF. Please try another file.");
      setExtractedText(''); // Clear text on error
    } finally {
      setIsExtractingText(false);
    }
  };

  // Callback for PDFViewer when document loads successfully
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    // No text extraction here anymore
  };

  const handleGenerateQuiz = async () => {
    if (!extractedText || isExtractingText) {
      setError('Please wait for the PDF text to be processed.');
      return;
    }
    if (isLoadingQuiz) return; // Prevent multiple simultaneous requests

    setIsLoadingQuiz(true);
    setError(null); // Clear previous errors
    setQuizQuestions([]); // Clear previous questions

    try {
      // Truncate text before sending to API (optional, adjust as needed)
      const textToSend = truncateText(extractedText, 15000); // Use the same truncation logic
      console.log(`Sending ${textToSend.length} chars to API for ${difficulty} quiz.`);

      // Call the actual API function
      const questions = await generateQuizFromText(textToSend, difficulty);
      setQuizQuestions(questions);
      console.log("Quiz generated successfully:", questions);
    } catch (err) {
      console.error("Error generating quiz:", err);
      setError("Failed to generate quiz. Please check the API configuration or try again later.");
      setQuizQuestions([]); // Clear questions on error
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 flex flex-col md:flex-row gap-6"> {/* Increased gap */}
        {/* Left Column: PDF Uploader and Viewer */}
        <div className="flex-1 flex flex-col gap-6 md:w-1/2"> {/* Increased gap */}
          <PDFUploader onFileSelect={handleFileChange} file={pdfFile} />
          {pdfFile && (
            <PDFViewer
              file={pdfFile} // Pass the file directly
              onDocumentLoadSuccess={onDocumentLoadSuccess} // Pass the callback
              // Removed props related to page change and text extraction per page
            />
          )}
          {isExtractingText && (
            <div className="text-center text-gray-600 p-4 bg-blue-50 rounded border border-blue-200">
              Extracting text from PDF...
            </div>
          )}
        </div>

        {/* Right Column: Quiz Controls and Results */}
        <div className="flex-1 flex flex-col gap-6 md:w-1/2"> {/* Increased gap */}
          {/* Only show controls if a PDF is loaded */}
          {pdfFile && (
            <QuizControls
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              onGenerateQuiz={handleGenerateQuiz}
              isGenerating={isLoadingQuiz || isExtractingText} // Disable if extracting text or generating quiz
              isDisabled={!extractedText || isLoadingQuiz || isExtractingText} // More explicit disabled state
            />
          )}
          {/* Display errors */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          {/* Display loading state for quiz generation */}
          {isLoadingQuiz && !error && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">Generating quiz questions...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
            </div>
          )}
          {/* Display quiz results only when not loading and no errors */}
          {!isLoadingQuiz && !error && quizQuestions.length > 0 && (
            <QuizResults
              questions={quizQuestions}
              // Removed showAnswers state management from App.tsx, handled within QuizResults
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;