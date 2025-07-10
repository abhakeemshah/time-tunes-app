/**
 * ─────────────────────────────────────────
 * 👤 PROFILE POPUP: Clean user profile with 3D animations
 * ─────────────────────────────────────────
 * 
 * Purpose: Simplified user profile modal with social links
 * Dependencies: useTheme, Lucide icons
 * 
 * Features:
 * - Social media links (Instagram, X, Email)
 * - 3D animated modal with smooth transitions
 * - Glassmorphism design language
 * - Theme-aware styling
 * - Hardware-accelerated animations
 * - Centered on screen
 * 
 * Animation Notes:
 * - Modal entrance: scale + fade (300ms)
 * - 3D transform effects on social buttons
 * - Smooth backdrop blur transitions
 */

import React from 'react';
import { X, Instagram, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfilePopup = ({ isOpen, onClose }: ProfilePopupProps) => {
  const { currentTheme } = useTheme();

  if (!isOpen) return null;

  // ─────────────────────────────────────────
  // 📱 SOCIAL LINKS: External profile links
  // ─────────────────────────────────────────
  const XIcon = () => (
    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  const GithubIcon = () => (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
    </svg>
  );

  const socialLinks = [
    {
      icon: Instagram,
      url: 'https://instagram.com/hakeem.shxh',
      label: 'Instagram',
      color: '#fff'
    },
    {
      icon: XIcon,
      url: 'https://x.com/100xd3v',
      label: 'X (Twitter)',
      color: '#fff'
    },
    {
      icon: Mail,
      url: 'mailto:abdhakeemshah@gmail.com',
      label: 'Email',
      color: '#fff'
    }
  ];

  return (
    <>
      {/* 3D Backdrop with depth */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-all duration-300 flex items-center justify-center p-4"
        onClick={onClose}
        style={{
          backdropFilter: 'blur(12px) saturate(1.5)',
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.4), rgba(0,0,0,0.7))'
        }}
      >
        {/* 3D Modal Container - Centered */}
        <div 
          className="w-80 transition-all duration-300 transform-gpu animate-fade-scale-in"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.10))',
            backdropFilter: 'blur(28px) saturate(1.8)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '28px',
            boxShadow: `0 40px 80px ${currentTheme.color}25, 0 0 0 1px rgba(255,255,255,0.15)`,
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            {/* Header with 3D effect */}
            <div className="flex items-center justify-between mb-8">
              <h2
                style={{
                  fontFamily: 'Aliquam, cursive',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  whiteSpace: 'nowrap',
                  color: 'white',
                  letterSpacing: '0.04em',
                  textAlign: 'center',
                  width: '100%',
                  textShadow: '0 4px 8px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
                  transform: 'translateZ(10px)'
                }}
              >
                Made with love <span style={{fontSize: '1.2em', color: '#ff5e8e'}}>♥</span>
              </h2>
              <Button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 text-white w-12 h-12 p-0 rounded-2xl backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110 hover:rotate-90 transform-gpu"
                style={{
                  transform: 'translateZ(5px)'
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* 3D Social Links Grid */}
            <div className="flex justify-center gap-6 mb-8">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    background: 'none',
                    border: 'none',
                    boxShadow: 'none',
                  }}
                  title={social.label}
                >
                  <social.icon
                    className="w-7 h-7 text-white transition-all duration-300 group-hover:scale-110"
                    style={{
                      color: '#fff',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                      transform: 'translateZ(5px)'
                    }}
                  />
                </a>
              ))}
            </div>

            {/* Footer message with glow */}
            <div className="flex flex-col items-center justify-center mb-2">
              <p
                className="text-xs text-white/80 font-inter text-center"
                style={{
                  whiteSpace: 'nowrap',
                  margin: 0,
                }}
              >
                Connect with me for more free tools like this
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePopup;
