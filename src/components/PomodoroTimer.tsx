/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ⏱️ POMODORO TIMER COMPONENT
 * ─────────────────────────────────────────────────────────────────────────────
 * 
 * PURPOSE:
 * Core Pomodoro timer component with integrated music control and streak tracking.
 * Implements the Pomodoro Technique (25min work, 5min break cycles) with
 * celebration animations and background music integration.
 * 
 * FEATURES:
 * - Standard Pomodoro timing (25min work / 5min break)
 * - Integrated music volume control with mute toggle
 * - Streak tracking and celebration triggers
 * - Minimizable timer for distraction-free work
 * - Motivational quotes during work sessions
 * - Theme-aware UI with smooth animations
 * - Box animation for timer state changes
 * 
 * STATE MANAGEMENT:
 * - Timer state (minutes, seconds, active, session type)
 * - UI state (minimized, celebration visibility)
 * - Audio state (volume, mute status)
 * - Streak integration for achievement tracking
 * 
 * TIMER LOGIC:
 * - Countdown from session length to 0
 * - Auto-switch between work and break sessions
 * - Streak increment only on work session completion
 * - Celebration trigger on work session end
 * 
 * DEPENDENCIES:
 * - useTheme: For color theme integration
 * - useStreak: For achievement tracking
 * - MotivationalQuotes: For focus mode inspiration
 * - StreakCelebration: For achievement animations
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Music, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useStreak } from '@/hooks/useStreak';
import MotivationalQuotes from './MotivationalQuotes';
import StreakCelebration from './StreakCelebration';

// ─────────────────────────────────────────────────────────────────────────────
// 📋 TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * TimerState interface defines the complete state of the Pomodoro timer
 * - minutes/seconds: Current countdown time
 * - isActive: Whether timer is running
 * - isSession: True for work, false for break
 * - sessionLength/breakLength: Duration settings in minutes
 */
interface TimerState {
  minutes: number;
  seconds: number;
  isActive: boolean;
  isSession: boolean; // true = work session, false = break session
  sessionLength: number; // Work session duration (default: 25 minutes)
  breakLength: number; // Break session duration (default: 5 minutes)
}

/**
 * Component props interface
 * - volume: Current audio volume (0-100)
 * - onVolumeChange: Callback for volume changes
 */
