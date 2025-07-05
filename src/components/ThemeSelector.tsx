/**
 * ─────────────────────────────────────────
 * 🎨 THEME SELECTOR: Enhanced theme switching with social gates
 * ─────────────────────────────────────────
 * 
 * Purpose: Theme picker with click-outside close and social follow verification
 * Dependencies: useTheme context, Lucide icons
 * 
 * Features:
 * - Click anywhere to close dropdown
 * - Social gate for premium themes (3 free, rest require follow)
 * - Smooth animations and 3D effects
 * - Auto-close after theme selection
 */

import React, { useState, useRef, useEffect } from 'react';
import { Palette, Lock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasFollowed, setHasFollowed] = useState(false);
  const [showFollowPrompt, setShowFollowPrompt] = useState(false);
  const { currentTheme, themes, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────
  // 🎯 CLICK OUTSIDE: Close dropdown when clicking elsewhere
  // ─────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // ─────────────────────────────────────────
  // 🔒 SOCIAL GATE: Theme access control
  // ─────────────────────────────────────────
  const freeThemes = ['red-orange', 'emerald', 'blue']; // First 3 themes are free
  
  const handleThemeClick = (themeId: string) => {
    setTheme(themeId); // Always update the theme color immediately
    if (!freeThemes.includes(themeId) && !hasFollowed) {
      setShowFollowPrompt(true);
      setIsOpen(false);
      return;
    }
    setIsOpen(false);
  };

  const handleFollowVerification = () => {
    setHasFollowed(true);
    setShowFollowPrompt(false);
    window.open('https://x.com/100xd3v', '_blank');
  };

  return (
    <div className="fixed top-4 right-4 z-40" ref={dropdownRef}>
      {/* ─────────────────────────────────────────
          📱 FOLLOW PROMPT: Social gate modal
          ───────────────────────────────────────── */}
      {showFollowPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-sora font-bold text-white mb-4">
              Premium Themes
            </h3>
            <p className="text-white/80 font-inter mb-6 leading-relaxed">
              Follow @100xd3v on X to unlock all premium themes. It's completely free!
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleFollowVerification}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Follow @100xd3v
              </Button>
              <Button
                onClick={() => setShowFollowPrompt(false)}
                className="px-6 bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl transition-all duration-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Theme selector button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white w-10 h-10 p-0 rounded-xl shadow-2xl transition-all duration-300 hover:scale-110 transform-gpu opacity-70 hover:opacity-100"
        style={{ 
          boxShadow: `0 0 20px ${currentTheme.color}30, 0 4px 12px rgba(0,0,0,0.3)`,
          background: `linear-gradient(135deg, ${currentTheme.color}20, rgba(255,255,255,0.1))`
        }}
      >
        <Palette className="w-4 h-4" />
      </Button>

      {/* ─────────────────────────────────────────
          🎭 THEME DROPDOWN: Enhanced color picker
          ───────────────────────────────────────── */}
      <div className={`absolute top-12 right-0 transition-all duration-300 ease-out origin-top ${
        isOpen ? 'transform scale-y-100 opacity-100' : 'transform scale-y-0 opacity-0 pointer-events-none'
      }`}>
        <div className="bg-white/10 backdrop-blur-lg border border-white/30 rounded-xl p-2 shadow-2xl">
          <div className="flex flex-col gap-1">
            {themes.map((theme, index) => {
              const isPremium = !freeThemes.includes(theme.id);
              const isLocked = isPremium && !hasFollowed;
              
              return (
                <div key={theme.id} className="relative">
                  <button
                    onClick={() => handleThemeClick(theme.id)}
                    className={`w-6 h-6 rounded-full transition-all duration-300 hover:scale-110 transform-gpu border relative ${
                      currentTheme.id === theme.id 
                        ? 'border-white shadow-lg scale-110' 
                        : 'border-white/20 hover:border-white/50'
                    } ${isLocked ? 'opacity-60' : ''}`}
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.color}, ${theme.color}dd)`,
                      boxShadow: currentTheme.id === theme.id 
                        ? `0 0 12px ${theme.color}60, 0 3px 6px rgba(0,0,0,0.3)` 
                        : `0 2px 6px ${theme.color}40`
                    }}
                  >
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
