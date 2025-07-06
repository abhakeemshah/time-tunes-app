/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 🏠 INDEX.TSX - MAIN APPLICATION ENTRY POINT
 * ─────────────────────────────────────────────────────────────────────────────
 * 
 * PURPOSE:
 * This is the main page component that serves as the entry point for the entire
 * TimeTunes Pomodoro application. It orchestrates all major components and handles
 * the overall application state management.
 * 
 * MAIN FEATURES:
 * - Pomodoro timer with streak tracking system
 * - YouTube background video integration with volume control
 * - Theme switching system (5 themes: 3 free, 2 premium)
 * - Background video selection with social gates
 * - Task management system
 * - User profile and donation systems
 * - Celebration animations for achievements
 * 
 * ARCHITECTURE:
 * - Uses React Context for theme management
 * - Implements custom hooks for streak tracking
 * - Manages global state for modals and UI elements
 * - Coordinates between multiple independent components
 * 
 * DEPENDENCIES:
 * - ThemeContext: For color theme management
 * - useStreak: Custom hook for tracking Pomodoro completions
 * - Multiple UI components for different features
 * 
 * STATE MANAGEMENT:
 * - Local state for UI visibility (modals, sidebars)
 * - Theme context for global color scheme
 * - Streak context for achievement tracking
 * - Volume and video selection state
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PomodoroTimer from '@/components/PomodoroTimer';
import YouTubeBackground from '@/components/YouTubeBackground';
import VideoSidebar from '@/components/VideoSidebar';
import TodosSection from '@/components/TodosSection';
import UserActions from '@/components/UserActions';
import ProfilePopup from '@/components/ProfilePopup';
import DonationPopup from '@/components/DonationPopup';
import StreakCelebration from '@/components/StreakCelebration';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { useStreak } from '@/hooks/useStreak';
import { videos } from '@/components/VideoSelector'; // Import the videos array for theme lookup

// ─────────────────────────────────────────────────────────────────────────────
// 📱 APP CONTENT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
/**
 * AppContent is the main application content that sits inside the ThemeProvider.
 * This separation allows the component to access theme context while still being
 * wrapped by the provider in the parent Index component.
 * 
 * RESPONSIBILITIES:
 * - Manages all application state (modals, video selection, volume)
 * - Handles Pomodoro completion events and streak celebrations
 * - Coordinates between different UI components
 * - Manages the overall layout and positioning of elements
 */
