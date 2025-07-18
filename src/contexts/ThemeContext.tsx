/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 🎨 THEME CONTEXT - GLOBAL COLOR THEME MANAGEMENT
 * ─────────────────────────────────────────────────────────────────────────────
 * 
 * PURPOSE:
 * Centralized theme management system with social gating for premium themes.
 * Provides consistent color schemes across the entire application with
 * dynamic switching capabilities and premium tier access control.
 * 
 * FEATURES:
 * - 5 predefined color themes (3 free, 2 premium)
 * - Social verification system for premium access
 * - Dynamic gradient backgrounds with glow effects
 * - Consistent color application across components
 * - Context-based state management for global access
 * 
 * THEME STRUCTURE:
 * Each theme contains:
 * - id: Unique identifier
 * - primary/secondary: Main colors for UI elements
 * - accent: Border and highlight colors
 * - gradient: Background gradient definition
 * - color: Main theme color for effects
 * - glow: Drop shadow effects
 * - isPremium: Access control flag
 * 
 * SOCIAL GATING:
 * - Free themes: Available to all users
 * - Premium themes: Require X (Twitter) follow verification
 * - Graceful degradation for non-premium users
 * 
 * USAGE:
 * Wrap your app with <ThemeProvider> and use useTheme() hook
 * in components to access current theme and switching functions.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// 📋 TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Theme interface defining the structure of each color theme
 * Contains all necessary color information for consistent styling
 */
interface Theme {
  id: string; // Unique theme identifier
  primary: string; // Primary color class (e.g., 'bg-red-500')
  secondary: string; // Secondary color class
  accent: string; // Accent color for borders/highlights
  gradient: string; // Tailwind gradient classes
  color: string; // Hex color value for custom styling
  glow: string; // Drop shadow effect classes
  isPremium?: boolean; // Premium access flag
}

/**
 * Theme context type defining available methods and data
 */
interface ThemeContextType {
  currentTheme: Theme; // Currently active theme
  themes: Theme[]; // Array of all available themes
  setTheme: (themeId: string) => void; // Theme switching function
}

// ─────────────────────────────────────────────────────────────────────────────
// 🎭 THEME DEFINITIONS - COMPREHENSIVE COLOR PALETTE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Complete theme library with free and premium tiers
 * Free themes (3): red-orange, emerald, blue
 * Premium themes (2): purple, rose (require social follow)
 */
