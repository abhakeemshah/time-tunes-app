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

  // Todos always visible, no toggle button

  // State for toggling todos in full mode
  const [showTodos, setShowTodos] = useState(true); // visible by default

  // Ref for interval cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // Ref for alarm audio
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  // Refs for todo inputs
  const todoRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Handle Enter key to move to next todo
  const handleTodoKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (idx < todoRefs.length - 1) {
        todoRefs[idx + 1].current?.focus();
      }
    }
  };

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
    // Only minimize when starting, not when pausing
    if (!timer.isActive) {
      setIsMinimized(true);
      setIsBoxOpen(false); // Close box animation
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

  // Simple 3-item todo list for minimized mode
  const [todos, setTodos] = useState([
    { text: '', done: false },
    { text: '', done: false },
    { text: '', done: false },
  ]);
  const handleTodoChange = (idx: number, value: string) => {
    setTodos(todos => todos.map((todo, i) => i === idx ? { ...todo, text: value } : todo));
  };
  const handleTodoToggle = (idx: number) => {
    setTodos(todos => todos.map((todo, i) => i === idx ? { ...todo, done: !todo.done } : todo));
  };

  // Add a separate function for pause/resume in minimized bar
  const pauseResumeOnly = () => {
    setTimer(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 📱 MINIMIZED VIEW & MAIN BOX - ANIMATED TRANSITION
  // ─────────────────────────────────────────────────────────────────────────────
  // Both views are always mounted, but animate in/out for smooth transitions
  // Minimized view (focus mode)
  if (isMinimized) {
    return (
      <>
        {/* Simple 3-item todo list in minimized mode */}
        <div className="fixed inset-0 flex flex-col items-center justify-center z-40 w-full pointer-events-none">
          <div className="w-80 flex flex-col gap-4 items-center pointer-events-auto">
            {todos.map((todo, idx) => (
              <label key={idx} className="flex items-center w-full gap-3 cursor-pointer select-none">
                <span className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => handleTodoToggle(idx)}
                    className="appearance-none w-6 h-6 rounded-full transition-colors duration-200 focus:ring-0 focus:outline-none"
                    style={{
                      boxShadow: 'none',
                      outline: 'none',
                      border: 'none',
                      background: todo.done
                        ? `${currentTheme.color}44` // theme color, more transparent for dimmed effect
                        : 'rgba(255,255,255,0.10)', // subtle unfilled
                      borderRadius: '9999px',
                    }}
                  />
                  <span className={`absolute left-1 top-1 w-4 h-4 pointer-events-none ${todo.done ? 'todo-tick-animate' : ''}`} style={{display: 'inline-block', opacity: todo.done ? 1 : 0, transform: todo.done ? 'scale(1)' : 'scale(0.7)', transition: 'opacity 0.2s, transform 0.2s'}}>
                    <svg viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{width: '100%', height: '100%'}}>
                      <path d="M3 8l3 3 7-7" />
                    </svg>
                  </span>
                </span>
                <input
                  ref={todoRefs[idx]}
                  type="text"
                  value={todo.text}
                  onChange={e => handleTodoChange(idx, e.target.value)}
                  onKeyDown={e => handleTodoKeyDown(idx, e)}
                  maxLength={40}
                  className={`flex-1 bg-transparent font-light text-2xl md:text-3xl tracking-wide leading-relaxed py-2 px-2 focus:ring-0 focus:outline-none border-none shadow-none border-b ${todo.done ? 'line-through todo-completed' : ''}`}
                  style={{
                    color: todo.done ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,1)',
                    textShadow: '0 1.5px 6px rgba(0,0,0,0.18)',
                    opacity: 0.9,
                    fontWeight: 400,
                    letterSpacing: '0.01em',
                    lineHeight: 1.4,
                    boxShadow: 'none',
                    outline: 'none',
                    border: 'none',
                    background: 'transparent',
                    borderBottom: '1.5px solid rgba(255,255,255,0.18)',
                    fontFamily: `'Playfair Display', Georgia, serif`,
                    fontStyle: 'italic',
                    fontWeight: 300,
                    textDecoration: todo.done ? `line-through` : undefined,
                    textDecorationColor: todo.done ? currentTheme.color : undefined,
                    textDecorationThickness: todo.done ? '2px' : undefined,
                    transition: 'text-decoration-color 0.3s, color 0.3s, text-decoration-thickness 0.3s',
                    ...(todo.done ? { '--todo-strike': currentTheme.color } : {}),
                  }}
                />
              </label>
            ))}
          </div>
        </div>
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
                  onClick={pauseResumeOnly}
                  className="text-white w-8 h-8 p-0 rounded-xl active:scale-95 transition-transform duration-100"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.color}, ${currentTheme.color}dd)`,
                    boxShadow: `0 4px 12px ${currentTheme.color}40`
                  }}
                >
                  {timer.isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </Button>
                <Button
                  onClick={expandWithAnimation}
                  className="bg-white/20 hover:bg-white/30 text-white w-8 h-8 p-0 rounded-xl active:scale-95 transition-transform duration-100"
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
      <audio ref={alarmRef} src="/alram.mp3" preload="auto" />
      <MotivationalQuotes isVisible={false} />
      <div className="flex flex-col items-center justify-center h-screen p-0">
        <div 
          className={`backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl w-80 transition-all duration-800 ease-in-out ${
            isAnimatingIn ? 'animate-fade-in' : (!isMinimized && isBoxOpen) ? 'scale-100 opacity-100' : (isMinimized && !isBoxOpen) ? 'scale-95 opacity-90' : 'scale-100 opacity-100'
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
            <div className="flex justify-center gap-x-4 w-full mt-1">
              {/* Play/Pause Button */}
              <Button
                onClick={toggleTimer}
                className="text-white py-2 rounded-2xl font-inter font-medium text-base w-24 active:scale-95 transition-transform duration-100"
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
                className="bg-white/20 hover:bg-white/30 text-white py-2 rounded-2xl font-inter font-medium text-base w-24 active:scale-95 transition-transform duration-100"
              >
                <RotateCcw className="w-4 h-4 mr-0" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Tick and line-through animation styles */}
      <style>{`
        @keyframes tick-in {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .todo-tick-animate {
          animation: tick-in 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .todo-completed {
          position: relative;
          transition: color 0.3s;
        }
        .todo-completed::after {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          width: 100%; height: 2px;
          background: var(--todo-strike, #fff);
          opacity: 0.8;
          transform: scaleX(0);
          transform-origin: left;
          transition: background 0.3s;
          animation: line-draw-fill 0.5s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes line-draw-fill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </>
  );
};

export default PomodoroTimer;
