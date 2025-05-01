import React, { useState } from 'react';
import { Document, Page } from 'react-pdf'; // Removed pdfjs import as it's handled globally
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';

interface PDFViewerProps {
  file: File; // Changed from File | null, assuming it's only rendered when file exists
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void; // Keep this callback
  // Removed onTextExtracted prop
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, onDocumentLoadSuccess }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Keep internal loading state for the viewer

  // Renamed internal handler to avoid confusion with prop name
  const handleDocumentLoad = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1); // Reset to first page on new document
    setIsLoading(false);
    onDocumentLoadSuccess({ numPages }); // Call the prop callback
  };

  const changePage = (offset: number) => {
    const newPage = pageNumber + offset;
    if (numPages && newPage > 0 && newPage <= numPages) {
      setPageNumber(newPage);
    }
  };

  // Removed the !file check as the component is conditionally rendered in App.tsx

  return (
    <div className="pdf-viewer-container border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden"> {/* Added overflow-hidden */}
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 p-3">
        <h3 className="text-lg font-medium text-gray-700">Document Preview</h3>
        {numPages && !isLoading && ( // Only show controls when loaded
          <div className="flex items-center space-x-4">
            <button
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              className={`p-1 rounded-full ${
                pageNumber <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-600 tabular-nums"> {/* Use tabular-nums for consistent spacing */}
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={() => changePage(1)}
              disabled={pageNumber >= numPages}
              className={`p-1 rounded-full ${
                pageNumber >= numPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-center p-4 pdf-container overflow-auto" style={{ maxHeight: '500px', minHeight: '200px' }}> {/* Added minHeight */}
        {/* Keep the Document loading state */}
        <Document
          file={file}
          onLoadSuccess={handleDocumentLoad} // Use internal handler
          onLoadError={(error) => {
             console.error('Error loading PDF:', error);
             setIsLoading(false); // Ensure loading stops on error
             // Optionally, display an error message within the viewer area
          }}
          loading={ // Custom loading indicator within the Document component
            <div className="flex items-center justify-center h-64 w-full">
              <Loader className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading PDF preview...</span>
            </div>
          }
          className="flex justify-center" // Center the document/page within the container
        >
          {/* Render page only when document is loaded */}
          {!isLoading && numPages && (
             <Page
               key={pageNumber} // Add key for potential re-renders on page change
               pageNumber={pageNumber}
               renderTextLayer={true} // Keep text layer for accessibility/selection
               renderAnnotationLayer={false} // Disable annotation layer if not needed
               // Removed onGetTextSuccess callback
               scale={1.2} // Adjust scale as needed
               className="shadow-md"
             />
          )}
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;