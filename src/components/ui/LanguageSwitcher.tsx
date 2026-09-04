import { useTranslation } from "react-i18next";

import "./LanguageSwitcher.css";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.resolvedLanguage ?? "km";

  const setLanguage = async (language: "km" | "en") => {
    await i18n.changeLanguage(language);
  };

  return (
    <div className="language-switcher" role="group" aria-label="Language">
      <button
        type="button"
        className={
          currentLanguage === "km"
            ? "language-option active"
            : "language-option"
        }
        onClick={() => setLanguage("km")}
      >
        ខ្មែរ
      </button>

      <button
        type="button"
        className={
          currentLanguage === "en"
            ? "language-option active"
            : "language-option"
        }
        onClick={() => setLanguage("en")}
      >
        EN
      </button>
    </div>
  );
}
