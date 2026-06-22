'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function DevRibbon() {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setIsVisible(true);
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[999] flex items-center justify-between px-6 py-3"
      style={{
        background: 'linear-gradient(90deg, #92400e, #b45309, #d97706)',
        boxShadow: '0 -4px 20px rgba(180,83,9,0.3)',
      }}
    >
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 text-amber-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-amber-100 text-sm font-semibold font-headline tracking-wide">
          This website is currently under development. Some features may be incomplete or subject to change.
        </span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-amber-200 hover:text-white transition-colors ml-4 flex-shrink-0"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
