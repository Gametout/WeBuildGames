import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { MapPin, UserPlus, List, Grid, CheckCircle, Clock, XCircle, Zap, Search, Terminal, ChevronDown, Filter, Loader2, AlertCircle, RefreshCw, Crown, Sparkles, Shield, Lock, Calendar, Radio, Wifi, Cpu, Signal, Activity, Hexagon, Triangle, Circle, X, ArrowUp } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/PageTransition";
import { Footer } from "@/components/Footer";
import { CreatePortfolioModal } from "@/components/CreatePortfolioModal";
import { UpdatePortfolioModal } from "@/components/UpdatePortfolioModal";
import { ProfileViewModal } from "@/components/ProfileViewModal";
import { CompactHeader } from "@/components/CompactHeader";
// New Components for redesigned UI
import { BasicPortfolioCard } from "@/components/BasicPortfolioCard";
import { PremiumPortfolioCard } from "@/components/PremiumPortfolioCard";
import { ResponsiveMasonryGrid } from "@/components/MasonryGrid";
import { PricingModal } from "@/components/PricingModal";
import { ClassifiedOverlay } from "@/components/ClassifiedOverlay";
import MoreFiltersModal from "@/components/MoreFiltersModal";

// API Hooks
import { usePortfolios, usePortfolioRails } from "@/hooks/usePortfolios";
import { usePortfolioSearch } from "@/hooks/usePortfolioSearch";
import { useEliteAccess } from "@/hooks/useEliteAccess";
import { useAdvancedFilter } from "@/hooks/useAdvancedFilter";
import { Developer, PortfolioDetail, JobProfileStatus, PortfolioFilters } from "@/types/portfolio";

// Demo Data for showcasing new design
import { demoPortfolios, getDemoByCategory } from "@/data/demoPortfolios";
import { toast } from "sonner";
// Portfolio Service for API calls
import { portfolioService } from "@/services/portfolioService";
import { HeroTagline } from "@/components/HeroTagline";
import { useAuth } from "@/context/AuthContext";

// --- FILTER OPTIONS ---
// New categories first, then legacy ones
const roles = [
  // Programming
  "Gameplay Programmer", "Engine Programmer", "Graphics Programmer", "AI Programmer",
  "Network Engineer", "Multiplayer Engineer", "Tools Programmer", "Build Engineer",
  "DevOps Engineer", "Platform Engineer", "Physics Programmer", "UI Programmer",
  "AR/VR Developer", "Mobile Game Developer", "Backend Game Developer", "Online Services Engineer",
  // Art
  "Concept Artist", "Environment Artist", "Character Artist", "Prop Artist",
  "Texture Artist", "Lighting Artist", "Technical Artist", "Character Modeler",
  "Environment Modeler", "Cinematic Artist", "Motion Capture Artist", "Matte Painter",
  // Animation
  "3D Animator", "2D Animator", "Character Animator", "Gameplay Animator",
  "Technical Animator", "Motion Capture Animator",
  // Design
  "Game Designer", "Systems Designer", "Narrative Designer", "Combat Designer",
  "Economy Designer", "Monetization Designer", "Puzzle Designer", "Multiplayer Designer",
  // Audio
  "Audio Programmer", "Music Producer", "Dialogue Editor", "Foley Artist",
  // QA
  "QA Engineer", "QA Automation Engineer", "Game Tester", "Compatibility Tester",
  // Production
  "Associate Producer", "Executive Producer", "Release Manager", "Development Director",
  // Marketing/Community
  "Social Media Manager", "Publishing Manager", "Brand Manager", "PR Manager",
  // Operations
  "Live Ops Manager", "Game Operations Manager", "Event Manager",
  // Analytics
  "Monetization Analyst", "Game Data Analyst", "Data Scientist", "Player Insights Analyst", "Economy Analyst",
  // Writing/Localization
  "Localization Specialist", "Technical Writer", "Game Writer", "Lore Designer",
  // Other New
  "Esports Manager", "Playtest Coordinator", "Accessibility Designer", "User Researcher",
  // Legacy categories
  "Programmer", "Artist", "Designer", "Audio", "Producer", "Animator",
  "Community Manager", "Composer", "Level Designer", "Marketing Engineer",
  "Musician", "Product Manager", "QA Tester", "Project Manager", "Writer",
  "Sound Engineer", "Translator", "UI/UX Designer", "User Acquisition Engineer",
  "BizDev", "3D Artist", "VFX Artist", "Mentor", "Video Editor", "Other"
];

// Status options with display labels
const statusOptions: { value: JobProfileStatus; label: string; color: string }[] = [
  { value: JobProfileStatus.OPEN, label: "Open for Work", color: "#00FF88" },
  { value: JobProfileStatus.FREELANCE, label: "Freelance", color: "#00D4FF" },
  { value: JobProfileStatus.DEPLOYED, label: "Deployed", color: "#A855F7" },
];

// Rotating categories for the animated tagline
const rotatingCategories = [
  { text: "Game Developers", color: "#FFAB00" },
  { text: "Programmers", color: "#00FF88" },
  { text: "3D Artists", color: "#FF6B6B" },
  { text: "Game Designers", color: "#00D4FF" },
  { text: "Audio Engineers", color: "#A855F7" },
  { text: "Producers", color: "#F97316" },
];

// --- ANIMATED TAGLINE COMPONENT ---
const AnimatedTagline = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % rotatingCategories.length);
        setIsGlitching(false);
      }, 150);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentCategory = rotatingCategories[currentIndex];

  return (
    <div className="flex items-center gap-2 text-xs md:text-sm font-mono">
      <span className="text-gray-500">{'>'} The centralized mainframe of India's elite</span>
      <div className="relative inline-flex items-center min-w-[140px]">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`font-bold uppercase tracking-wide ${isGlitching ? "animate-pulse" : ""}`}
            style={{
              color: currentCategory.color,
              textShadow: `0 0 10px ${currentCategory.color}50, 0 0 20px ${currentCategory.color}30`,
            }}
          >
            {currentCategory.text}
          </motion.span>
        </AnimatePresence>

        {/* Glitch overlay effect */}
        {isGlitching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex items-center"
          >
            <span
              className="font-bold uppercase tracking-wide opacity-50"
              style={{
                color: currentCategory.color,
                transform: "translateX(2px)",
                filter: "blur(1px)"
              }}
            >
              {currentCategory.text}
            </span>
          </motion.div>
        )}
      </div>

      {/* Blinking cursor */}
      <motion.span
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
        className="text-[#FFAB00] font-bold"
      >
        _
      </motion.span>
    </div>
  );
};

