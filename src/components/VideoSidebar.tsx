/**
 * ─────────────────────────────────────────
 * 🎬 VIDEO SIDEBAR: 3D animated background video selection panel
 * ─────────────────────────────────────────
 * 
 * Purpose: Slide-in panel for selecting background videos with theme auto-switching
 * Dependencies: VideoSelector component, Lucide icons, useTheme
 * 
 * Features:
 * - Smooth 3D slide-in animation from right
 * - Auto theme switching based on video selection
 * - Advanced backdrop blur and glassmorphism
 * - Connected 3D animations with main interface
 * 
 * Animation Notes:
 * - Slide timing: 400ms cubic-bezier for smooth 3D effect
 * - Transform-gpu for hardware acceleration
 * - Perspective and 3D transforms
 */

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import VideoSelector from './VideoSelector';

interface VideoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVideo: string;
  onVideoSelect: (videoId: string) => void;
}

const VideoSidebar = ({ isOpen, onClose, selectedVideo, onVideoSelect }: VideoSidebarProps) => {
  const { setTheme } = useTheme();

  if (!isOpen) return null;

  // Map video theme to theme id for setTheme
  const themeMap: Record<string, string> = {
    'red-orange': 'red-orange',
    'emerald': 'emerald',
    'blue': 'blue',
    'purple': 'purple',
    'rose': 'rose',
    'yellow': 'red-orange', // Map yellow to red-orange (closest match)
  };

  // ─────────────────────────────────────────
  // 🎥 VIDEO SELECTION: Handle selection with theme auto-switching
  // ─────────────────────────────────────────
  const handleVideoSelect = (videoId: string, theme?: string) => {
    onVideoSelect(videoId);
    if (theme) {
      setTheme(themeMap[theme] || 'emerald');
    } else {
      setTheme('emerald');
    }
    onClose(); // Auto-close after selection with animation
  };

  return (
    <>
      {/* 3D Backdrop overlay with depth */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 opacity-100 pointer-events-auto"
        onClick={onClose}
        style={{
          backdropFilter: 'blur(8px) saturate(1.2)',
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.4), rgba(0,0,0,0.7))'
        }}
      />
      
      {/* 3D Sidebar panel - slides from right with perspective */}
      <div 
        className="fixed right-0 top-0 h-full w-80 z-50 shadow-2xl transform-gpu translate-x-0"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.08))',
          backdropFilter: 'blur(20px) saturate(1.5)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderLeft: '2px solid rgba(255,255,255,0.3)',
          transformOrigin: 'right center',
          perspective: '1000px',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.3), inset 1px 0 0 rgba(255,255,255,0.1)'
        }}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header with 3D effect */}
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-base drop-shadow-lg w-full text-center whitespace-nowrap"
              style={{
                fontFamily: 'Aliquam, cursive',
                color: 'white',
                textShadow: '0 4px 8px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
                transform: 'translateZ(10px)',
                letterSpacing: '0.04em',
              }}
            >
              Choose Background
            </h2>
            <Button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white w-10 h-10 p-0 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90 transform-gpu"
              style={{
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
                transform: 'translateZ(5px)'
              }}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Video grid with 3D container */}
          <div 
            className="flex-1 transform-gpu"
            style={{
              transform: 'translateZ(5px)',
              perspective: '1000px'
            }}
          >
            <VideoSelector
              selectedVideo={selectedVideo}
              onVideoSelect={handleVideoSelect}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoSidebar;
