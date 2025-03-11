
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { X, UserPlus, LogIn } from 'lucide-react';

interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPrompt = ({ isOpen, onClose }: LoginPromptProps) => {
  const navigate = useNavigate();
  
  const handleSignUp = () => {
    navigate('/signup');
    onClose();
  };
  
  const handleLogin = () => {
    navigate('/login');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Join our coffee community</DialogTitle>
          <DialogDescription className="text-center">
            Create an account to rate coffees, save your favorites, and connect with coffee enthusiasts.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 h-14" 
            onClick={handleLogin}
          >
            <LogIn className="h-4 w-4" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold">Log In</span>
              <span className="text-xs text-muted-foreground">Welcome back</span>
            </div>
          </Button>
          <Button 
            className="flex items-center justify-center gap-2 h-14 bg-roast-500 hover:bg-roast-600" 
            onClick={handleSignUp}
          >
            <UserPlus className="h-4 w-4" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold">Sign Up</span>
              <span className="text-xs">Join the community</span>
            </div>
          </Button>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Maybe later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPrompt;
