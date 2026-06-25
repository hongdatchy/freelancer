'use client';

import { useRef, useState, useEffect } from 'react';

export default function PDFViewer({ fileUrl }: { fileUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Append URL parameters to default hide the left sidebar (navpanes=0) and fit horizontally
  // We use #view=FitH&navpanes=0
  const pdfUrl = `${fileUrl}#view=FitH&navpanes=0`;

  return (
    <div
      ref={containerRef}
      className={`w-full relative overflow-hidden rounded bg-[#323639] ${
        isFullscreen ? 'h-screen' : 'h-[600px]'
      }`}
    >
      <iframe
        src={pdfUrl}
        className="w-full h-full border-0"
        allowFullScreen
      />

      {/* Blocker & Custom Fullscreen Button 
          In Chromium PDF viewer, the top toolbar is 56px high and has bg-[#323639].
          We overlay a div on the top right to hide the Print and 3-dots buttons (approx 100px wide).
      */}
      <div className="absolute top-0 right-0 w-[110px] h-[56px] bg-[#323639] z-10 flex items-center justify-center">
        <button
          onClick={toggleFullscreen}
          className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
          title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
        >
          {isFullscreen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