interface PomodoroTimerProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// 🎯 MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const PomodoroTimer = ({ volume, onVolumeChange }: PomodoroTimerProps) => {
  // ─────────────────────────────────────────────────────────────────────────────
  // 🎨 HOOKS AND CONTEXT
  // ─────────────────────────────────────────────────────────────────────────────
  const { currentTheme } = useTheme(); // Get current color theme
  const { streak, incrementStreak } = useStreak(); // Get streak management functions
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 🎛️ STATE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────
  
  // Main timer state with default Pomodoro settings
  const [timer, setTimer] = useState<TimerState>({
    minutes: 25, // Start with 25-minute work session
    seconds: 0,
    isActive: false,
    isSession: true, // Start with work session
    sessionLength: 25, // 25-minute work sessions
    breakLength: 5, // 5-minute break sessions
  });
  
  // UI state management
  const [isMinimized, setIsMinimized] = useState(false); // Timer minimization state
  const [showCelebration, setShowCelebration] = useState(false); // Celebration visibility
  const [celebrationStreak, setCelebrationStreak] = useState(0); // Streak count for celebration
  const [isBoxOpen, setIsBoxOpen] = useState(true); // Box animation state
  
  // Ref for interval cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // ⏰ TIMER LOGIC EFFECT
  // ─────────────────────────────────────────────────────────────────────────────
  /**
   * Main timer countdown logic with streak integration
   * Runs every second when timer is active
   * Handles session completion and automatic session switching
   */
  useEffect(() => {
    if (timer.isActive) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          // Count down seconds
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } 
          // Count down minutes when seconds reach 0
          else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } 
          // Session completed (both minutes and seconds are 0)
          else {
            // Only increment streak for completed work sessions
            if (prev.isSession) {
              const newStreak = incrementStreak(); // Increment streak counter
              setCelebrationStreak(newStreak); // Set celebration count
              setShowCelebration(true); // Trigger celebration animation
            }
            
            // Switch to opposite session type (work <-> break)
            const newIsSession = !prev.isSession;
            const newMinutes = newIsSession ? prev.sessionLength : prev.breakLength;
            
            return {
              ...prev,
              minutes: newMinutes,
              seconds: 0,
              isSession: newIsSession,
              isActive: true, // Continue running for next session
            };
          }
        });
      }, 1000); // Update every second
    } else {
      // Clear interval when timer is paused
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    // Cleanup function to prevent memory leaks
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isActive, incrementStreak]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 🎮 CONTROL FUNCTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Toggle timer between play and pause states
   * When starting timer, automatically minimize to focus mode
   */
  const toggleTimer = () => {
    setTimer(prev => ({ ...prev, isActive: !prev.isActive }));
    // Minimize timer when starting for distraction-free work
    if (!timer.isActive) {
      setIsMinimized(true);
      setIsBoxOpen(false); // Close box animation
    } else {
      setIsBoxOpen(true); // Open box animation when pausing
    }
  };

  /**
   * Reset timer to initial state for current session type
   * Stops timer and restores full interface
   */
  const resetTimer = () => {
    setTimer(prev => ({
      ...prev,
      minutes: prev.isSession ? prev.sessionLength : prev.breakLength,
      seconds: 0,
      isActive: false,
    }));
    setIsMinimized(false); // Return to full interface
    setIsBoxOpen(true); // Open box animation
  };

  /**
   * Toggle audio mute state
   * When muting, set volume to 0; when unmuting, restore to 30
   */
  const handleVolumeToggle = () => {
    if (volume > 0) {
      // Currently has volume, so mute it
      onVolumeChange(0);
    } else {
      // Currently muted, so unmute to 30
      onVolumeChange(30);
    }
  };

  /**
   * Handle volume slider changes
   * Updates the volume and triggers parent callback
   */
  const handleVolumeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    onVolumeChange(newVolume);
  };

  /**
   * Format time for display (MM:SS format)
   * Ensures two-digit display with leading zeros
   */
  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Check if audio is muted (volume is 0)
  const isMuted = volume === 0;

  // ─────────────────────────────────────────────────────────────────────────────
  // 📱 MINIMIZED VIEW - FOCUS MODE
  // ─────────────────────────────────────────────────────────────────────────────
  /**
   * Minimized timer view for distraction-free work
   * Shows only essential information:
   * - Current time countdown
   * - Streak indicator
   * - Basic controls (pause/expand)
   * - Motivational quotes overlay
   */
  if (isMinimized && timer.isActive) {
    return (
      <>
        {/* Motivational quotes overlay for inspiration during work */}
        <MotivationalQuotes isVisible={true} />
        
        {/* Streak celebration overlay */}
        <StreakCelebration 
          isVisible={showCelebration}
          streakCount={celebrationStreak}
          onComplete={() => setShowCelebration(false)}
        />
        
        {/* Compact timer bar at top of screen */}
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-40">
          <div 
            className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-4 shadow-2xl w-80 h-16 animate-fade-in"
            style={{ 
              boxShadow: `0 16px 32px ${currentTheme.color}25, 0 0 0 1px rgba(255,255,255,0.1)`,
              background: `linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))`,
              backdropFilter: 'blur(24px) saturate(1.8)'
            }}
          >
            <div className="flex items-center justify-between h-full">
              {/* Timer display with theme-colored glow */}
              <div 
                className="font-sora text-2xl font-bold text-white"
                style={{ 
                  color: currentTheme.color,
                  textShadow: `0 0 3px ${currentTheme.color}40`
                }}
              >
                {formatTime(timer.minutes, timer.seconds)}
              </div>
              
              {/* Control buttons */}
              <div className="flex items-center gap-2">
                {/* Streak indicator */}
                <div className="flex items-center gap-1 text-white/60 text-sm">
                  🔥 {streak}
                </div>
                
                {/* Pause button */}
                <Button
                  onClick={toggleTimer}
                  className="text-white w-8 h-8 p-0 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.color}, ${currentTheme.color}dd)`,
                    boxShadow: `0 4px 12px ${currentTheme.color}40`
                  }}
                >
                  <Pause className="w-3 h-3" />
                </Button>
                
                {/* Expand button to return to full view */}
                <Button
                  onClick={() => setIsMinimized(false)}
                  className="bg-white/20 hover:bg-white/30 text-white w-8 h-8 p-0 rounded-xl"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 🎯 MAIN TIMER VIEW - FULL INTERFACE
  // ─────────────────────────────────────────────────────────────────────────────
  /**
   * Full timer interface showing all controls and information
   * Includes:
   * - Large time display
   * - Streak counter
   * - Play/pause and reset controls
   * - Integrated music volume control
   * - Box animation for state changes
   */
  return (
    <>
      {/* Hide motivational quotes in full view */}
      <MotivationalQuotes isVisible={false} />
      
      {/* Streak celebration overlay */}
      <StreakCelebration 
        isVisible={showCelebration}
        streakCount={celebrationStreak}
        onComplete={() => setShowCelebration(false)}
      />
      
      {/* Main timer container - centered on screen */}
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        {/* Timer Box with Animation */}
        <div 
          className={`backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl w-80 transition-all duration-500 ease-in-out ${
            isBoxOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-90'
          }`}
          style={{ 
            boxShadow: `0 24px 48px ${currentTheme.color}20, 0 0 0 1px rgba(255,255,255,0.1)`,
            background: `linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))`,
            backdropFilter: 'blur(24px) saturate(1.8)',
            transform: isBoxOpen ? 'scale(1)' : 'scale(0.95)',
          }}
        >
          <div className="text-center">
            {/* ─────────────────────────────────────────────────────────────────────────────
                🔥 STREAK DISPLAY
                ─────────────────────────────────────────────────────────────────────────────
                Shows current streak count with fire emoji
            */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex items-center gap-1 text-white/80">
                <span className="text-2xl">🔥</span>
                <span 
                  className="font-inter text-lg font-semibold"
                  style={{
                    textShadow: `0 0 3px ${currentTheme.color}30`
                  }}
                >
                  {streak}
                </span>
                <span className="font-inter text-sm">streak</span>
              </div>
            </div>
            
            {/* ─────────────────────────────────────────────────────────────────────────────
                ⏰ MAIN TIME DISPLAY
                ─────────────────────────────────────────────────────────────────────────────
                Large, prominent time display with theme-colored glow
            */}
            <div 
              className="font-sora text-5xl font-bold text-white mb-6"
              style={{ 
                color: currentTheme.color,
                textShadow: `0 0 6px ${currentTheme.color}40`
              }}
            >
              {formatTime(timer.minutes, timer.seconds)}
            </div>
          </div>
          
          {/* ─────────────────────────────────────────────────────────────────────────────
              🎮 CONTROL BUTTONS
              ─────────────────────────────────────────────────────────────────────────────
              Primary timer controls (play/pause, reset)
          */}
          <div className="flex justify-center gap-3 mb-4">
            {/* Play/Pause Button */}
            <Button
              onClick={toggleTimer}
              className="text-white px-6 py-3 rounded-2xl font-inter font-medium"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.color}, ${currentTheme.color}dd)`,
                boxShadow: `0 8px 16px ${currentTheme.color}40`
              }}
            >
              {timer.isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {timer.isActive ? 'Pause' : 'Start'}
            </Button>
            
            {/* Reset Button */}
            <Button
              onClick={resetTimer}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl font-inter font-medium"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PomodoroTimer;
