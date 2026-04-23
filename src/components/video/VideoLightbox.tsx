'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VimeoVideo } from '@/types/vimeo';

interface VideoLightboxProps {
  videos: VimeoVideo[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoLightbox({
  videos,
  initialIndex,
  isOpen,
  onClose,
}: VideoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const current = videos[currentIndex];

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const goToNext = useCallback(() => {
    if (currentIndex < videos.length - 1) setCurrentIndex(currentIndex + 1);
  }, [currentIndex, videos.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToNext, goToPrevious]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!current) return null;

  const embedSrc = `${current.embedUrl}${current.embedUrl.includes('?') ? '&' : '?'}autoplay=1&title=0&byline=0&portrait=0`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <button
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white transition-colors p-2"
            onClick={onClose}
            aria-label="Close lightbox"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {currentIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white transition-colors p-2"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              aria-label="Previous video"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {currentIndex < videos.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white transition-colors p-2"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next video"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          <div
            className="flex items-center justify-center w-full h-full p-4 lg:p-12"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              key={current.id}
              className="relative w-full max-w-6xl"
              style={{ aspectRatio: current.aspectRatio }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <iframe
                src={embedSrc}
                className="absolute inset-0 w-full h-full rounded-lg"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={current.title}
              />
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pointer-events-none">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-white text-xl font-semibold mb-2">
                {current.title}
              </h2>
              {current.description && (
                <p className="text-white/80 text-sm mb-2 line-clamp-2">
                  {current.description}
                </p>
              )}
              <div className="text-white/60 text-sm">
                {currentIndex + 1} of {videos.length}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
