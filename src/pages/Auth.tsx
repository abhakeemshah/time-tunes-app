
/**
 * ─────────────────────────────────────────
 * 🔐 AUTH PAGE: Login and signup forms
 * ─────────────────────────────────────────
 * 
 * Purpose: Handles user authentication with email verification
 * Dependencies: Supabase auth, React Hook Form
 * 
 * Features:
 * - Email/password signup with verification
 * - Login form with error handling
 * - Responsive design with theme integration
 * - Auto-redirect after successful auth
 * 
 * Note: Email verification required for signup
 * Disable in Supabase settings for faster testing
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const { signIn, signUp, user } = useAuth();
  const { currentTheme } = useTheme();
  const navigate = useNavigate();

  // ─────────────────────────────────────────
  // 🔄 AUTO REDIRECT: Send authenticated users home
  // ─────────────────────────────────────────
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // ─────────────────────────────────────────
  // 📧 FORM SUBMISSION: Handle login/signup
  // ─────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        // Login flow
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        }
      } else {
        // Signup flow with email verification
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Check your email for verification link!');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.color}20, transparent 50%, ${currentTheme.color}10)`
        }}
      />
      
      <div className="w-full max-w-md">
        <div 
          className="bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl p-8 shadow-2xl animate-fade-scale-in"
          style={{ boxShadow: `0 25px 50px ${currentTheme.color}15` }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-sora font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Join TimeTunes'}
            </h1>
            <p className="text-white/70 font-inter">
              {isLogin ? 'Sign in to sync your preferences' : 'Create account to save your progress'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-white/50"
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-white/50"
              />
            </div>

            {/* Error/Success messages */}
            {error && (
              <div className="text-red-400 text-sm font-inter text-center">
                {error}
              </div>
            )}
            
            {message && (
              <div className="text-green-400 text-sm font-inter text-center">
                {message}
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full font-inter font-medium transition-fast hover-scale"
              style={{ 
                background: `linear-gradient(135deg, ${currentTheme.color}, ${currentTheme.color}dd)`,
                boxShadow: `0 4px 15px ${currentTheme.color}40`
              }}
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </Button>
          </form>

          {/* Toggle between login/signup */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-white/70 hover:text-white font-inter transition-fast"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
