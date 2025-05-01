import React from 'react';
import { BookOpen } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen size={28} className="text-white" />
          <h1 className="text-2xl font-bold">PDF Quiz Generator</h1>
        </div>
        <p className="text-sm text-blue-100 hidden md:block">
          Upload a PDF and generate custom quizzes
        </p>
      </div>
    </header>
  );
};

export default Header;