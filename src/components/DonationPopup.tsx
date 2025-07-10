/**
 * ─────────────────────────────────────────
 * 💝 DONATION POPUP: Support and donation modal
 * ─────────────────────────────────────────
 * 
 * Purpose: Clean donation interface with crypto wallets
 * Dependencies: useTheme, Lucide icons, Clipboard API
 * 
 * Features:
 * - Crypto wallet addresses (USDT, BTC)
 * - One-click address copying
 * - Email contact option
 * - Clean modal without animations
 * - Theme-aware styling
 * 
 * Design Notes:
 * - Minimalist layout as requested
 * - Copy feedback with checkmark
 * - Educational app subscription context
 * - Clean typography with proper spacing
 * 
 * Customization:
 * - Add wallets: Update wallets array
 * - Change copy timeout: Modify setTimeout duration
 */

import React, { useState } from 'react';
import { X, Copy, Check, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface DonationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonationPopup = ({ isOpen, onClose }: DonationPopupProps) => {
  const { currentTheme } = useTheme();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  if (!isOpen) return null;

  // ─────────────────────────────────────────
  // 📋 COPY FUNCTION: Clipboard integration
  // ─────────────────────────────────────────
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(type);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  // ─────────────────────────────────────────
  // 💰 WALLET ADDRESSES: Crypto donation options
  // ─────────────────────────────────────────
  const wallets = [
    {
      type: 'BTC',
      address: '1J3fRTE2fJgMJ3e1Ava6tNkEZHbGK7CJkY',
      color: '#f7931a'
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-2xl border border-white/30 rounded-3xl p-6 shadow-2xl w-80"
        style={{ boxShadow: `0 25px 50px ${currentTheme.color}30, 0 0 0 1px rgba(255,255,255,0.1)` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-sora text-2xl font-bold text-white flex items-center gap-2"
            style={{
              fontFamily: 'Aliquam, cursive',
              fontWeight: 700,
              fontSize: '1rem',
              whiteSpace: 'nowrap',
              color: 'white',
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{ fontSize: 20 }}>💖</span> Support the Project
          </h2>
          <Button
            onClick={onClose}
            className="bg-white/30 hover:bg-white/40 text-white w-10 h-10 p-0 rounded-full shadow"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Mission statement */}
        <div className="text-center mb-4">
          <h3 className="font-sora text-base font-semibold text-white mb-2" style={{whiteSpace: 'nowrap'}}>
            Support us to keep this app free
          </h3>
        </div>

        {/* Wallet addresses */}
        <div className="space-y-3 mb-6">
          {wallets.map((wallet) => (
            <div 
              key={wallet.type}
              className="p-4 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 shadow-lg flex flex-col gap-1"
              style={{ boxShadow: `0 2px 12px ${wallet.color}30, 0 0 0 1px ${wallet.color}20` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-base font-sora flex items-center gap-2">
                  <span style={{ color: wallet.color, fontSize: 18 }}>💸</span>
                  {wallet.type}
                </span>
                <Button
                  onClick={() => copyToClipboard(wallet.address, wallet.type)}
                  className="bg-white/30 hover:bg-white/40 text-white w-8 h-8 p-0 rounded-full shadow"
                >
                  {copiedAddress === wallet.type ? (
                    <Check className="w-4 h-4" style={{ color: wallet.color }} />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-white/80 font-mono break-all leading-relaxed tracking-wide">
                {wallet.address}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-xs text-white/60 font-inter">
            Unfortunately, other international payments are not available in my region.
          </p>
        </div>
      </div>
    </>
  );
};

export default DonationPopup;
