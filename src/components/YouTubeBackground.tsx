/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 📺 YOUTUBE BACKGROUND COMPONENT
 * ─────────────────────────────────────────────────────────────────────────────
 * 
 * PURPOSE:
 * Full-screen YouTube video background player with integrated volume control
 * and smooth loading transitions. Provides immersive ambient backgrounds
 * for focus sessions while maintaining audio control integration.
 * 
 * FEATURES:
 * - Full-screen responsive video scaling
 * - Smooth loading transitions with thumbnail fallback
 * - Integrated volume control with parent component
 * - Auto-retry mechanism for reliable playback
 * - Proper aspect ratio maintenance across devices
 * - Brightness filtering for better text readability
 * - Production-ready error handling
 * 
 * TECHNICAL IMPLEMENTATION:
 * - Uses YouTube Embed API with custom parameters
 * - PostMessage communication for video control
 * - Thumbnail preloading for smooth transitions
 * - Hardware-accelerated transforms for performance
 * - Backdrop overlay for text contrast
 * 
 * RESPONSIVENESS:
 * - Scale(1.5) transform for full coverage
 * - Maintains 16:9 aspect ratio
 * - Works across all screen sizes
 * - Optimized for performance on mobile devices
 * 
 * INTEGRATION:
 * - Receives volume props from parent timer component
 * - Communicates volume changes back to parent
 * - Supports video switching from sidebar component
 * - Coordinates with theme system for consistent experience
 */

