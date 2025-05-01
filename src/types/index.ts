export type QuizDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface QuizOption {
  id: string; // Ensure IDs are strings (like UUIDs)
  text: string;
  isCorrect: boolean;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

export interface PDFDocumentProxy {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PDFPageProxy>;
}

export interface PDFPageProxy {
  getTextContent: () => Promise<PDFTextContent>;
}

export interface PDFTextContent {
  items: Array<{ str: string }>;
}