// --- COMPACT HEADER COMPONENT ---
const DCompactHeader = ({
  onCreateProfile,
  isDemoMode,
  onToggleDemo
}: {
  onCreateProfile: () => void;
  isDemoMode: boolean;
  onToggleDemo: () => void;
}) => {
  return (
    <section className="px-4 md:px-8 max-w-7xl mx-auto mb-6 relative z-10">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between gap-4 mb-3 py-2 border-b border-white/5">
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"
            />
            <span className="text-[10px] font-mono text-green-400 uppercase tracking-wider">Live</span>
          </div>

          {/* Connection status */}
          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-gray-600">
            <Wifi className="w-3 h-3 text-[#FFAB00]" />
            <span>SECURE_CONNECTION</span>
            <span className="text-[#FFAB00]">//</span>
            <span>NODE_ACTIVE</span>
          </div>
        </div>

        {/* Demo Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggleDemo}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all ${isDemoMode
            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
            : "bg-white/5 text-gray-600 border border-white/10 hover:text-white"
            }`}
        >
          <Radio className="w-3 h-3" />
          {isDemoMode ? "Demo" : "Live"}
        </motion.button>
      </div>

      {/* Main Header Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Title & Tagline */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-3xl md:text-4xl text-white uppercase tracking-tight leading-none">
              Talent
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAB00] via-yellow-400 to-[#FFAB00] ml-2">
                Network
              </span>
            </h1>
          </div>
          <AnimatedTagline />
        </div>

        {/* Right: CTA Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onCreateProfile}
          className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FFAB00] to-[#FF8C00] text-black font-bold uppercase text-sm tracking-wide overflow-hidden rounded-sm shadow-[0_0_20px_rgba(255,171,0,0.3)] hover:shadow-[0_0_30px_rgba(255,171,0,0.5)] transition-shadow"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create Profile</span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
            animate={{ translateX: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        </motion.button>
      </div>
    </section>
  );
};

// --- COMPONENTS ---

const StatusBadge = ({ status }: { status: string }) => {
  let dotColor = "bg-gray-500";
  let bgColor = "bg-gray-500/10";
  let borderColor = "border-gray-500";
  let textColor = "text-gray-500";
  let shadowColor = "";

  // Check against enum values or label text
  if (status === "Open for Work" || status === "OPEN" || status === JobProfileStatus.OPEN) {
    dotColor = "bg-green-500";
    bgColor = "bg-green-500/10";
    borderColor = "border-green-500";
    textColor = "text-green-500";
    shadowColor = "shadow-[0_0_10px_#22c55e]";
  } else if (status === "Freelance" || status === "FREELANCE" || status === JobProfileStatus.FREELANCE) {
    dotColor = "bg-white";
    bgColor = "bg-white/10";
    borderColor = "border-white";
    textColor = "text-white";
    shadowColor = "shadow-[0_0_10px_#ffffff]";
  } else if (status === "Deployed" || status === "DEPLOYED" || status === JobProfileStatus.DEPLOYED) {
    dotColor = "bg-red-500";
    bgColor = "bg-red-500/10";
    borderColor = "border-red-500";
    textColor = "text-red-500";
    shadowColor = "shadow-[0_0_10px_#ef4444]";
  }

  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${bgColor} border ${borderColor} text-[10px] font-bold uppercase tracking-wider ${textColor}`}>
      <span className={`w-2 h-2 rounded-full ${dotColor} ${shadowColor}`}></span>
      {status}
    </div>
  );
};

// Tactical Row for list view
const TacticalRow = ({ dev, onClick, isRestricted, onUnlock }: {
  dev: Developer;
  onClick: () => void;
  isRestricted?: boolean;
  onUnlock?: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="group flex flex-col md:flex-row items-center gap-4 p-4 bg-black/40 border border-white/5 hover:border-[#FFAB00] rounded-sm transition-all duration-200 hover:bg-white/5 cursor-pointer relative"
    onClick={isRestricted ? onUnlock : onClick}
  >
    {dev.isPremium && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFAB00] shadow-[0_0_10px_#FFAB00]" />}
    <div className="flex items-center gap-4 w-full md:w-1/4">
      <img src={dev.avatar} alt={dev.name} className="w-10 h-10 rounded-full object-cover border border-white/20" loading="lazy" />
      <div>
        <h4 className="font-bold uppercase tracking-wider text-white text-lg leading-none flex items-center gap-2">
          {dev.name}
          {dev.isPremium && <Crown className="w-4 h-4 text-[#FFAB00]" />}
        </h4>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <MapPin className="w-3 h-3" /> {dev.location}
        </div>
      </div>
    </div>
    <div className="w-full md:w-1/4">
      <div className="text-[#FFAB00] font-bold text-sm mb-1">{dev.role}</div>
      <div className="flex gap-1 flex-wrap">
        {dev.badges.map((b: string, i: number) => (
          <span key={i} className="text-[10px] bg-white/10 px-1 rounded text-gray-300">{b}</span>
        ))}
      </div>
    </div>
    <div className="w-full md:w-1/6 flex items-center gap-6 font-mono text-sm">
      {isRestricted ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Lock className="w-4 h-4" />
          <span className="text-xs">Classified</span>
        </div>
      ) : (
        <>
          <div className="text-gray-400">
            <span className="block text-[10px] uppercase">EXP</span>
            <span className="text-white">{dev.exp}</span>
          </div>
          <div className="text-gray-400">
            <span className="block text-[10px] uppercase">Rate</span>
            <span className="text-white">{dev.rate || "N/A"}</span>
          </div>
        </>
      )}
    </div>
    <div className="w-full md:w-1/3 flex items-center justify-between gap-4">
      <StatusBadge status={dev.status} />
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-white/5 hover:bg-[#FFAB00] hover:text-black text-xs font-bold uppercase border border-white/10 transition-colors">
          {isRestricted ? "Unlock" : "View"}
        </button>
      </div>
    </div>
  </motion.div>
);

// SKELETON LOADER for cards
const CardSkeleton = () => (
  <div className="w-[280px] h-[280px] bg-black/40 border border-white/5 rounded-xl animate-pulse">
    <div className="p-6 flex flex-col h-full items-center justify-center">
      <div className="w-20 h-20 rounded-full bg-white/10 mb-4" />
      <div className="w-32 h-5 bg-white/10 rounded mb-2" />
      <div className="w-24 h-4 bg-white/10 rounded mb-4" />
      <div className="w-20 h-8 bg-white/10 rounded" />
    </div>
  </div>
);

// ERROR STATE component
const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <AlertCircle className="w-16 h-16 text-red-500/50 mb-4" />
    <h3 className="font-display text-2xl text-white mb-2">CONNECTION FAILED</h3>
    <p className="text-gray-500 font-mono mb-6">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-6 py-3 bg-[#FFAB00] text-black font-bold uppercase hover:bg-white transition-colors"
      >
        <RefreshCw className="w-4 h-4" /> Retry Connection
      </button>
    )}
  </div>
);

// EMPTY STATE component
const EmptyState = ({ category }: { category: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <Terminal className="w-16 h-16 text-gray-700 mb-4" />
    <h3 className="font-display text-2xl text-white mb-2">NO OPERATIVES FOUND</h3>
    <p className="text-gray-500 font-mono">
      No portfolios in {category === "All" ? "the database" : `${category} division`} yet.
    </p>
  </div>
);

// More Categories Button Component (Multi-select) - Desktop
const MoreCategoriesButton = ({
  roles,
  activeCategories,
  onCategoryToggle
}: {
  roles: string[];
  activeCategories: string[];
  onCategoryToggle: (role: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoles = useMemo(() => {
    return roles.filter(role =>
      role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [roles, searchTerm]);

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-lg bg-white/[0.03] text-gray-500 hover:text-white hover:bg-white/[0.07] border border-transparent hover:border-white/[0.08] flex items-center gap-1"
        whileTap={{ scale: 0.95 }}
      >
        More <ChevronDown className="w-3 h-3" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute left-0 mt-2 w-64 bg-[#0a0a0a] border border-[#FFAB00]/30 rounded-lg shadow-2xl z-50"
              style={{
                boxShadow: '0 10px 50px rgba(0,0,0,0.8), 0 0 20px rgba(255,171,0,0.1)',
              }}
            >
              {/* Search input inside dropdown */}
              <div className="p-2 border-b border-white/10">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search categories..."
                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFAB00]/50 transition-all duration-300 font-mono placeholder:text-gray-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <Search className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Categories list */}
              <div className="max-h-60 overflow-y-auto p-1">
                {filteredRoles.length > 0 ? (
                  filteredRoles.map((role) => {
                    const isSelected = activeCategories.includes(role);
                    return (
                      <motion.button
                        key={role}
                        type="button"
                        onClick={() => onCategoryToggle(role)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2 rounded ${isSelected
                          ? 'bg-[#FFAB00]/20 text-[#FFAB00] font-bold'
                          : 'text-gray-300'
                          }`}
                        whileHover={{ x: 4 }}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-[#FFAB00] border-[#FFAB00]' : 'border-gray-600'}`}>
                          {isSelected && <CheckCircle className="w-3 h-3 text-black" />}
                        </div>
                        <span className="uppercase">{role}</span>
                      </motion.button>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No categories found
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Mobile Category Search Button - Bottom Sheet Style
const MobileCategorySearchButton = ({
  roles,
  activeCategories,
  onCategoryToggle,
  onClearAll
}: {
  roles: string[];
  activeCategories: string[];
  onCategoryToggle: (role: string) => void;
  onClearAll: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoles = useMemo(() => {
    return roles.filter(role =>
      role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [roles, searchTerm]);

  const selectedCount = activeCategories.length;

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`relative whitespace-nowrap px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 rounded-lg shrink-0 flex items-center gap-1.5 border ${
          selectedCount > 0
            ? "bg-[#FFAB00]/20 text-[#FFAB00] border-[#FFAB00]/40"
            : "bg-white/[0.05] text-gray-300 border-white/[0.1] hover:border-[#FFAB00]/30"
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <Search className="w-3 h-3" />
        <span>Categories</span>
        {selectedCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 bg-[#FFAB00] text-black text-[10px] rounded-full font-bold">
            {selectedCount}
          </span>
        )}
      </motion.button>

      {/* Bottom Sheet Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a] border-t border-[#FFAB00]/30 rounded-t-2xl max-h-[85vh] flex flex-col"
              style={{
                boxShadow: '0 -10px 50px rgba(0,0,0,0.8), 0 0 30px rgba(255,171,0,0.1)',
              }}
            >
              {/* Handle bar */}
              <div className="flex justify-center py-3">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-4 pb-3 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-lg text-white uppercase tracking-wide flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#FFAB00]" />
                    Select Categories
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Search input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search categories..."
                    className="w-full bg-white/[0.06] border border-white/[0.1] rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFAB00]/50 transition-all duration-300 font-mono placeholder:text-gray-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <Search className="w-4 h-4" />
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Selected chips */}
                {selectedCount > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {activeCategories.slice(0, 5).map(cat => (
                      <motion.button
                        key={cat}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={() => onCategoryToggle(cat)}
                        className="flex items-center gap-1 px-2 py-1 bg-[#FFAB00]/20 border border-[#FFAB00]/30 rounded-full text-[#FFAB00] text-[10px] font-bold uppercase"
                      >
                        {cat}
                        <X className="w-3 h-3" />
                      </motion.button>
                    ))}
                    {selectedCount > 5 && (
                      <span className="px-2 py-1 text-[10px] text-gray-500">+{selectedCount - 5} more</span>
                    )}
                    <button
                      onClick={onClearAll}
                      className="px-2 py-1 text-[10px] text-red-400 hover:text-red-300 uppercase font-bold"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              {/* Categories list */}
              <div className="flex-1 overflow-y-auto p-2">
                {filteredRoles.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1">
                    {filteredRoles.map((role) => {
                      const isSelected = activeCategories.includes(role);
                      return (
                        <motion.button
                          key={role}
                          type="button"
                          onClick={() => onCategoryToggle(role)}
                          className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 rounded-lg ${
                            isSelected
                              ? 'bg-[#FFAB00]/20 text-[#FFAB00]'
                              : 'text-gray-300 hover:bg-white/5'
                          }`}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#FFAB00] border-[#FFAB00]' : 'border-gray-600'
                          }`}>
                            {isSelected && <CheckCircle className="w-3 h-3 text-black" />}
                          </div>
                          <span className="uppercase font-medium">{role}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <Search className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">No categories found</p>
                  </div>
                )}
              </div>

              {/* Footer with Done button */}
              <div className="p-4 border-t border-white/10 bg-[#0a0a0a]">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 bg-[#FFAB00] text-black font-bold uppercase text-sm tracking-wide rounded-lg"
                >
                  Done {selectedCount > 0 && `(${selectedCount} selected)`}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const Portfolios = () => {
  // Multi-filter state (replaces single activeRole)
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeStatuses, setActiveStatuses] = useState<JobProfileStatus[]>([]);

  // Advanced filter modal state
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const [usingAdvancedFilter, setUsingAdvancedFilter] = useState(false);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [selectedDev, setSelectedDev] = useState<Developer | null>(null);
  const [selectedDevId, setSelectedDevId] = useState<number | null>(null);
  const [showClassified, setShowClassified] = useState(false);

  const [myProfileData, setMyProfileData] = useState<any>(null);
  const [isFetchingMyProfile, setIsFetchingMyProfile] = useState(false);

  // Update portfolio modal states
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatePortfolioData, setUpdatePortfolioData] = useState<PortfolioDetail | null>(null);

  // Environment-controlled demo mode
  const showDemoFeature = import.meta.env.VITE_SHOW_DEMO === 'true';
  const [isDemoMode, setIsDemoMode] = useState(showDemoFeature);
  // Portfolio count state
  const [totalProfiles, setTotalProfiles] = useState(0);

  // Scroll position for HeroTagline fade + back-to-top
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { dbUser } = useAuth();
  // Elite Access Hook
  const {
    isElite,
    isAuthenticated,
    canViewFullProfile,
    upgradeToElite,
    refreshStatus,
    daysRemaining,
    isExpiringSoon,
  } = useEliteAccess({ demoMode: isDemoMode });

  // Advanced Filter Hook
  const advancedFilter = useAdvancedFilter();

  // API Hooks
  const {
    developers: apiDevelopers,
    loading: listLoading,
    error: listError,
    getByCategory,
    fetchWithFilters,
    fetchPortfolios,
    refresh: refreshList
  } = usePortfolios({
    categories: activeCategories,
    // Only default to OPEN when categories are selected; empty for ALL view (uses listAll)
    statuses: activeCategories.length > 0
      ? (activeStatuses.length > 0 ? activeStatuses : [JobProfileStatus.OPEN])
      : [],
    autoFetch: !isDemoMode
  });

  const {
    rails,
    loading: railsLoading,
    error: railsError,
    refresh: refreshRails
  } = usePortfolioRails();

  const {
    results: searchResults,
    loading: searchLoading,
    error: searchError,
    searchQuery,
    setSearchQuery,
    isSearching,
    totalResults,
    clear: clearSearch
  } = usePortfolioSearch({ debounceMs: 300, minChars: 2 });

  useEffect(() => {
    // Wipe local state clean
    setMyProfileData(null);
    setSelectedDev(null);
    setSelectedDevId(null);
    setShowClassified(false);
  }, [dbUser?.id, isAuthenticated]);

  // Fetch total portfolio count on mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        if (isDemoMode) {
          setTotalProfiles(demoPortfolios.length);
        } else {
          const { count } = await portfolioService.getCount();
          setTotalProfiles(count);
        }
      } catch (error) {
        // Fallback to demo count on error
        setTotalProfiles(demoPortfolios.length);
      }
    };
    fetchCount();
  }, [isDemoMode]);

  // Determine data source (demo or API)
  const developers = useMemo(() => {
    if (isDemoMode) {
      // No filters = show all
      if (activeCategories.length === 0) return demoPortfolios;
      // Filter by selected categories
      return demoPortfolios.filter(d => activeCategories.includes(d.role));
    }
    return apiDevelopers;
  }, [isDemoMode, activeCategories, apiDevelopers]);

  // Determine which data to show
  const isSearchActive = searchQuery.length >= 2;
  const displayDevelopers = useMemo(() => {
    if (usingAdvancedFilter && advancedFilter.developers.length > 0) {
      return advancedFilter.developers;
    }
    if (isSearchActive) {
      if (isDemoMode) {
        const query = searchQuery.toLowerCase();
        return demoPortfolios.filter(d =>
          d.name.toLowerCase().includes(query) ||
          d.role.toLowerCase().includes(query) ||
          d.badges.some(b => b.toLowerCase().includes(query))
        );
      }
      return searchResults;
    }
    return developers;
  }, [isSearchActive, isDemoMode, searchQuery, searchResults, developers, usingAdvancedFilter, advancedFilter.developers]);

  const isRestricted = !isElite && isAuthenticated;

  const handleSelectDev = (dev: Developer) => {
    if (isRestricted && !canViewFullProfile(dev.id)) {
      setSelectedDev(dev);
      setShowClassified(true);
    } else {
      setSelectedDev(dev);
      setSelectedDevId(dev.id);
    }
  };

  const handleUnlockClick = () => {
    setIsPricingOpen(true);
  };

  const handlePlanSelect = async (plan: "viewer" | "creator") => {
    await upgradeToElite(plan);
    await refreshStatus();
    setShowClassified(false);
  };

  // Toggle category selection (multi-select)
  // Toggle category selection (multi-select)
  const handleCategoryToggle = (category: string) => {
    clearSearch();
    setActiveCategories(prev => {
      const isSelected = prev.includes(category);
      const newCategories = isSelected
        ? prev.filter(c => c !== category)
        : [...prev, category];

      // Determine new statuses based on categories
      let newStatuses = activeStatuses;

      if (newCategories.length === 0) {
        // If going back to ALL (no categories), clear all statuses
        newStatuses = [];
        setActiveStatuses([]);
      } else if (prev.length === 0 && newCategories.length > 0) {
        // If moving from ALL to first category, set default status to OPEN
        newStatuses = [JobProfileStatus.OPEN];
        setActiveStatuses([JobProfileStatus.OPEN]);
      }

      // Trigger fetch with new filters
      if (!isDemoMode) {
        fetchWithFilters({
          categories: newCategories,
          statuses: newStatuses
        }, 0);
      }
      return newCategories;
    });
  };

  // Toggle status selection (multi-select)
  // Toggle status selection (multi-select)
  const handleStatusToggle = (status: JobProfileStatus) => {
    // If "ALL" is selected (no active categories), don't allow status selection
    if (activeCategories.length === 0) {
      toast.info("Select a category first to filter by status");
      return;
    }

    clearSearch();
    setActiveStatuses(prev => {
      const isSelected = prev.includes(status);
      let newStatuses: JobProfileStatus[];

      if (isSelected) {
        // Remove the status
        newStatuses = prev.filter(s => s !== status);
        // If removing the last status, don't auto-select anything
      } else {
        // Add the status
        newStatuses = [...prev, status];
      }

      if (!isDemoMode) {
        fetchWithFilters({ categories: activeCategories, statuses: newStatuses }, 0);
      }
      return newStatuses;
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveCategories([]);
    setActiveStatuses([]); // Set to empty array, not [JobProfileStatus.OPEN]
    clearSearch();
    if (!isDemoMode) {
      fetchWithFilters({ categories: [], statuses: [] }, 0); // Send empty statuses
    }
  };

  // Check if any filters are active
  const hasActiveFilters = activeCategories.length > 0 || activeStatuses.length > 0;
  const handleMyProfileClick = async () => {

    if (!isAuthenticated) {
      setMyProfileData(null);
      setIsModalOpen(true);
      return;
    }

    setIsFetchingMyProfile(true);

    try {
      const data = await portfolioService.getMyPortfolio();

      if (data === null) {
        // No existing portfolio - open CreatePortfolioModal in CREATE mode
        setMyProfileData(null);
      } else {
        // Portfolio exists - open in EDIT mode with existing data
        setMyProfileData(data);
      }

      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch your profile");
    } finally {
      setIsFetchingMyProfile(false);
    }
  };

  const isLoading = isDemoMode ? false : (activeCategories.length === 0 && activeStatuses.length === 0 && !isSearchActive) ? railsLoading : listLoading;
  const error = isDemoMode ? null : (activeCategories.length === 0 && activeStatuses.length === 0 && !isSearchActive) ? railsError : listError;

  return (
    <PageTransition>
      <main className="min-h-screen bg-background pt-24 selection:bg-[#FFAB00] selection:text-black relative" style={{ overflowX: 'clip' }}>

        {/* HeroTagline - fades out as user scrolls */}
        <div
          className="transition-opacity duration-200 ease-out"
          style={{ opacity: Math.max(0, 1 - scrollY / 150) }}
        >
          <HeroTagline
            phrase="Create your free portfolio"
            size="sm"
            className="mb-4"
          />
        </div>

        {/* --- GLOBAL BG EFFECTS (Cyber Grid) --- */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-20"
          style={{ backgroundImage: 'linear-gradient(rgba(255, 171, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 171, 0, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
        </div>
        <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-background via-transparent to-background"></div>

        {/* MODALS */}
        <CreatePortfolioModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setMyProfileData(null);
          }}
          initialData={myProfileData}
          onSuccess={() => {
            if (!hasActiveFilters) refreshRails();
            else refreshList();
          }}
          onOpenEditModal={(portfolio) => {
            setUpdatePortfolioData(portfolio);
            setIsUpdateModalOpen(true);
          }}
        />

        <UpdatePortfolioModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setUpdatePortfolioData(null);
          }}
          initialData={updatePortfolioData!}
          onSuccess={() => {
            setIsUpdateModalOpen(false);
            setUpdatePortfolioData(null);
            if (!hasActiveFilters) refreshRails();
            else refreshList();
          }}
        />

        <ProfileViewModal
          isOpen={!!selectedDev && !showClassified}
          onClose={() => {
            setSelectedDev(null);
            setSelectedDevId(null);
          }}
          developer={selectedDev}
          portfolioId={selectedDevId}
        />

        {/* Advanced Filters Modal */}
        <MoreFiltersModal
          isOpen={isMoreFiltersOpen}
          onClose={() => setIsMoreFiltersOpen(false)}
          jobCategories={advancedFilter.jobCategories}
          jobStatuses={advancedFilter.jobStatuses}
          skillNames={advancedFilter.skillNames}
          minExperienceYears={advancedFilter.minExperienceYears}
          maxExperienceYears={advancedFilter.maxExperienceYears}
          enginePreferences={advancedFilter.enginePreferences}
          location={advancedFilter.location}
          setJobCategories={advancedFilter.setJobCategories}
          setJobStatuses={advancedFilter.setJobStatuses}
          setSkillNames={advancedFilter.setSkillNames}
          setExperienceRange={advancedFilter.setExperienceRange}
          setEnginePreferences={advancedFilter.setEnginePreferences}
          setLocation={advancedFilter.setLocation}
          onApplyFilters={async () => {
            await advancedFilter.applyFilters(0);
            setUsingAdvancedFilter(true);
          }}
          isLoading={advancedFilter.loading}
        />

        {/* Classified Overlay Modal */}
        <AnimatePresence>
          {showClassified && selectedDev && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            >
              <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => {
                  setShowClassified(false);
                  setSelectedDev(null);
                }}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-md"
              >
                <ClassifiedOverlay
                  developer={selectedDev}
                  onUnlock={handleUnlockClick}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STICKY WRAPPER: CompactHeader + Control Deck - pins below GlobalHeader */}
        <div className="sticky top-24 z-40 bg-background">

        {/* CompactHeader with its own background for scroll-behind */}
        <div className="relative bg-background">
        <CompactHeader
          onMyProfileClick={handleMyProfileClick}
          isLoadingMyProfile={isFetchingMyProfile}
          isDemoMode={isDemoMode}
          onToggleDemo={() => setIsDemoMode(!isDemoMode)}
          totalProfiles={totalProfiles}
          showDemoToggle={showDemoFeature}
        />
        </div>

        {/* CONTROL DECK - Redesigned */}
        <section className="relative mb-0">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background" />
          <div className="absolute inset-0 bg-[#0a0a0a]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFAB00]/30 to-transparent" />

          <div className="relative px-4 md:px-8 max-w-7xl mx-auto py-3 sm:py-4">

            {/* Row 1: Search + Active Filter Indicator + View Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* Search - Expandable on mobile */}
              <div className="relative flex-1 min-w-0 group">
                <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none z-10">
                  <Search className={`w-4 h-4 transition-colors duration-300 ${searchQuery ? 'text-[#FFAB00]' : 'text-gray-600 group-focus-within:text-[#FFAB00]'
                    }`} />
                </div>
                <input
                  type="text"
                  placeholder="Search by name ..."
                  className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg pl-10 pr-10 py-2.5 sm:py-3 text-sm text-white focus:outline-none focus:border-[#FFAB00]/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(255,171,0,0.08)] transition-all duration-300 font-mono placeholder:text-gray-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Right side icons */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {isSearching && (
                    <Loader2 className="w-4 h-4 text-[#FFAB00] animate-spin" />
                  )}
                  {searchQuery && !isSearching && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={clearSearch}
                      className="p-0.5 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <XCircle className="w-4 h-4 text-gray-500 hover:text-white" />
                    </motion.button>
                  )}
                </div>

                {/* Search results count - floating pill */}
                <AnimatePresence>
                  {isSearchActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      className="absolute -bottom-7 left-0 z-50"
                    >
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FFAB00]/10 border border-[#FFAB00]/20 rounded-full text-[10px] font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFAB00] animate-pulse" />
                        <span className="text-[#FFAB00] font-bold">{isDemoMode ? displayDevelopers.length : totalResults}</span>
                        <span className="text-gray-500">found</span>
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Active filter indicator - shows selected filters as chips */}
              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.div
                    initial={{ scale: 0, width: 0 }}
                    animate={{ scale: 1, width: "auto" }}
                    exit={{ scale: 0, width: 0 }}
                    className="hidden sm:flex items-center gap-1.5 shrink-0"
                  >
                    {/* Selected categories chips */}
                    {activeCategories.slice(0, 2).map(cat => (
                      <motion.button
                        key={cat}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        onClick={() => handleCategoryToggle(cat)}
                        className="flex items-center gap-1 px-2 py-1.5 sm:py-2 bg-[#FFAB00]/15 border border-[#FFAB00]/25 rounded-lg text-[#FFAB00] text-[10px] sm:text-xs font-bold uppercase tracking-wide whitespace-nowrap overflow-hidden"
                      >
                        <span>{cat}</span>
                        <X className="w-3 h-3 shrink-0" />
                      </motion.button>
                    ))}
                    {activeCategories.length > 2 && (
                      <span className="text-[10px] text-gray-500 font-mono">+{activeCategories.length - 2}</span>
                    )}
                    {/* Selected status chips */}
                    {activeStatuses
                      .filter(s => !(activeStatuses.length === 1 && s === JobProfileStatus.OPEN)) // Don't show default
                      .slice(0, 1)
                      .map(status => {
                        const statusInfo = statusOptions.find(s => s.value === status);
                        return (
                          <motion.button
                            key={status}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            onClick={() => handleStatusToggle(status)}
                            className="flex items-center gap-1 px-2 py-2 border rounded-lg text-xs font-bold uppercase tracking-wide whitespace-nowrap overflow-hidden"
                            style={{
                              backgroundColor: `${statusInfo?.color}15`,
                              borderColor: `${statusInfo?.color}40`,
                              color: statusInfo?.color
                            }}
                          >
                            <span>{statusInfo?.label}</span>
                            <X className="w-3 h-3 shrink-0" />
                          </motion.button>
                        );
                      })}
                    {activeStatuses.length > 1 && (
                      <span className="text-[10px] text-gray-500 font-mono">+{activeStatuses.length - 1}</span>
                    )}
                    {/* Clear all */}
                    {hasActiveFilters && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        onClick={clearAllFilters}
                        className="sm:hidden p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 shrink-0"
                      >
                        <XCircle className="w-4 h-4" />
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* View Toggle - Refined */}
              <div className="flex items-center bg-white/[0.04] border border-white/[0.06] rounded-lg p-0.5 shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 ${viewMode === "grid"
                    ? "bg-[#FFAB00] text-black shadow-[0_0_12px_rgba(255,171,0,0.3)]"
                    : "text-gray-600 hover:text-white hover:bg-white/5"
                    }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${viewMode === "list"
                    ? "bg-[#FFAB00] text-black shadow-[0_0_12px_rgba(255,171,0,0.3)]"
                    : "text-gray-600 hover:text-white hover:bg-white/5"
                    }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Row 2: Category Filters - Fixed Layout */}
            <div className="mt-3 relative">
              {/* Desktop: Show first 6 categories + More button + Status filters */}
              <div className="hidden sm:flex items-center gap-2 flex-wrap">
                {/* "All" button - clears filters */}
                <button
                  onClick={clearAllFilters}
                  className={`group relative whitespace-nowrap px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-lg shrink-0 ${activeCategories.length === 0 && activeStatuses.length === 0 // Only active when both are empty
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                    : "bg-white/[0.04] text-gray-500 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
                    }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Zap className={`w-3 h-3 ${activeCategories.length === 0 && activeStatuses.length === 0
                      ? "text-black"
                      : "text-[#FFAB00]"
                      }`} />
                    All
                  </span>
                </button>

                {/* Separator */}
                <div className="w-px h-6 bg-white/[0.06] shrink-0 mx-0.5" />

                {/* First 8 role filters (multi-select) */}
                {roles.slice(0, 8).map((role) => {
                  const isSelected = activeCategories.includes(role);
                  return (
                    <button
                      key={role}
                      onClick={() => handleCategoryToggle(role)}
                      className={`group relative whitespace-nowrap px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-lg shrink-0 flex items-center gap-1.5 ${isSelected
                        ? "bg-[#FFAB00] text-black shadow-[0_0_20px_rgba(255,171,0,0.25)]"
                        : "bg-white/[0.03] text-gray-500 hover:text-white hover:bg-white/[0.07] border border-transparent hover:border-white/[0.08]"
                        }`}
                    >
                      {isSelected && <CheckCircle className="w-3 h-3" />}
                      {role}
                    </button>
                  );
                })}

                {/* More button for desktop */}
                {roles.length > 8 && (
                  <MoreCategoriesButton
                    roles={roles.slice(8)}
                    activeCategories={activeCategories}
                    onCategoryToggle={handleCategoryToggle}
                  />
                )}

                {/* Advanced Filter Button */}
                <button
                  onClick={() => setIsMoreFiltersOpen(true)}
                  className={`group relative whitespace-nowrap px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-lg shrink-0 flex items-center gap-1.5 ${usingAdvancedFilter
                    ? "bg-[#FF6B9D] text-white shadow-[0_0_20px_rgba(255,107,157,0.25)]"
                    : "bg-white/[0.03] text-gray-500 hover:text-white hover:bg-white/[0.07] border border-transparent hover:border-white/[0.08]"
                    }`}
                  title="Open advanced filters for skill, experience, engine, location"
                >
                  <Sparkles className="w-3 h-3" />
                  More Filters
                </button>

                {/* Separator before status filters */}
                <div className="w-px h-6 bg-white/[0.06] shrink-0 mx-1" />

                {/* Status Filters */}
                {/* Status Filters */}
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3 h-3 text-gray-500" />
                  {statusOptions.map((status) => {
                    const isSelected = activeStatuses.includes(status.value);
                    const isDisabled = activeCategories.length === 0; // Disabled when ALL is selected

                    return (
                      <button
                        key={status.value}
                        onClick={() => handleStatusToggle(status.value)}
                        disabled={isDisabled}
                        className={`group relative whitespace-nowrap px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 rounded-lg shrink-0 flex items-center gap-1.5 border ${isDisabled
                          ? "cursor-not-allowed bg-white/[0.02] text-gray-600 border-white/[0.03]"
                          : isSelected
                            ? "bg-opacity-20 border-opacity-50"
                            : "bg-white/[0.03] text-gray-500 hover:text-white hover:bg-white/[0.07] border-transparent hover:border-white/[0.08]"
                          }`}
                        style={isSelected && !isDisabled ? {
                          backgroundColor: `${status.color}20`,
                          borderColor: `${status.color}50`,
                          color: status.color,
                          boxShadow: `0 0 15px ${status.color}30`
                        } : {}}
                      >
                        {/* Always-visible colored dot */}
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: status.color,
                            boxShadow: `0 0 6px ${status.color}50`,
                            opacity: isDisabled ? 0.3 : 1
                          }}
                        />
                        {isSelected && <CheckCircle className="w-3 h-3" />}
                        {status.label}
                      </button>
                    );
                  })}
                </div>

                {/* Category search input for desktop */}
                {/* <div className="ml-auto flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search categories..."
                      className="bg-white/[0.04] border border-white/[0.06] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFAB00]/50 focus:bg-white/[0.06] transition-all duration-300 font-mono placeholder:text-gray-600 w-48"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const query = (e.target as HTMLInputElement).value.toLowerCase().trim();
                          if (!query) return;

                          const matchedRole = roles.find(r =>
                            r.toLowerCase().includes(query)
                          );

                          if (matchedRole) {
                            handleCategoryChange(matchedRole);
                            (e.target as HTMLInputElement).value = '';
                          } else {
                            toast.info(`No category found matching "${query}"`);
                          }
                        }
                      }}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <Search className="w-4 h-4" />
                    </div>
                  </div> */}
                {/* </div> */}
              </div>

              {/* Mobile: Compact filter bar */}
              <div className="sm:hidden">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* "All" button */}
                  <button
                    onClick={clearAllFilters}
                    className={`group relative whitespace-nowrap px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-lg shrink-0 ${!hasActiveFilters
                      ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                      : "bg-white/[0.04] text-gray-500 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
                      }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Zap className={`w-3 h-3 ${!hasActiveFilters ? "text-black" : "text-[#FFAB00]"}`} />
                      All
                    </span>
                  </button>

                  {/* Separator */}
                  <div className="w-px h-6 bg-white/[0.06] shrink-0 mx-0.5" />

                  {/* Status filters for mobile */}
                  {/* Status filters for mobile */}
                  {/* Status filters for mobile */}
                  {statusOptions.map((status) => {
                    const isSelected = activeStatuses.includes(status.value);
                    const isDisabled = activeCategories.length === 0;

                    return (
                      <button
                        key={status.value}
                        onClick={() => handleStatusToggle(status.value)}
                        disabled={isDisabled}
                        className={`group relative whitespace-nowrap px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 rounded-lg shrink-0 flex items-center gap-1.5 border ${isDisabled
                          ? "cursor-not-allowed bg-white/[0.02] text-gray-600 border-white/[0.03]"
                          : isSelected
                            ? ""
                            : "bg-white/[0.05] text-gray-300 border-white/[0.1]"
                          }`}
                        style={
                          isSelected && !isDisabled
                            ? {
                              backgroundColor: `${status.color}20`,
                              borderColor: `${status.color}50`,
                              color: status.color,
                            }
                            : {
                              borderColor: isDisabled ? `${status.color}15` : `${status.color}30`,
                            }
                        }
                      >
                        {/* Always-visible colored dot */}
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: status.color,
                            boxShadow: `0 0 6px ${status.color}50`,
                            opacity: isDisabled ? 0.3 : 1
                          }}
                        />
                        {isSelected && <CheckCircle className="w-3 h-3" />}
                        {status.label.split(" ")[0]}
                      </button>
                    );
                  })}

                  {/* Separator */}
                  <div className="w-px h-6 bg-white/[0.06] shrink-0 mx-0.5" />

                  {/* Mobile Category Search Button */}
                  <MobileCategorySearchButton
                    roles={roles}
                    activeCategories={activeCategories}
                    onCategoryToggle={handleCategoryToggle}
                    onClearAll={() => setActiveCategories([])}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>{/* end sticky wrapper */}

        {/* Spacer below sticky section */}
        <div className="h-6" />

        {/* DATABASE CONTENT */}
        <section className="px-4 md:px-8 max-w-[1600px] mx-auto pb-20 min-h-[500px] relative z-10">

          <AnimatePresence mode="wait">

            {/* ERROR STATE */}
            {error && !isLoading && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <ErrorState
                  message={error}
                  onRetry={() => !hasActiveFilters ? refreshRails() : refreshList()}
                />
              </motion.div>
            )}

            {/* SEARCH ERROR */}
            {searchError && isSearchActive && !isDemoMode && (
              <motion.div
                key="search-error"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <ErrorState message={searchError} onRetry={() => setSearchQuery(searchQuery)} />
              </motion.div>
            )}

            {/* MASONRY GRID VIEW */}
            {viewMode === "grid" && !error ? (
              <motion.div
                key="masonry-grid"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                {/* Category Header - Compact */}
                <div className="flex items-center gap-2 mb-6 text-gray-500 font-mono text-xs uppercase">
                  <Terminal className="w-3 h-3 text-[#FFAB00]" />
                  {isSearchActive ? (
                    <>Searching: <span className="text-white">"{searchQuery}"</span></>
                  ) : hasActiveFilters ? (
                    <>
                      {activeCategories.length > 0 && (
                        <span className="text-white">{activeCategories.slice(0, 3).join(', ')}{activeCategories.length > 3 ? ` +${activeCategories.length - 3}` : ''}</span>
                      )}
                      {activeCategories.length > 0 && activeStatuses.length > 0 && <span> • </span>}
                      {activeStatuses.length > 0 && (
                        <>
                          {activeStatuses
                            .slice(0, 1)
                            .map(status => {
                              const statusInfo = statusOptions.find(s => s.value === status);
                              return (
                                <motion.button
                                  key={status}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  onClick={() => handleStatusToggle(status)}
                                  className="flex items-center gap-1 px-2 py-2 border rounded-lg text-xs font-bold uppercase tracking-wide whitespace-nowrap overflow-hidden"
                                  style={{
                                    backgroundColor: `${statusInfo?.color}15`,
                                    borderColor: `${statusInfo?.color}40`,
                                    color: statusInfo?.color
                                  }}
                                >
                                  <span>{statusInfo?.label}</span>
                                  <X className="w-3 h-3 shrink-0" />
                                </motion.button>
                              );
                            })}
                          {activeStatuses.length > 1 && (
                            <span className="text-[10px] text-gray-500 font-mono">+{activeStatuses.length - 1}</span>
                          )}
                        </>
                      )}
                      <span> • </span><span className="text-[#FFAB00]">{displayDevelopers.length}</span> profiles
                    </>
                  ) : (
                    <><span className="text-white">All</span> • <span className="text-[#FFAB00]">{displayDevelopers.length}</span> profiles</>
                  )}
                  {isLoading && <Loader2 className="w-3 h-3 text-[#FFAB00] animate-spin ml-2" />}
                  {isDemoMode && (
                    <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] rounded-full">DEMO</span>
                  )}
                </div>

                {/* Loading Skeletons */}
                {isLoading && displayDevelopers.length === 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="flex items-center justify-center">
                        <CardSkeleton />
                      </div>
                    ))}
                  </div>
                ) : displayDevelopers.length === 0 ? (
                  <EmptyState category={isSearchActive ? `"${searchQuery}"` : hasActiveFilters ? activeCategories.join(', ') || 'selected filters' : 'All'} />
                ) : (
                  <ResponsiveMasonryGrid
                    developers={displayDevelopers}
                    onSelectDev={handleSelectDev}
                    isRestricted={isRestricted}
                    onUnlockClick={handleUnlockClick}
                  />
                )}
              </motion.div>
            ) : !error && (

              /* LIST VIEW */
              <motion.div
                key="list"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col gap-2"
              >
                <div className="hidden md:flex px-4 py-2 text-[10px] font-mono text-gray-600 uppercase tracking-widest border-b border-white/10 mb-2">
                  <div className="w-1/4">Operative ID</div>
                  <div className="w-1/4">Specialization</div>
                  <div className="w-1/6">Stats {isRestricted && <Lock className="w-3 h-3 inline text-red-500 ml-1" />}</div>
                  <div className="w-1/3">Status & Action</div>
                </div>

                {isLoading && displayDevelopers.length === 0 ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#FFAB00] animate-spin" />
                  </div>
                ) : displayDevelopers.length === 0 ? (
                  <EmptyState category={isSearchActive ? `"${searchQuery}"` : hasActiveFilters ? activeCategories.join(', ') || 'selected filters' : 'All'} />
                ) : (
                  displayDevelopers.map((dev) => (
                    <TacticalRow
                      key={dev.id}
                      dev={dev}
                      onClick={() => handleSelectDev(dev)}
                      isRestricted={isRestricted}
                      onUnlock={handleUnlockClick}
                    />
                  ))
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </section>

        <Footer />

        {/* Back to Top Button */}
        <AnimatePresence>
          {scrollY > 400 && (
            <motion.button
              key="back-to-top"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 p-3 rounded-full bg-gradient-to-r from-[#FFAB00] to-[#FF8C00] text-black shadow-[0_0_20px_rgba(255,171,0,0.4)] hover:shadow-[0_0_30px_rgba(255,171,0,0.6)] transition-shadow"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </main>
    </PageTransition>
  );
};

export default Portfolios;