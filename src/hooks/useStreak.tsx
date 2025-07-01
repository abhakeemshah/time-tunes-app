/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 🔥 STREAK MANAGEMENT HOOK
 * ─────────────────────────────────────────────────────────────────────────────
 * 
 * PURPOSE:
 * Custom React hook for tracking user's consecutive Pomodoro completions
 * with persistent storage and daily reset logic. Provides achievement
 * tracking and motivation through streak counting.
 * 
 * FEATURES:
 * - Persistent streak tracking via localStorage
 * - Daily streak reset logic (resets if more than 1 day gap)
 * - Total session counting for overall statistics
 * - Automatic streak continuation for consecutive days
 * - Achievement milestone tracking
 * - Celebration system integration
 * 
 * STREAK LOGIC:
 * - Increment: +1 for each completed Pomodoro work session
 * - Reset: Automatic if more than 1 day gap between sessions
 * - Continuation: Maintains streak for consecutive days
 * - Persistence: Saves to localStorage for cross-session continuity
 * 
 * DATA STRUCTURE:
 * - count: Current consecutive streak number
 * - lastUpdate: Date string of last activity
 * - totalSessions: Lifetime completed sessions counter
 * 
 * USAGE:
 * ```tsx
 * const { streak, incrementStreak, resetStreak } = useStreak();
 * const newStreak = incrementStreak(); // Returns new streak count
 * ```
 */

import { useState, useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// 📋 TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * StreakData interface defining the complete streak information structure
 * Stored in localStorage and managed by the hook
 */
interface StreakData {
  count: number; // Current consecutive streak count
  lastUpdate: string; // Date string of last streak update (YYYY-MM-DD format)
  totalSessions: number; // Lifetime total of completed Pomodoro sessions
}

// ─────────────────────────────────────────────────────────────────────────────
// 🎯 MAIN HOOK FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * useStreak hook for managing Pomodoro completion streaks
 * Handles persistence, daily resets, and streak calculations
 * 
 * @returns Object containing streak data and management functions
 */
export const useStreak = () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // 🎛️ STATE INITIALIZATION
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Initialize streak state with default values
   * Will be overridden by localStorage data if available
   */
  const [streak, setStreak] = useState<StreakData>({
    count: 0, // Start with no streak
    lastUpdate: new Date().toDateString(), // Today's date
    totalSessions: 0 // No sessions completed yet
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 💾 PERSISTENCE LOADING EFFECT
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Load streak data from localStorage on component mount
   * Handles daily reset logic and streak continuation
   */
  useEffect(() => {
    const saved = localStorage.getItem('pomodoro-streak');
    
    if (saved) {
      try {
        const data: StreakData = JSON.parse(saved);
        const today = new Date().toDateString();
        
        // ─────────────────────────────────────────────────────────────────────────────
        // 📅 DAILY RESET LOGIC
        // ─────────────────────────────────────────────────────────────────────────────
        
        // Check if data is from today
        if (data.lastUpdate !== today) {
          // Calculate yesterday's date for streak continuation check
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          // If last update was not yesterday, reset streak (gap > 1 day)
          if (data.lastUpdate !== yesterday.toDateString()) {
            setStreak({
              count: 0, // Reset streak count
              lastUpdate: today, // Update to today
              totalSessions: data.totalSessions || 0 // Preserve total sessions
            });
          } else {
            // Continue streak from yesterday (update date only)
            setStreak({ ...data, lastUpdate: today });
          }
        } else {
          // Data is from today, use as-is
          setStreak(data);
        }
      } catch (error) {
        // Handle corrupted localStorage data
        console.error('Error parsing streak data:', error);
        setStreak({
          count: 0,
          lastUpdate: new Date().toDateString(),
          totalSessions: 0
        });
      }
    }
    // If no saved data, keep initial state
  }, []); // Run only on mount

  // ─────────────────────────────────────────────────────────────────────────────
  // 💾 PERSISTENCE SAVING EFFECT
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Save streak data to localStorage whenever it changes
   * Ensures data persistence across browser sessions
   */
  useEffect(() => {
    try {
      localStorage.setItem('pomodoro-streak', JSON.stringify(streak));
    } catch (error) {
      // Handle localStorage write errors (quota exceeded, etc.)
      console.error('Error saving streak data:', error);
    }
  }, [streak]); // Run whenever streak state changes

  // ─────────────────────────────────────────────────────────────────────────────
  // 🚀 STREAK MANAGEMENT FUNCTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Increment streak count for completed Pomodoro session
   * Updates count, date, and total sessions
   * 
   * @returns number - New streak count (useful for celebrations)
   */
  const incrementStreak = (): number => {
    const today = new Date().toDateString();
    
    setStreak(prev => ({
      count: prev.count + 1, // Increment streak
      lastUpdate: today, // Update to today's date
      totalSessions: prev.totalSessions + 1 // Increment total sessions
    }));
    
    // Return new count immediately for celebration triggers
    // Note: This uses current state + 1, not the updated state
    return streak.count + 1;
  };

  /**
   * Reset streak count to zero
   * Preserves total sessions count but resets streak
   * Useful for manual resets or testing
   */
  const resetStreak = (): void => {
    setStreak(prev => ({
      count: 0, // Reset streak to zero
      lastUpdate: new Date().toDateString(), // Update date
      totalSessions: prev.totalSessions // Preserve total sessions
    }));
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 🎁 HOOK RETURN VALUE
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Return object with streak data and management functions
   * Provides clean interface for components to use streak functionality
   */
  return {
    streak: streak.count, // Current streak count
    totalSessions: streak.totalSessions, // Lifetime total sessions
    incrementStreak, // Function to increment streak
    resetStreak // Function to reset streak
  };
};
