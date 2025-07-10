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
import MotivationalQuotes from './MotivationalQuotes';

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
  const [isBoxOpen, setIsBoxOpen] = useState(true); // Box animation state
  // Add state to control animate-in for main box
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  // Ref for interval cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // Ref for alarm audio
  const alarmRef = useRef<HTMLAudioElement | null>(null);

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
            
            // Play alarm
            if (alarmRef.current) {
              alarmRef.current.currentTime = 0;
              alarmRef.current.play();
            }
            // Do not auto-start next session; let user start manually
            // Switch session type, but set isActive: false
            const newIsSession = !prev.isSession;
            const newMinutes = newIsSession ? prev.sessionLength : prev.breakLength;
            
            return {
              ...prev,
              minutes: newMinutes,
              seconds: 0,
              isSession: newIsSession,
              isActive: false,
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
  }, [timer.isActive]);

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

  // Helper to expand with animation
  const expandWithAnimation = () => {
    setIsMinimized(false);
    setIsAnimatingIn(true);
    setTimeout(() => setIsAnimatingIn(false), 800); // Slower animate-in (was 500)
  };

  // Hide quotes during transition between minimized/full
  const showQuotes = isMinimized && timer.isActive;

  // ─────────────────────────────────────────────────────────────────────────────
  // 📱 MINIMIZED VIEW & MAIN BOX - ANIMATED TRANSITION
  // ─────────────────────────────────────────────────────────────────────────────
  // Both views are always mounted, but animate in/out for smooth transitions
  // Minimized view (focus mode)
  if (isMinimized && timer.isActive) {
    return (
      <>
        <MotivationalQuotes isVisible={true} />
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
              <div 
                className="font-sora text-2xl font-bold text-white"
                style={{ 
                  color: currentTheme.color,
                  textShadow: `0 0 3px ${currentTheme.color}40`
                }}
              >
                {formatTime(timer.minutes, timer.seconds)}
              </div>
              <div className="flex items-center gap-2">
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
                <Button
                  onClick={expandWithAnimation}
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
  // Main timer view (full interface)
  return (
    <>
      <audio ref={alarmRef} src="/alaram.m4a" preload="auto" />
      <MotivationalQuotes isVisible={false} />
      <div className="flex flex-col items-center justify-center h-screen p-0">
        <div 
          className={`backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl w-80 transition-all duration-800 ease-in-out ${
            isAnimatingIn ? 'animate-fade-in' : isBoxOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-90'
          }`}
          style={{
            boxShadow: `0 16px 32px ${currentTheme.color}20, 0 0 0 1px rgba(255,255,255,0.08)`,
            background: `rgba(255,255,255,0.10)`,
            backdropFilter: 'blur(32px) saturate(2)',
            width: '18rem',
            minWidth: '18rem',
            maxWidth: '18rem',
            height: '13rem',
            minHeight: '13rem',
            maxHeight: '13rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className="flex flex-col items-center justify-center flex-1 gap-1 w-full">
            <div
              className="font-sora text-7xl font-bold text-white text-center"
              style={{
                color: currentTheme.color,
                textShadow: `0 0 6px ${currentTheme.color}40`
              }}
            >
              {formatTime(timer.minutes, timer.seconds)}
            </div>
            <div className="flex justify-center gap-x-4 w-full">
              {/* Play/Pause Button */}
              <Button
                onClick={toggleTimer}
                className="text-white py-2 rounded-2xl font-inter font-medium text-base w-24"
                style={{
                  background: currentTheme.color,
                  boxShadow: `0 8px 16px ${currentTheme.color}40`
                }}
              >
                {timer.isActive ? <Pause className="w-4 h-4 mr-0" /> : <Play className="w-4 h-4 mr-0" />}
                {timer.isActive ? 'Pause' : 'Start'}
              </Button>
              {/* Reset Button */}
              <Button
                onClick={resetTimer}
                className="bg-white/20 hover:bg-white/30 text-white py-2 rounded-2xl font-inter font-medium text-base w-24"
              >
                <RotateCcw className="w-4 h-4 mr-0" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PomodoroTimer;