const themes: Theme[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 🆓 FREE TIER THEMES (Available to all users)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'red-orange', // 🔥 Default warm orange theme
    primary: 'bg-red-500',
    secondary: 'bg-red-400',
    accent: 'border-red-400/40',
    gradient: 'from-red-500 via-orange-500 to-yellow-500', // Warm sunset gradient
    color: '#ef4444', // Red-500 hex value
    glow: 'drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]' // Warm glow effect
  },
  {
    id: 'emerald', // 🌿 Nature-inspired green theme
    primary: 'bg-emerald-500',
    secondary: 'bg-emerald-400',
    accent: 'border-emerald-400/40',
    gradient: 'from-emerald-400 via-emerald-500 to-teal-600', // Forest gradient
    color: '#10b981', // Emerald-500 hex value
    glow: 'drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]' // Green glow effect
  },
  {
    id: 'blue', // 💙 Ocean-inspired blue theme
    primary: 'bg-blue-500',
    secondary: 'bg-blue-400',
    accent: 'border-blue-400/40',
    gradient: 'from-blue-400 via-blue-500 to-indigo-600', // Ocean gradient
    color: '#3b82f6', // Blue-500 hex value
    glow: 'drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]' // Blue glow effect
  },
  // New themes for video backgrounds
  {
    id: 'yellow',
    primary: 'bg-yellow-400',
    secondary: 'bg-yellow-300',
    accent: 'border-yellow-400/60',
    gradient: 'from-yellow-300 via-yellow-400 to-yellow-500',
    color: '#fde047',
    glow: 'drop-shadow-[0_0_20px_rgba(253,224,71,0.8)]'
  },
  {
    id: 'orange',
    primary: 'bg-orange-500',
    secondary: 'bg-orange-400',
    accent: 'border-orange-500/60',
    gradient: 'from-orange-400 via-orange-500 to-yellow-500',
    color: '#f59e42',
    glow: 'drop-shadow-[0_0_20px_rgba(245,158,66,0.8)]'
  },
  {
    id: 'red',
    primary: 'bg-red-600',
    secondary: 'bg-red-500',
    accent: 'border-red-600/60',
    gradient: 'from-red-500 via-red-600 to-pink-500',
    color: '#cfc64a',
    glow: 'drop-shadow-[0_0_20px_rgba(207,198,74,0.8)]'
  },
  {
    id: 'pink',
    primary: 'bg-pink-400',
    secondary: 'bg-pink-300',
    accent: 'border-pink-400/60',
    gradient: 'from-pink-300 via-pink-400 to-pink-500',
    color: '#ec4899',
    glow: 'drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]'
  },
  {
    id: 'custom-6ba5b5',
    primary: 'bg-[#6ba5b5]',
    secondary: 'bg-[#6ba5b5]/80',
    accent: 'border-[#6ba5b5]/40',
    gradient: 'from-[#6ba5b5] via-[#8fd3e8] to-[#b2eaf7]',
    color: '#6ba5b5',
    glow: 'drop-shadow-[0_0_20px_rgba(107,165,181,0.8)]',
  },
  {
    id: 'custom-cfa93a',
    primary: 'bg-[#cfa93a]',
    secondary: 'bg-[#cfa93a]/80',
    accent: 'border-[#cfa93a]/40',
    gradient: 'from-[#cfa93a] via-[#ffe066] to-[#fff3bf]',
    color: '#cfa93a',
    glow: 'drop-shadow-[0_0_20px_rgba(207,169,58,0.8)]',
  },
  {
    id: 'custom-bda348',
    primary: 'bg-[#bda348]',
    secondary: 'bg-[#bda348]/80',
    accent: 'border-[#bda348]/40',
    gradient: 'from-[#bda348] via-[#ffe066] to-[#fff3bf]',
    color: '#bda348',
    glow: 'drop-shadow-[0_0_20px_rgba(189,163,72,0.8)]',
  },
  {
    id: 'custom-adc75f',
    primary: 'bg-[#adc75f]',
    secondary: 'bg-[#adc75f]/80',
    accent: 'border-[#adc75f]/40',
    gradient: 'from-[#adc75f] via-[#d4e09b] to-[#f6f7d7]',
    color: '#adc75f',
    glow: 'drop-shadow-[0_0_20px_rgba(173,199,95,0.8)]',
  },
  {
    id: 'custom-f5da53',
    primary: 'bg-[#f5da53]',
    secondary: 'bg-[#f5da53]/80',
    accent: 'border-[#f5da53]/40',
    gradient: 'from-[#f5da53] via-[#fff6b7] to-[#fffbe6]',
    color: '#f5da53',
    glow: 'drop-shadow-[0_0_20px_rgba(245,218,83,0.8)]',
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 💎 PREMIUM TIER THEMES (Require social follow verification)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'purple', // 💜 Royal purple theme
    primary: 'bg-purple-500',
    secondary: 'bg-purple-400', 
    accent: 'border-purple-400/40',
    gradient: 'from-purple-400 via-purple-500 to-pink-600', // Royal gradient
    color: 'rgb(231,96,212)', // Purple-500 hex value
    glow: 'drop-shadow-[0_0_20px_rgba(231,96,212,0.8)]', // Purple glow effect
    isPremium: true // Requires social verification
  },
  {
    id: 'rose', // 🌹 Romantic rose theme
    primary: 'bg-rose-500',
    secondary: 'bg-rose-400',
    accent: 'border-rose-400/40',
    gradient: 'from-rose-400 via-rose-500 to-pink-600', // Romantic gradient
    color: '#f43f5e', // Rose-500 hex value
    glow: 'drop-shadow-[0_0_20px_rgba(244,63,94,0.8)]', // Rose glow effect
    isPremium: true // Requires social verification
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 🏗️ CONTEXT CREATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create React context for theme management
 * Initialized as undefined to force proper provider usage
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ─────────────────────────────────────────────────────────────────────────────
// 🎨 THEME PROVIDER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ThemeProvider component that wraps the app and provides theme context
 * Manages current theme state and provides theme switching functionality
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // ─────────────────────────────────────────────────────────────────────────────
  // 🎯 STATE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────
  
  // Initialize with first theme (red-orange) as default
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 🔄 THEME SWITCHING FUNCTION
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Theme switching function with validation
   * Finds theme by ID and updates current theme if found
   * Includes error handling for invalid theme IDs
   * 
   * @param themeId - Unique identifier of the theme to switch to
   */
  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      // Could add localStorage persistence here if needed
      // localStorage.setItem('selectedTheme', themeId);
    } else {
      console.warn(`Theme with ID '${themeId}' not found`);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 🎁 CONTEXT VALUE PREPARATION
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Context value object containing all theme-related data and functions
   * This is what components will receive when using useTheme()
   */
  const contextValue: ThemeContextType = {
    currentTheme, // Current active theme object
    themes, // Array of all available themes
    setTheme, // Function to switch themes
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 🎭 PROVIDER RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 🎣 CUSTOM HOOK FOR THEME ACCESS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Custom hook for accessing theme context
 * Provides type-safe access to theme data and functions
 * Includes error handling for usage outside of ThemeProvider
 * 
 * @returns ThemeContextType - Current theme data and switching functions
 * @throws Error if used outside of ThemeProvider
 * 
 * USAGE EXAMPLE:
 * ```tsx
 * const { currentTheme, setTheme } = useTheme();
 * const buttonStyle = { background: currentTheme.color };
 * ```
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  // Error handling for improper usage
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
