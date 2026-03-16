import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { GlobalHeader } from "@/components/GlobalHeader"; 
import { SecurityAuthModal } from "@/components/SecurityAuthModal"; 
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { PreviewProvider } from "@/admin/context/PreviewContext";
import CreatePost from "@/admin/pages/CreatePost";
import AdminArticlePreview from "@/admin/pages/AdminArticlePreview";
import AdminStudios from "@/admin/pages/AdminStudios";
import AdminFeatured from "@/admin/pages/AdminFeatured";
import AdminDashboard from "@/admin/pages/AdminDashboard";
import AdminPortfolios from "@/admin/pages/AdminPortfolios";
import { AdminGuard } from "@/admin/AdminGuard";

import FAQ from "./pages/FAQ";
import Index from "./pages/Index";
import About from "./pages/About";
import Documentary from "./pages/Documentary";
import Reviews from "./pages/Reviews";
import Portfolios from "./pages/Portfolios";
import Studios from "./pages/Studios";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ArticlePage from "./pages/ArticlePage";
import Podcast from "./pages/Podcast";
import AuthCallback from "./pages/AuthCallback";

const Opinion = () => <div className="pt-32 text-white text-center">Opinion Page Coming Soon</div>;

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/content/:type/:id" element={<ArticlePage />} />
        {/* OAuth2 callback route */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* Swapped Landing Page: Default is now Portfolios */}
        <Route path="/" element={<Portfolios />} />
        {/* Hidden Featured Page - moved from root */}
        {/* <Route path="/featured" element={<Index />} />  */}

        <Route path="/faq" element={<FAQ />} />
        
        <Route path="/about" element={<About />} />
        {/* <Route path="/documentary" element={<Documentary />} /> */}
        {/* <Route path="/reviews" element={<Reviews />} /> */}
        {/* <Route path="/podcast" element={<Podcast />} /> */}
        <Route path="/opinion" element={<Opinion />} />
        <Route path="/portfolios" element={<Portfolios />} />
        <Route path="/studios" element={<Studios />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin" element={<CreatePost/>} /> // Temporary admin route
        <Route 
            path="/admin/dashboard" 
            element={
                <AdminGuard>
                    <AdminDashboard />
                </AdminGuard>
            } 
        />
        <Route 
            path="/admin/create-post" 
            element={
                <AdminGuard>
                    <CreatePost />
                </AdminGuard>
            } 
        />
        <Route 
            path="/admin/studios" 
            element={
                <AdminGuard>
                    <AdminStudios />
                </AdminGuard>
            } 
        />
        <Route 
            path="/admin/featured" 
            element={
                <AdminGuard>
                    <AdminFeatured />
                </AdminGuard>
            } 
        />
        <Route 
            path="/admin/portfolios" 
            element={
                <AdminGuard>
                    <AdminPortfolios />
                </AdminGuard>
            } 
        />
        <Route path="/admin/preview" element={<AdminArticlePreview />} />
      </Routes>
    </AnimatePresence>
  );
};
const AppLayout = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { isAuthenticated } = useAuth(); 

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GlobalHeader 
          onLoginClick={() => setIsAuthOpen(true)}
          isAuthenticated={isAuthenticated}
        />
        <SecurityAuthModal 
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={() => setIsAuthOpen(false)}
        />
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PreviewProvider>
          <AppLayout />
        </PreviewProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;