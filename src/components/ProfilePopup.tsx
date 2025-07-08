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
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  const socialLinks = [
    {
      icon: Instagram,
      url: 'https://instagram.com/hakeem.shxh',
      label: 'Instagram',
      color: '#E4405F'
    },
    {
      icon: XIcon,
      url: 'https://x.com/100xd3v',
      label: 'X (Twitter)',
      color: '#000000'
    },
    {
      icon: Mail,
      url: 'mailto:abdhakeemshah@gmail.com',
      label: 'Email',
      color: '#EA4335'
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
                className="font-sora text-2xl font-semibold text-white"
                style={{
                  textShadow: '0 4px 8px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
                  transform: 'translateZ(10px)'
                }}
              >
                Made with love
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
                  className="group w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 transform-gpu hover:scale-110 hover:-rotate-6 border border-white/20"
                  style={{ 
                    background: `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))`,
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 8px 20px ${currentTheme.color}25, inset 0 1px 0 rgba(255,255,255,0.2)`,
                    transform: 'translateZ(15px)',
                    transformStyle: 'preserve-3d'
                  }}
                  title={social.label}
                >
                  <social.icon 
                    className="w-7 h-7 text-white transition-all duration-300 group-hover:scale-110" 
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                      transform: 'translateZ(5px)'
                    }}
                  />
                </a>
              ))}
            </div>

            {/* Footer message with glow */}
            <div className="text-center">
              <p 
                className="text-lg text-white/90 font-inter font-medium"
                style={{
                  textShadow: `0 2px 8px ${currentTheme.color}40, 0 1px 2px rgba(0,0,0,0.3)`,
                  transform: 'translateZ(5px)'
                }}
              >
                Let's build something amazing together! 🚀
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePopup;
