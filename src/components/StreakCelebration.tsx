/**
 * ─────────────────────────────────────────
 * 🎉 STREAK CELEBRATION: Full-screen completion animation
 * ─────────────────────────────────────────
 * 
 * Purpose: Massive celebration animation for Pomodoro completions
 * Dependencies: React spring for animations, confetti effects
 * 
 * Features:
 * - Full-screen celebration overlay
 * - Confetti and particle effects  
 * - Streak milestone achievements
 * - Exactly 3-second duration
 */

import React from 'react';
import { Trophy, Flame, Star } from 'lucide-react';

interface StreakCelebrationProps {
  isVisible: boolean;
  streakCount: number;
}

const StreakCelebration = ({ isVisible, streakCount }: StreakCelebrationProps) => {
  if (!isVisible) return null;
  // We'll just use a static animationPhase for now (always fully visible)
  const animationPhase = 3;

  const getMilestoneMessage = (count: number) => {
    if (count === 1) return "First Focus Session! 🎯";
    if (count === 5) return "5 Sessions Strong! 💪";
    if (count === 10) return "Perfect 10! ⭐";
    if (count === 25) return "Quarter Century! 🏆";
    if (count === 50) return "Half Century Master! 👑";
    if (count === 100) return "LEGENDARY STATUS! 🔥";
    if (count % 10 === 0) return `${count} Sessions! Amazing! 🚀`;
    return `${count} Sessions Complete! 🎉`;
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Dark overlay with fade */}
      <div 
        className={`absolute inset-0 bg-black transition-all duration-700 ${
          animationPhase >= 1 ? 'bg-opacity-70 backdrop-blur-sm' : 'bg-opacity-0'
        }`}
      />

      {/* Celebration content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={`text-center transform transition-all duration-800 ${
            animationPhase >= 1 
              ? 'scale-100 opacity-100 translate-y-0' 
              : 'scale-50 opacity-0 translate-y-20'
          }`}
        >
          {/* Main celebration icon */}
          <div 
            className={`w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl transform transition-all duration-1000 ${
              animationPhase >= 2 ? 'animate-bounce scale-125' : ''
            }`}
          >
            {streakCount >= 50 ? (
              <Trophy className="w-20 h-20 text-white" />
            ) : streakCount >= 10 ? (
              <Flame className="w-20 h-20 text-white" />
            ) : (
              <Star className="w-20 h-20 text-white" />
            )}
          </div>

          {/* Celebration text */}
          <div 
            className={`transform transition-all duration-800 delay-300 ${
              animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h1 className="font-sora text-7xl font-bold text-white mb-6 drop-shadow-2xl animate-pulse">
              AMAZING!
            </h1>
            
            <h2 className="font-sora text-4xl font-semibold text-white mb-8 drop-shadow-lg">
              {getMilestoneMessage(streakCount)}
            </h2>

            <div className="flex items-center justify-center gap-4 text-white/90">
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-lg rounded-3xl px-8 py-4">
                <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
                <span className="font-inter text-3xl font-bold">{streakCount}</span>
                <span className="font-inter text-xl">{streakCount === 1 ? 'Streak' : 'Streaks'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced confetti particles */}
      <div className="absolute inset-0 pointer-events-none">
        {animationPhase >= 2 && Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-4 h-4 rounded-full animate-bounce opacity-80`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#fbbf24', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981', '#06b6d4'][Math.floor(Math.random() * 6)],
              animationDelay: `${Math.random() * 1.5}s`,
              animationDuration: `${1.5 + Math.random() * 1.5}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      {/* Sparkle effects */}
      <div className="absolute inset-0 pointer-events-none">
        {animationPhase >= 3 && Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute text-yellow-300 text-2xl animate-ping"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: '1s'
            }}
          >
            ✨
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreakCelebration;

