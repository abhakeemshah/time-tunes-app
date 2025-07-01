
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
      type: 'USDT',
      address: 'TTkF8TxyvCoHhXTDE2cVnUrrRqT8jcAxZy',
      color: '#26a17b'
    },
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
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-2xl w-80"
        style={{ boxShadow: `0 25px 50px ${currentTheme.color}15, 0 0 0 1px rgba(255,255,255,0.1)` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-sora text-lg font-semibold text-white">
            Support the Project
          </h2>
          <Button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 text-white w-8 h-8 p-0 rounded-lg backdrop-blur-sm border border-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Mission statement */}
        <div className="text-center mb-6">
          <h3 className="font-sora text-base font-medium text-white mb-3">
            Buy me a subscription to an educational app
          </h3>
          <p className="text-white/70 text-sm leading-relaxed font-inter">
            International payments & student discounts are not available in my country (Pakistan).
          </p>
          <p className="text-white/60 text-xs mt-2 font-inter">
            Follow me on X: @100xd3v for premium content behind paywall
          </p>
        </div>

        {/* Wallet addresses */}
        <div className="space-y-3 mb-6">
          {wallets.map((wallet) => (
            <div 
              key={wallet.type}
              className="p-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white text-sm font-sora">{wallet.type}</span>
                <Button
                  onClick={() => copyToClipboard(wallet.address, wallet.type)}
                  className="bg-white/20 hover:bg-white/30 text-white w-7 h-7 p-0 rounded"
                >
                  {copiedAddress === wallet.type ? (
                    <Check className="w-3 h-3" style={{ color: currentTheme.color }} />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-white/60 font-mono break-all leading-relaxed">
                {wallet.address}
              </p>
            </div>
          ))}

          {/* Contact button */}
          <a
            href="mailto:abdhakeemshah@gmail.com"
            className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm p-3 rounded-lg flex items-center justify-center font-inter"
            style={{ boxShadow: `0 4px 15px ${currentTheme.color}20` }}
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact me
          </a>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-white/60 font-inter">
            Every contribution helps maintain this free tool ✨
          </p>
        </div>
      </div>
    </>
  );
};

export default DonationPopup;
