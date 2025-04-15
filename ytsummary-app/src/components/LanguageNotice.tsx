const supportedLanguages = [
    "Arabic", "Bengali", "Chinese", "Czech", "Dutch", "English", "French", "German",
    "Greek", "Gujarati", "Hebrew", "Hindi", "Hungarian", "Indonesian", "Italian",
    "Japanese", "Kannada", "Korean", "Malayalam", "Marathi", "Polish", "Portuguese",
    "Punjabi", "Romanian", "Russian", "Slovak", "Spanish", "Swedish", "Tamil",
    "Telugu", "Thai", "Turkish", "Ukrainian", "Urdu", "Vietnamese"
  ];
  
  export default function LanguageNotice() {
    return (
      <div className="text-sm text-gray-300 mt-4 text-center">
        <p className="mb-1">🌍 Supported languages for translation:</p>
        <div className="flex flex-wrap justify-center gap-2 text-blue-300">
          {supportedLanguages.map((lang) => (
            <span key={lang} className="px-2 py-1 border border-blue-500 rounded-full text-xs">
              {lang}
            </span>
          ))}
        </div>
        <p className="mt-2 text-gray-400">
          All supported languages will be automatically transcribed and summarized in English.
        </p>
      </div>
    );
  }
  