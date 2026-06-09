import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700">
      <Globe className="w-4 h-4 ml-1 text-gray-500" />
      <button
        onClick={() => toggleLanguage('id')}
        className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${
          language === 'id' 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        ID
      </button>
      <button
        onClick={() => toggleLanguage('en')}
        className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${
          language === 'en' 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        EN
      </button>
    </div>
  );
}
