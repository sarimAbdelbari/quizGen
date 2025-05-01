import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File } from 'lucide-react';

interface PDFUploaderProps {
  onFileSelect: (file: File) => void;
  file: File | null;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onFileSelect, file }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        onFileSelect(selectedFile);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 text-center cursor-pointer ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center py-6">
            <Upload className={`w-12 h-12 mb-3 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="mb-2 text-lg font-medium text-gray-700">
              {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
            </p>
            <p className="text-sm text-gray-500">or click to browse files</p>
            <p className="mt-2 text-xs text-gray-400">PDF files only</p>
          </div>
        </div>
      ) : (
        <div className="border-2 border-green-200 bg-green-50 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center">
            <File className="w-8 h-8 mr-2 text-green-600" />
            <div className="text-left">
              <p className="text-green-800 font-medium">{file.name}</p>
              <p className="text-xs text-green-600">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect(null as unknown as File);
            }}
            className="mt-4 px-3 py-1 text-sm text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors"
          >
            Remove file
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFUploader;