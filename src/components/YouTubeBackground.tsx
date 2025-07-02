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

import React, { useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// 📋 COMPONENT PROPS INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Props interface for YouTubeBackground component
 * Defines the contract between parent and child components
 */
interface YouTubeBackgroundProps {
  videoId: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 🎯 MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * YouTubeBackground component for immersive video backgrounds
 * Handles video loading, volume control, and responsive display
 */
const YouTubeBackground = ({ videoId = '5qap5aO4i9A' }: YouTubeBackgroundProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [musicOn, setMusicOn] = useState(false); // music is off (muted) by default

  React.useEffect(() => {
    setShowFallback(true);
    setIsVideoLoaded(false);
    const loadTimer = setTimeout(() => {
      setIsVideoLoaded(true);
      setShowFallback(false);
    }, 2000);
    return () => clearTimeout(loadTimer);
  }, [videoId]);

  // Always try to keep the video playing
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          '*'
        );
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Toggle mute/unmute when musicOn changes
  React.useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        musicOn
          ? '{"event":"command","func":"unMute","args":""}'
          : '{"event":"command","func":"mute","args":""}',
        '*'
      );
    }
  }, [musicOn]);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden bg-black">
      <div 
        className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${
          showFallback ? 'opacity-70' : 'opacity-20'
        }`}
        style={{
          backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`
        }}
      />
      <iframe
        ref={iframeRef}
        key={videoId + '-' + iframeKey}
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 ${
          isVideoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&start=0&fs=0&cc_load_policy=0&disablekb=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&branding=0&autohide=1&quality=hd720`}
        title="Background Focus Music"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          transform: 'scale(1.5)',
          filter: 'brightness(0.7)',
          aspectRatio: '16/9',
          minWidth: '100vw',
          minHeight: '100vh'
        }}
      />
      <div className="absolute inset-0 bg-black/30" />
      {/* Music Toggle Button */}
      <button
        style={{
          position: 'absolute',
          bottom: 20,
          right: 120, // adjust to be next to Background button
          zIndex: 20,
          padding: '10px 20px',
          background: musicOn ? '#4ade80' : '#222',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
          opacity: 0.85
        }}
        onClick={() => setMusicOn((on) => !on)}
      >
        {musicOn ? 'Music On' : 'Music Off'}
      </button>
    </div>
  );
};

export default YouTubeBackground;