import React, { useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// 📋 COMPONENT PROPS INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Props interface for YouTubeBackground component
 * Defines the contract between parent and child components
 */
interface YouTubeBackgroundProps {
  videoId: string; // YouTube video ID (e.g., 'OO2kPK5-qno')
  volume: number; // Audio volume level (0-100)
  onVolumeChange: (volume: number) => void; // Callback for volume changes
}

// ─────────────────────────────────────────────────────────────────────────────
// 🎯 MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * YouTubeBackground component for immersive video backgrounds
 * Handles video loading, volume control, and responsive display
 */
const YouTubeBackground = ({ videoId = '5qap5aO4i9A', volume, onVolumeChange }: YouTubeBackgroundProps) => {
  // ─────────────────────────────────────────────────────────────────────────────
  // 🎛️ COMPONENT STATE
  // ─────────────────────────────────────────────────────────────────────────────
  
  const iframeRef = useRef<HTMLIFrameElement>(null); // Reference to YouTube iframe
  const [isVideoLoaded, setIsVideoLoaded] = useState(false); // Video loading state
  const [showFallback, setShowFallback] = useState(true); // Thumbnail fallback visibility
  const lastPlayerState = useRef<number | null>(null);
  const [iframeKey, setIframeKey] = useState(0); // For force reloading iframe
  const bufferTimeout = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);
  const prevVolumeRef = useRef(volume);

  // ─────────────────────────────────────────────────────────────────────────────
  // 🔄 VIDEO LOADING AND CONTROL EFFECT
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Main effect for handling video loading and playback control
   * Runs when videoId or volume changes
   * Manages loading states and video communication
   */
  useEffect(() => {
    // ─────────────────────────────────────────────────────────────────────────────
    // 🎬 LOADING STATE RESET
    // ─────────────────────────────────────────────────────────────────────────────
    
    // Reset loading states when video changes
    setShowFallback(true); // Show thumbnail immediately
    setIsVideoLoaded(false); // Mark video as not loaded

    // ─────────────────────────────────────────────────────────────────────────────
    // ⏱️ LOADING TIMER
    // ─────────────────────────────────────────────────────────────────────────────
    
    /**
     * Auto-hide fallback and show video after 2 seconds
     * Provides smooth transition from thumbnail to video
     */
    const loadTimer = setTimeout(() => {
      setIsVideoLoaded(true); // Mark video as loaded
      setShowFallback(false); // Hide thumbnail fallback
    }, 2000); // 2-second loading delay

    // ─────────────────────────────────────────────────────────────────────────────
    // 🎵 PLAYBACK CONTROL SYSTEM
    // ─────────────────────────────────────────────────────────────────────────────
    
    /**
     * Interval for continuous video control
     * Ensures video plays with correct volume settings
     * Uses postMessage to communicate with YouTube iframe
     */
    const playbackInterval = setInterval(() => {
      if (iframeRef.current?.contentWindow) {
        try {
          if (volume === 0) {
            // Only mute, do not set volume
            iframeRef.current.contentWindow.postMessage(
              '{"event":"command","func":"mute","args":""}',
              '*'
            );
          } else {
            // If coming from muted, always unmute first
            if (prevVolumeRef.current === 0) {
              iframeRef.current.contentWindow.postMessage(
                '{"event":"command","func":"unMute","args":""}',
                '*'
              );
            }
            iframeRef.current.contentWindow.postMessage(
              `{"event":"command","func":"setVolume","args":[${volume}]}`,
              '*'
            );
          }
        } catch (error) {
          console.log('Video control:', error);
        }
      }
    }, 500);

    // Add event listener for YouTube Player API events
    function handleYouTubeEvents(event: MessageEvent) {
      if (!event.data) return;
      let data;
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      // Player is ready
      if (data.event === 'onReady' && iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          '*'
        );
      }
      // Player state change
      if (data.event === 'onStateChange') {
        lastPlayerState.current = data.info;
        isPlayingRef.current = data.info === 1;
        // 1 = playing, 2 = paused, 0 = ended, 3 = buffering, -1 = unstarted
        if (data.info !== 1 && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            '{"event":"command","func":"playVideo","args":""}',
            '*'
          );
        }
        // If buffering or unstarted for more than 3 seconds, reload iframe
        if ((data.info === 3 || data.info === -1) && bufferTimeout.current == null) {
          bufferTimeout.current = setTimeout(() => {
            setIframeKey(k => k + 1); // Force reload iframe
            bufferTimeout.current = null;
          }, 3000);
        } else if (data.info === 1 && bufferTimeout.current) {
          clearTimeout(bufferTimeout.current);
          bufferTimeout.current = null;
        }
      }
    }
    window.addEventListener('message', handleYouTubeEvents);

    // ─────────────────────────────────────────────────────────────────────────────
    // 🧹 CLEANUP FUNCTION
    // ─────────────────────────────────────────────────────────────────────────────
    
    /**
     * Cleanup timers when component unmounts or dependencies change
     * Prevents memory leaks and unnecessary operations
     */
    return () => {
      clearTimeout(loadTimer); // Clear loading timer
      clearInterval(playbackInterval); // Clear playback control interval
      window.removeEventListener('message', handleYouTubeEvents);
      if (bufferTimeout.current) clearTimeout(bufferTimeout.current);
    };
  }, [videoId, volume]); // Re-run when video or volume changes

  useEffect(() => {
    prevVolumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    // Check every second if the video is playing, if not, send play command
    const checkInterval = setInterval(() => {
      if (!isPlayingRef.current && iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          '*'
        );
      }
    }, 1000);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // 🎨 COMPONENT RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  
  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden bg-black">
      {/* ─────────────────────────────────────────────────────────────────────────────
          🖼️ THUMBNAIL FALLBACK LAYER
          ─────────────────────────────────────────────────────────────────────────────
          Shows video thumbnail during loading for smooth transition
          Uses YouTube's thumbnail API for high-quality images
      */}
      <div 
        className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${
          showFallback ? 'opacity-70' : 'opacity-20'
        }`}
        style={{
          // Use YouTube's maxresdefault thumbnail (highest quality)
          backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`
        }}
      />
      
      {/* ─────────────────────────────────────────────────────────────────────────────
          📹 YOUTUBE IFRAME PLAYER
          ─────────────────────────────────────────────────────────────────────────────
          Main video player with comprehensive configuration
          Optimized for background playback and user experience
      */}
      <iframe
        ref={iframeRef}
        key={videoId + '-' + iframeKey} // Force re-render when video changes or reload needed
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 ${
          isVideoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        src={`https://www.youtube.com/embed/${videoId}?${new URLSearchParams({
          autoplay: '1',
          mute: '1',
          loop: '1',
          playlist: videoId,
          controls: '0',
          showinfo: '0',
          rel: '0',
          iv_load_policy: '3',
          modestbranding: '1',
          playsinline: '1',
          start: '0',
          fs: '0',
          cc_load_policy: '0',
          disablekb: '1',
          enablejsapi: '1',
          origin: encodeURIComponent(window.location.origin),
          branding: '0',
          autohide: '1',
          quality: 'hd720'
        }).toString()}`}
        title="Background Focus Music"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          // ─────────────────────────────────────────────────────────────────────────────
          // 🎨 CUSTOM STYLING FOR FULL COVERAGE
          // ─────────────────────────────────────────────────────────────────────────────
          transform: 'scale(1.5)', // Scale up to fill screen completely
          filter: 'brightness(0.7)', // Darken for better text readability
          aspectRatio: '16/9', // Maintain video aspect ratio
          minWidth: '100vw', // Minimum full viewport width
          minHeight: '100vh' // Minimum full viewport height
        }}
      />
      
      {/* ─────────────────────────────────────────────────────────────────────────────
          🌑 READABILITY OVERLAY
          ─────────────────────────────────────────────────────────────────────────────
          Dark overlay to improve text contrast and readability
          Subtle effect that doesn't interfere with video experience
      */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Enable Audio Button */}
      {volume === 0 && (
        <button
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            zIndex: 10,
            padding: "10px 20px",
            background: "#222",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
          onClick={() => {
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage(
                '{"event":"command","func":"unMute","args":""}',
                '*'
              );
            }
            onVolumeChange(50);
          }}
        >
          Enable Audio
        </button>
      )}
    </div>
  );
};

export default YouTubeBackground;
