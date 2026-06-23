'use client';

import { useRef, useState, useEffect } from 'react';

export default function PPTViewer({ fileUrl }: { fileUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeWidthClass, setIframeWidthClass] = useState('w-full');

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);

      // Trick: Force the iframe to resize so it recalculates internal click coordinates
      // We change width slightly, then revert it back to w-full
      setIframeWidthClass('w-[99.9%]');
      setTimeout(() => {
        setIframeWidthClass('w-full');
      }, 100);
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

  return (
    <div
      ref={containerRef}
      className={`w-full bg-[#444444] relative overflow-hidden rounded ${
        isFullscreen ? 'h-screen' : 'h-[600px]'
      }`}
    >
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
        className={`${iframeWidthClass} h-full border-0 transition-all duration-75`}
        allowFullScreen
      />

      {/* Blocker & Custom Fullscreen Button 
          Matches the exact height of the Microsoft bottom bar (~28px).
          Using #444444 to match the typical dark gray. */}
      <div className="absolute bottom-0 right-0 w-[140px] h-[28px] bg-[#444444] z-10 flex items-center justify-end pr-3">
        <button
          onClick={toggleFullscreen}
          className="text-gray-300 hover:text-white p-1 rounded hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer h-full"
          title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
        >
          {isFullscreen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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
