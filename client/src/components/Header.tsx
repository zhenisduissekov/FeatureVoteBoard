import { HeaderProps } from "@/lib/types";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

export default function Header({ onAddFeatureClick }: HeaderProps) {
  const { t } = useTranslation();
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-white" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold">{t('header.title')}</h1>
        </div>
        <div className="flex items-center space-x-3">
          <LanguageSelector />
          <button 
            onClick={onAddFeatureClick}
            className="bg-accent hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out"
          >
            {t('header.addFeature')}
          </button>
        </div>
      </div>
    </header>
  );
}
