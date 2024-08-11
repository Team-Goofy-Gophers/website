import Cookies from "js-cookie";
import Script from "next/script";
import React from "react";

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: any;
      };
    };
    googleTranslateElementInit: () => void;
  }
}

const languages = [
  { label: "English", value: "en", src: "https://flagcdn.com/h60/us.png" },
  { label: "Hindi", value: "hi", src: "https://flagcdn.com/h60/us.png" },
  // { label: "Franch", value: "fr", src: "https://flagcdn.com/h60/us.png" },
  // Add additional languages as needed
];
const includedLanguages = languages.map((lang) => lang.value).join(",");

function googleTranslateElementInit() {
  new window.google.translate.TranslateElement(
    {
      pageLanguage: "auto",
      includedLanguages,
    },
    "google_translate_element",
  );
}
export const getPrefLangCookie = () => {
  return Cookies.get("googtrans") ?? "en";
};

// React components
function LanguageSelector({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  const langCookie = value.split("/")[2];
  return (
    <select
      className="notranslate"
      onChange={(e) => onChange(e.target.value)}
      value={langCookie}
    >
      {languages.map((it) => (
        <option value={it.value} key={it.value}>
          {it.label}
        </option>
      ))}
    </select>
  );
}

export default function GoogleTranslate({
  prefLangCookie,
}: {
  prefLangCookie: string;
}) {
  const [langCookie, setLangCookie] = React.useState(
    decodeURIComponent(prefLangCookie),
  );

  React.useEffect(() => {
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  React.useEffect(() => {
    console.log(prefLangCookie);
  }, [prefLangCookie]);

  const onChange = (value: string) => {
    const lang = "/en/" + value;
    setLangCookie(lang);
    const element = document.querySelector(
      ".goog-te-combo",
    ) as HTMLSelectElement;
    if (!element) return;
    element.value = value;
    element.dispatchEvent(new Event("change"));
  };

  return (
    <div>
      <div
        id="google_translate_element"
        style={{ visibility: "hidden", width: "1px", height: "1px" }}
      ></div>
      <LanguageSelector onChange={onChange} value={langCookie} />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </div>
  );
}
