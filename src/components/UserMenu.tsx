import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, Settings, ShieldCheck, Loader2, Edit2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UpdatePortfolioModal } from "@/components/UpdatePortfolioModal";
import { portfolioService } from "@/services/portfolioService";
import { PortfolioDetail } from "@/types/portfolio";
import { toast } from "./ui/sonner";

interface UserMenuProps {
  isAuthenticated: boolean;
}

export function UserMenu({ isAuthenticated }: UserMenuProps) {
  const { dbUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Edit portfolio modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioDetail | null>(null);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      // Silent error handling - no console logs
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleOpenEditModal = async () => {
    setIsLoadingPortfolio(true);
    try {
      const data = await portfolioService.getMyPortfolio();
      if (data) {
        setEditingPortfolio(data);
        setIsEditModalOpen(true);
        setIsOpen(false);
      } else {
        toast.error("No portfolio found. Please create one first.");
      }
    } catch (error) {
      toast.error("Failed to load portfolio for editing");
    } finally {
      setIsLoadingPortfolio(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  // Show loading state while dbUser is loading
  if (!dbUser) {
    return (
      <button className="group relative flex items-center gap-3 bg-black/90 backdrop-blur-md border border-white/20 pl-1.5 pr-6 py-1.5 rounded-full hover:border-[#FFAB00] hover:shadow-[0_0_20px_rgba(255,171,0,0.3)] transition-all duration-300">
        {/* Icon Circle with spinner */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FFAB00]">
          <Loader2 className="w-5 h-5 text-black animate-spin" />
        </div>

        {/* Status Text */}
        <span className="hidden md:block font-display text-sm font-bold text-white uppercase leading-none tracking-wider">
          Loading...
        </span>
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* User Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 bg-black/90 backdrop-blur-md border border-white/20 pl-1.5 pr-6 py-1.5 rounded-full hover:border-[#FFAB00] hover:shadow-[0_0_20px_rgba(255,171,0,0.3)] transition-all duration-300"
      >
        {/* Icon Circle */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FFAB00] border-transparent">
          <ShieldCheck className="w-5 h-5 text-black" />
        </div>

        {/* Status Text */}
        <span className="hidden md:block font-display text-sm font-bold text-white uppercase leading-none tracking-wider group-hover:text-[#FFAB00] transition-colors">
          I'M IN
        </span>

        {/* Chevron Indicator */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="hidden md:block"
        >
          <svg
            className="w-4 h-4 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
          >
            {/* User Info Section */}
            <div className="px-4 py-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FFAB00] flex items-center justify-center">
                  <User className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  {/* <p className="font-display font-bold text-white uppercase text-sm truncate tracking-wider">
                    {dbUser.email?.split("@")[0] || "User"}
                  </p> */}
                  <p className="text-xs text-gray-400 truncate">{dbUser.email}</p>
                  {/* {dbUser.role !== "USER" && (
                    <p className="text-xs text-[#FFAB00] font-semibold uppercase mt-1">
                      {dbUser.role}
                      {dbUser.subscriptionType && ` • ${dbUser.subscriptionType}`}
                    </p>
                  )} */}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {/* Update Portfolio Option */}
              <button
                onClick={handleOpenEditModal}
                disabled={isLoadingPortfolio}
                className="w-full px-4 py-3 flex items-center gap-3 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingPortfolio ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Loading...</span>
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Update Portfolio</span>
                  </>
                )}
              </button>

              {/* Logout Option */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full px-4 py-3 flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Portfolio Modal */}
      {editingPortfolio && (
        <UpdatePortfolioModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingPortfolio(null);
          }}
          initialData={editingPortfolio}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setEditingPortfolio(null);
          }}
        />
      )}
    </div>
  );
}
