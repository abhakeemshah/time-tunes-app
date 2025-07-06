/**
 * ─────────────────────────────────────────
 * 💭 MOTIVATIONAL QUOTES: Enhanced focus inspiration system with API integration
 * ─────────────────────────────────────────
 * 
 * Purpose: Display rotating motivational quotes fetched from free API with improved styling
 * Dependencies: React hooks for timing, smooth animations, fetch API
 * 
 * Features:
 * - Auto-changing quotes every 10 minutes (600,000ms)
 * - Fetches quotes from free API (quotable.io)
 * - Smooth fade transitions between quotes
 * - Italic quotes with quotation marks and authors
 * - Center positioning over video background
 * - Professional typography and styling
 * - Only shows in fullscreen/minimized mode
 * - Fallback to local quotes if API fails
 */

import React, { useState, useEffect } from 'react';

interface MotivationalQuotesProps {
  isVisible: boolean;
}

interface Quote {
  text: string;
  author: string;
}

// ─────────────────────────────────────────
// 💫 FALLBACK QUOTES: Local quotes for when API fails
// ─────────────────────────────────────────
const fallbackQuotes: Quote[] = [
  { text: "Excellence is not a skill, it's an attitude", author: "Ralph Marston" },
  { text: "Focus on progress, not perfection", author: "Unknown" },
  { text: "Great things never come from comfort zones", author: "Unknown" },
  { text: "Success is the sum of small efforts repeated daily", author: "Robert Collier" },
  { text: "The expert in anything was once a beginner", author: "Helen Hayes" },
  { text: "Discipline is choosing between what you want now and what you want most", author: "Abraham Lincoln" },
  { text: "Don't watch the clock; do what it does. Keep going", author: "Sam Levenson" },
  { text: "The way to get started is to quit talking and begin doing", author: "Walt Disney" },
  { text: "Concentrate all your thoughts upon the work at hand", author: "Alexander Graham Bell" },
  { text: "It does not matter how slowly you go as long as you do not stop", author: "Confucius" },
  { text: "Believe you can and you're halfway there", author: "Theodore Roosevelt" },
  { text: "The only impossible journey is the one you never begin", author: "Tony Robbins" },
  { text: "Success is walking from failure to failure with no loss of enthusiasm", author: "Winston Churchill" },
  { text: "Quality is not an act, it's a habit", author: "Aristotle" },
  { text: "Your limitation—it's only your imagination", author: "Unknown" }
];

const QUOTE_INTERVAL = 600000; // 10 minutes in milliseconds
const API_URL = 'https://api.quotable.io/random?tags=success|motivation|inspiration&maxLength=150';

const MotivationalQuotes = ({ isVisible }: MotivationalQuotesProps) => {
  const [quotes, setQuotes] = useState<Quote[]>(fallbackQuotes);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isQuoteVisible, setIsQuoteVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // ─────────────────────────────────────────
  // 🌐 FETCH QUOTES: Get quotes from free API
  // ─────────────────────────────────────────
  const fetchQuotes = async () => {
    try {
      setIsLoading(true);
      const fetchedQuotes: Quote[] = [];
      
      // Fetch 5 quotes from the API
      for (let i = 0; i < 5; i++) {
        const response = await fetch(API_URL);
        if (response.ok) {
          const data = await response.json();
          fetchedQuotes.push({
            text: data.content,
            author: data.author
          });
        }
      }
      
      // If we got quotes from API, use them; otherwise use fallback
      if (fetchedQuotes.length > 0) {
        setQuotes([...fetchedQuotes, ...fallbackQuotes]);
      }
    } catch (error) {
      console.log('Using fallback quotes due to API error:', error);
      // Keep using fallback quotes
    } finally {
      setIsLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // 🚀 INITIAL LOAD: Fetch quotes on component mount
  // ─────────────────────────────────────────
  useEffect(() => {
    if (isVisible) {
      fetchQuotes();
    }
  }, [isVisible]);

  // ─────────────────────────────────────────
  // ⏰ QUOTE ROTATION: Change quotes every 10 minutes
  // ─────────────────────────────────────────
  useEffect(() => {
    if (!isVisible) return;

    const quoteInterval = setInterval(() => {
      // Fade out current quote
      setIsQuoteVisible(false);
      
      // After fade out, change quote and fade in
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => 
          prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
        );
        setIsQuoteVisible(true);
      }, 500);
      
    }, QUOTE_INTERVAL);

    return () => clearInterval(quoteInterval);
  }, [isVisible, quotes.length]);

  // Don't render if not visible
  if (!isVisible) return null;

  const currentQuote = quotes[currentQuoteIndex];

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-20">
      <div 
        className={`text-center px-8 max-w-4xl transition-all duration-500 ease-in-out transform ${
          isQuoteVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {isLoading ? (
          <div className="text-white/40 text-lg animate-pulse">
            Loading inspiration...
          </div>
        ) : (
          <>
            <p 
              className="text-white font-light text-2xl md:text-3xl lg:text-4xl tracking-wide leading-relaxed italic mb-4"
              style={{
                opacity: 0.4,
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                fontFamily: 'Playfair Display, Georgia, serif',
                fontWeight: 300,
                letterSpacing: '0.01em',
                lineHeight: 1.4
              }}
            >
              "{currentQuote.text}"
            </p>
            <p 
              className="text-white/40 text-lg md:text-xl"
              style={{
                textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                opacity: 0.3,
                fontFamily: 'Playfair Display, Georgia, serif'
              }}
            >
              — {currentQuote.author}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default MotivationalQuotes;
