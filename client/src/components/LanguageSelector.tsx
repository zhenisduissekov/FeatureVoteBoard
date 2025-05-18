import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" }
];

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "en");

  useEffect(() => {
    // Update state if language changes from elsewhere
    if (currentLanguage !== i18n.language) {
      setCurrentLanguage(i18n.language);
    }
  }, [i18n.language, currentLanguage]);

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
  };

  return (
    <div className="language-selector">
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[120px] bg-white border border-gray-200 text-sm">
          <SelectValue placeholder={t("header.language")} />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              {language.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}