const AppContent = () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // 🎨 THEME AND STREAK MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────
  const { currentTheme, setTheme } = useTheme(); // Get current color theme and setTheme function
  const { streak, incrementStreak } = useStreak(); // Get streak data and increment function
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 🎛️ UI STATE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────
  // Modal visibility states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Video selection sidebar
  const [isProfileOpen, setIsProfileOpen] = useState(false); // User profile modal
  const [isDonationOpen, setIsDonationOpen] = useState(false); // Donation support modal
  
  // Media and content states
  const [selectedVideo, setSelectedVideo] = useState('OO2kPK5-qno'); // Current background video ID
  const [volume, setVolume] = useState(30); // Audio volume (0-100), start with sound
  
  // Achievement celebration states
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [celebrationStreak, setCelebrationStreak] = useState(0);

  // Ensure theme always matches selected background video
  useEffect(() => {
    if (!setTheme) return;
    // Find the theme for the selected video
    const video = videos.find(v => v.id === selectedVideo);
    setTheme(video?.theme || 'emerald');
  }, [selectedVideo, setTheme]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 🎯 EVENT HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  /**
   * Handles Pomodoro session completion
   * - Increments the user's streak count
   * - Triggers celebration animation
   * - Updates streak display
   */
  const handlePomodoroComplete = () => {
    const newStreak = incrementStreak(); // Increment and get new streak count
    setCelebrationStreak(newStreak); // Set celebration count
    setShowStreakCelebration(true); // Show celebration animation
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────────────────────
          🎬 BACKGROUND VIDEO LAYER
          ─────────────────────────────────────────────────────────────────────────────
          Full-screen YouTube video background with volume control.
          - Positioned with -z-10 to stay behind all other content
          - Integrated with volume slider from timer component
          - Auto-plays and loops selected video
      */}
      <YouTubeBackground 
        videoId={selectedVideo} 
        volume={volume}
        onVolumeChange={setVolume}
      />

      {/* ─────────────────────────────────────────────────────────────────────────────
          🔥 STREAK DISPLAY - TOP LEFT CORNER
          ─────────────────────────────────────────────────────────────────────────────
          Shows current streak count with fire emojis.
          - Displays up to 10 fire emojis for visual impact
          - Shows "+X" number for streaks over 10
          - Uses theme colors for glow effects
          - Positioned absolutely in top-left corner
      */}
      <div className="fixed top-4 left-4 z-30 flex items-center gap-2">
        {/* Render fire emojis for streak count (max 10 visible) */}
        {Array.from({ length: Math.min(streak, 10) }).map((_, i) => (
          <span key={i} className="text-2xl animate-pulse">🔥</span>
        ))}
        {/* Show additional count if streak > 10 */}
        {streak > 10 && (
          <span 
            className="text-white font-inter font-bold text-xl glow-number"
            style={{
              // Subtle glow effect using current theme color
              textShadow: `0 0 8px ${currentTheme.color}40, 0 0 4px ${currentTheme.color}20`,
              filter: `drop-shadow(0 0 3px ${currentTheme.color}30)`
            }}
          >
            +{streak - 10}
          </span>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          🎬 BACKGROUND SELECTOR BUTTON - BOTTOM RIGHT
          ─────────────────────────────────────────────────────────────────────────────
          Opens the video selection sidebar.
          - Wrapped in opacity container for consistent styling
          - Glassmorphism design with backdrop blur
          - Positioned in bottom-right corner
      */}
      <div className="fixed bottom-4 right-4 z-30">
        <Button
          onClick={() => setIsSidebarOpen(true)}
          className="px-6 py-3 rounded-2xl shadow-2xl border-2 transition-all duration-300 hover:scale-110 transform-gpu opacity-70 hover:opacity-100 font-sora font-medium"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.color}20, ${currentTheme.color}10)`,
            backdropFilter: 'blur(20px)',
            borderColor: `${currentTheme.color}40`,
            boxShadow: `0 8px 32px ${currentTheme.color}30, 0 0 0 1px rgba(255,255,255,0.1)`,
            color: 'white'
          }}
        >
          Background
        </Button>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          ⏱️ MAIN POMODORO TIMER - CENTER
          ─────────────────────────────────────────────────────────────────────────────
          Core timer component with integrated music control.
          - Handles work/break sessions
          - Integrated volume control
          - Celebration triggers
          - Minimizable for focus mode
      */}
      <PomodoroTimer 
        volume={volume}
        onVolumeChange={setVolume}
      />
      
      {/* ─────────────────────────────────────────────────────────────────────────────
          📂 VIDEO SELECTION SIDEBAR
          ─────────────────────────────────────────────────────────────────────────────
          Slide-in panel for background video selection.
          - Opens from right side with 3D animation
          - Auto-closes after selection
          - Theme switching integration
          - Social gates for premium videos
      */}
      <VideoSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedVideo={selectedVideo}
        onVideoSelect={setSelectedVideo}
      />
      
      {/* ─────────────────────────────────────────────────────────────────────────────
          📝 TASKS MANAGEMENT SECTION
          ─────────────────────────────────────────────────────────────────────────────
          Floating task management system.
          - Wrapped in opacity container for consistent styling
          - Modal-based task interface
          - Local storage persistence
          - Theme-aware design
      */}
      <div className="opacity-70 hover:opacity-100 transition-all duration-300">
        <TodosSection />
      </div>
      
      {/* ─────────────────────────────────────────────────────────────────────────────
          👤 USER ACTIONS - BOTTOM LEFT
          ─────────────────────────────────────────────────────────────────────────────
          Profile and donation buttons.
          - Wrapped in opacity container for consistent styling
          - Vertical button stack
          - Profile and donation modal triggers
      */}
      <div className="opacity-70 hover:opacity-100 transition-all duration-300">
        <UserActions 
          onProfileClick={() => setIsProfileOpen(true)}
          onDonationClick={() => setIsDonationOpen(true)}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          🎭 MODAL COMPONENTS
          ─────────────────────────────────────────────────────────────────────────────
          Overlay modals for user interactions.
          - Profile: Social links and contact information
          - Donation: Crypto wallets and support information
          - Conditional rendering based on state
      */}
      <ProfilePopup 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <DonationPopup 
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />

      {/* ─────────────────────────────────────────────────────────────────────────────
          🎉 STREAK CELEBRATION OVERLAY
          ─────────────────────────────────────────────────────────────────────────────
          Full-screen celebration animation for achievements.
          - Triggers on Pomodoro completion
          - 3-second duration with confetti effects
          - Milestone-based messages
          - Auto-hides after completion
      */}
      <StreakCelebration
        isVisible={showStreakCelebration}
        streakCount={celebrationStreak}
        onComplete={() => setShowStreakCelebration(false)}
      />

      {/* ─────────────────────────────────────────────────────────────────────────────
          💫 DYNAMIC GLOW STYLES
          ─────────────────────────────────────────────────────────────────────────────
          Injects CSS for theme-aware glow effects.
          - Uses current theme color for consistency
          - Applies to elements with 'glow-number' class
          - Subtle glow effect for better readability
      */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .glow-number {
            text-shadow: 0 0 8px ${currentTheme.color}40, 0 0 4px ${currentTheme.color}20, 0 0 2px ${currentTheme.color}10;
            filter: drop-shadow(0 0 3px ${currentTheme.color}30);
          }
        `
      }} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 MAIN INDEX COMPONENT - APPLICATION ROOT
// ─────────────────────────────────────────────────────────────────────────────
/**
 * The main Index component serves as the application root.
 * It wraps the entire application with the ThemeProvider to enable
 * theme context throughout the component tree.
 * 
 * STRUCTURE:
 * Index (ThemeProvider) -> AppContent (All Components)
 * 
 * This pattern allows AppContent to access theme context while
 * keeping the provider at the root level.
 */
const Index = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default Index;
