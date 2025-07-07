'use client';

import { useState } from 'react';

export default function LanguageDropdown() {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => setOpen(!open);

  const switchLanguage = (code: string) => {
    console.log(`Switching to ${code}`);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center font-medium justify-center px-3 py-1.5 text-sm text-gray-900 rounded-lg hover:bg-gray-100 transition"
      >
        <span className="mr-2">🌐 EN</span>
        <svg
          className={`w-4 h-4 transform transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {[
            { label: "🇺🇸 English", code: "en" },
            { label: "🇷🇼 Kinyarwanda", code: "rw" },
            { label: "🇫🇷 Français", code: "fr" },
          ].map(({ label, code }) => (
            <li key={code}>
              <button
                onClick={() => switchLanguage(code)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
