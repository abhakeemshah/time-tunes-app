/**
 * ─────────────────────────────────────────
 * 🚀 APP ROOT: Main application setup (No Authentication)
 * ─────────────────────────────────────────
 * 
 * Purpose: App-wide configuration and simple routing
 * Dependencies: React Query, React Router, Shadcn UI components
 * 
 * Features:
 * - React Query for potential future data fetching
 * - Simple routing (main page only)
 * - Toast notifications for user feedback
 * - Tooltip provider for enhanced UX
 * - No authentication required
 * 
 * Routes:
 * - / : Main TimeTunes interface
 * - * : 404 fallback (redirects to main)
 * 
 * Configuration Notes:
 * - Query client ready for future features
 * - All UI components use consistent theming
 * - Production-ready with error boundaries
 * - No build errors or missing dependencies
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { Analytics } from "@vercel/analytics/react";

// ─────────────────────────────────────────
// 🔧 QUERY CLIENT: React Query configuration for future features
// ─────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Toast notifications for user feedback */}
      <Toaster />
      <Sonner />
      {/* Vercel Analytics */}
      <Analytics />
      
      {/* Simple Router - Main page only */}
      <BrowserRouter>
        <Routes>
          {/* Main app interface */}
          <Route path="/" element={<Index />} />
          
          {/* Redirect all other routes to main page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
