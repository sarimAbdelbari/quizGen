import { pdfjs } from 'react-pdf';

// Define a type for PDF text items for clarity
interface PDFTextItem {
  str: string;
  // Include other properties if needed, like dir, width, height, transform, fontName
}

// Ensure pdfjs worker is configured
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument(arrayBuffer);
  const pdf = await loadingTask.promise;
  let fullText = '';
  const objectUrl = URL.createObjectURL(file); // Create object URL once

  try {
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      // Use the defined interface for item type
      const pageText = textContent.items.map((item: PDFTextItem) => item.str).join(' ');
      fullText += pageText + '\n\n'; // Add newline between pages
    }
  } finally {
    URL.revokeObjectURL(objectUrl); // Clean up the object URL
  }

  return fullText.trim();
};

export const truncateText = (text: string, maxLength: number = 15000): string => {
  if (text.length <= maxLength) return text;
  // Try to truncate at a sentence boundary
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  // Only truncate at sentence end if it's reasonably close to the max length (e.g., within the last 200 chars)
  if (lastPeriod > maxLength - 200 && lastPeriod !== -1) {
    return truncated.substring(0, lastPeriod + 1);
  }
  return truncated + '...';
};