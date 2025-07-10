
import React from 'react';
import { User, Heart, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserActionsProps {
  onProfileClick: () => void;
  onDonationClick: () => void;
}

const UserActions = ({ onProfileClick, onDonationClick }: UserActionsProps) => {
  return (
    <div className="fixed bottom-4 left-4 z-30 flex flex-col gap-2">
      {/* Profile Button */}
      <Button
        onClick={onProfileClick}
        className="bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white w-10 h-10 p-0 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 drop-shadow-lg opacity-60 hover:opacity-100"
      >
        <User className="w-4 h-4" />
      </Button>

      {/* Donation Button */}
      <Button
        onClick={onDonationClick}
        className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 hover:bg-red-600/30 text-white w-10 h-10 p-0 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 drop-shadow-lg opacity-60 hover:opacity-100"
      >
        <Heart className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default UserActions;
