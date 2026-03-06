import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, ChevronDown, User, ShieldCheck, Moon, Sun, Calendar, Sparkles, Shield, Play, Film, Mic, Video, Crown, Eye, Palette, LogOut } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { UserMenu } from "./UserMenu";

// --- NAVIGATION LINKS ---
const mainNavItems = [
  // { path: "/", label: "Featured" }, // Hidden as per request
  { path: "/", label: "Portfolio" }, // Portfolio is now the landing page
  { path: "/studios", label: "Studios" },
  { path: "/about", label: "About" },
];

// Video dropdown items
const videoSubItems = [
  { path: "/reviews", label: "Reviews", icon: Play, description: "Game reviews & analysis" },
  { path: "/documentary", label: "Documentary", icon: Film, description: "Industry documentaries" },
  { path: "/podcast", label: "Podcast", icon: Mic, description: "Developer interviews" },
];

interface GlobalHeaderProps {
  onLoginClick: () => void;
  isAuthenticated: boolean;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full border border-border bg-surface text-foreground hover:border-brand transition-colors"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

// --- CALENDLY BUTTON COMPONENT ---
const CalendlyButton = () => {
  const calendlyUrl = "https://calendly.com/thegametout/connect"; // Replace with your Calendly URL

  return (
    <motion.a
      href={calendlyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-2 bg-gradient-to-r from-[#FFAB00]/20 to-[#FF6B00]/20 backdrop-blur-md border border-[#FFAB00]/40 px-4 py-2.5 rounded-full overflow-hidden hover:border-[#FFAB00] hover:shadow-[0_0_25px_rgba(255,171,0,0.4)] transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated Background Glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#FFAB00]/0 via-[#FFAB00]/20 to-[#FFAB00]/0"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Pulsing Icon Container */}
      <motion.div
        className="relative w-6 h-6 rounded-full bg-[#FFAB00] flex items-center justify-center"
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(255, 171, 0, 0.4)",
            "0 0 0 8px rgba(255, 171, 0, 0)",
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
        }}
      >
        <Calendar className="w-3.5 h-3.5 text-black" />
      </motion.div>

      {/* Text */}
      <span className="relative text-[10px] font-bold font-mono uppercase tracking-wider text-[#FFAB00] group-hover:text-white transition-colors whitespace-nowrap">
        Book a Call
      </span>

      {/* Sparkle Animation on Hover */}
      <motion.div
        className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity"
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <Sparkles className="w-3 h-3 text-[#FFAB00]" />
      </motion.div>
    </motion.a>
  );
};

// --- JOIN COMMUNITY BUTTON COMPONENT ---
const JoinCommunityButton = () => {
  const communityUrl = "https://discord.gg/y8KM2NutqX"; // Replace with your community URL

  return (
    <motion.a
      href={communityUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-2 bg-gradient-to-r from-[#5865F2]/20 to-[#7289DA]/20 backdrop-blur-md border border-[#5865F2]/40 px-4 py-2.5 rounded-full overflow-hidden hover:border-[#5865F2] hover:shadow-[0_0_25px_rgba(88,101,242,0.4)] transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated Background Glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#5865F2]/0 via-[#5865F2]/20 to-[#5865F2]/0"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Pulsing Icon Container */}
      <motion.div
        className="relative w-6 h-6 rounded-full bg-[#5865F2] flex items-center justify-center"
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(88, 101, 242, 0.4)",
            "0 0 0 8px rgba(88, 101, 242, 0)",
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
        }}
      >
        <User className="w-3.5 h-3.5 text-white" />
      </motion.div>

      {/* Text */}
      <span className="relative text-[10px] font-bold font-mono uppercase tracking-wider text-[#5865F2] group-hover:text-white transition-colors whitespace-nowrap">
        Join Community
      </span>

      {/* Sparkle Animation on Hover */}
      <motion.div
        className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity"
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <Sparkles className="w-3 h-3 text-[#5865F2]" />
      </motion.div>
    </motion.a>
  );
};

// --- ALTERNATIVE: More Minimal Calendly Button ---
const CalendlyButtonMinimal = () => {
  const calendlyUrl = "https://calendly.com/your-username"; // Replace with your Calendly URL

  return (
    <motion.a
      href={calendlyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-2 bg-black/80 backdrop-blur-md border border-white/20 px-3 py-2 rounded-full hover:border-[#FFAB00] hover:bg-[#FFAB00]/10 transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icon with pulse */}
      <div className="relative">
        <Calendar className="w-4 h-4 text-[#FFAB00]" />
        <motion.div
          className="absolute inset-0 rounded-full bg-[#FFAB00]"
          animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Text - Hidden on smaller screens */}
      <span className="hidden xl:block text-[10px] font-bold font-mono uppercase tracking-wider text-gray-400 group-hover:text-[#FFAB00] transition-colors">
        Meet
      </span>
    </motion.a>
  );
};

export const GlobalHeader = ({ onLoginClick, isAuthenticated }: GlobalHeaderProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVideosDropdownOpen, setIsVideosDropdownOpen] = useState(false);
  const [isMobileVideosExpanded, setIsMobileVideosExpanded] = useState(false);
  const videosDropdownRef = useRef<HTMLDivElement>(null);
  const { dbUser, logout } = useAuth();

  // Check if user is an admin
  const isAdmin = dbUser?.role === "ADMIN";

  // Check if user is premium with subscription type
  const isPremium = dbUser?.role === "PREMIUM";
  const subscriptionType = dbUser?.subscriptionType;

  // Check if regular user (not admin, not premium)
  const isRegularUser = dbUser?.role === "USER";

  // Check if current path is a video subpage
  const isVideoPath = videoSubItems.some(item => item.path === location.pathname);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (videosDropdownRef.current && !videosDropdownRef.current.contains(event.target as Node)) {
        setIsVideosDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* --- MAIN HEADER BAR (Fixed Top) --- */}
      <header className="fixed top-0 left-0 right-0 h-24 z-50 px-6 md:px-12 flex items-center justify-between gap-4 pointer-events-none">

        {/* 1. LEFT: LOGO (Pointer Auto) */}
        <div className="pointer-events-auto flex items-center gap-6 flex-shrink-0">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-3 bg-black/80 border border-white/20 rounded-full text-white hover:text-[#FFAB00] transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo - NOW LARGER */}
          <Link to="/" className="flex flex-col group relative z-50 flex-shrink-0">
            <h1 className="font-display text-[1.4rem] md:text-[2.2rem] font-bold uppercase text-white leading-none tracking-tight group-hover:text-[#FFAB00] transition-colors drop-shadow-xl">
              We<span className="text-[#FFAB00] group-hover:text-white transition-colors">Build</span>Game
            </h1>
          </Link>
        </div>

        {/* 2. CENTER: DESKTOP NAVIGATION + CALENDLY BUTTON */}
        <div className="hidden lg:flex items-center justify-center gap-4 pointer-events-auto flex-1 min-w-0">
          {/* Navigation Pills */}
          <nav className="bg-black/90 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex gap-6 items-center flex-shrink-0">
            {/* Featured Link */}
            {/* Featured Link - Hidden */
              /* <Link to="/" className="relative group/link">
                <span className={`text-xs font-bold font-mono uppercase tracking-[0.2em] transition-colors ${
                  location.pathname === "/" ? "text-[#FFAB00]" : "text-gray-400 group-hover/link:text-white"
                }`}>
                  Featured
                </span>
                {location.pathname === "/" && (
                  <motion.div 
                    layoutId="nav-dot" 
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#FFAB00] rounded-full" 
                  />
                )}
              </Link> */
            }



            {/* Other Nav Items */}
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className="relative group/link">
                  <span className={`text-xs font-bold font-mono uppercase tracking-[0.2em] transition-colors ${isActive ? "text-[#FFAB00]" : "text-gray-400 group-hover/link:text-white"
                    }`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#FFAB00] rounded-full"
                    />
                  )}
                </Link>
              );
            })}

            {/* Videos Dropdown */}
            {/* Videos Dropdown - Hidden */
              false && (
                <div
                  ref={videosDropdownRef}
                  className="relative"
                  onMouseEnter={() => setIsVideosDropdownOpen(true)}
                  onMouseLeave={() => setIsVideosDropdownOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-[0.2em] transition-colors ${isVideoPath || isVideosDropdownOpen ? "text-[#FFAB00]" : "text-gray-400 hover:text-white"
                      }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    Videos
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isVideosDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isVideoPath && !isVideosDropdownOpen && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#FFAB00] rounded-full"
                    />
                  )}

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isVideosDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-50"
                      >
                        {/* Arrow */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/95 border-l border-t border-white/10 rotate-45" />

                        <div className="relative py-2">
                          {videoSubItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                              <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 transition-colors ${isActive
                                  ? "bg-[#FFAB00]/10 text-[#FFAB00]"
                                  : "hover:bg-white/5 text-gray-400 hover:text-white"
                                  }`}
                              >
                                <div className={`p-2 rounded-lg ${isActive ? "bg-[#FFAB00]/20" : "bg-white/5"}`}>
                                  <Icon className={`w-4 h-4 ${isActive ? "text-[#FFAB00]" : "text-gray-400"}`} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold">{item.label}</p>
                                  <p className="text-[10px] text-gray-500">{item.description}</p>
                                </div>
                                {isActive && (
                                  <motion.div
                                    layoutId="dropdown-indicator"
                                    className="ml-auto w-1.5 h-1.5 bg-[#FFAB00] rounded-full"
                                  />
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            }
          </nav>

          {/* Admin Dashboard Button - Only visible to admins */}
          <AnimatePresence>
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <Link to="/admin/dashboard">
                  <motion.div
                    className="group relative flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-md border border-red-500/40 px-4 py-2.5 rounded-full overflow-hidden hover:border-red-500 hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Animated Background Glow */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    {/* Pulsing Icon Container */}
                    <motion.div
                      className="relative w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(239, 68, 68, 0.4)",
                          "0 0 0 8px rgba(239, 68, 68, 0)",
                        ],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    >
                      <Shield className="w-3.5 h-3.5 text-white" />
                    </motion.div>

                    {/* Text */}
                    <span className="relative text-[10px] font-bold font-mono uppercase tracking-wider text-red-400 group-hover:text-white transition-colors whitespace-nowrap">
                      Admin
                    </span>

                    {/* Sparkle Animation on Hover */}
                    <motion.div
                      className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <Sparkles className="w-3 h-3 text-red-400" />
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Badge - Elite Viewer or Elite Creator */}
          {/* <AnimatePresence>
            {isPremium && subscriptionType && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <motion.div
                  className={`group relative flex items-center gap-2 backdrop-blur-md border px-4 py-2.5 rounded-full overflow-hidden transition-all duration-300 ${subscriptionType === "CREATOR"
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/40 hover:border-purple-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]"
                    : "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/40 hover:border-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]"
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }} */}
          {/* > */}
          {/* Animated Background Glow */}
          {/* <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${subscriptionType === "CREATOR"
                      ? "from-purple-500/0 via-purple-500/20 to-purple-500/0"
                      : "from-blue-500/0 via-blue-500/20 to-blue-500/0"
                      }`}
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  /> */}

          {/* Pulsing Icon Container */}
          {/* <motion.div
                    className={`relative w-6 h-6 rounded-full flex items-center justify-center ${subscriptionType === "CREATOR" ? "bg-purple-500" : "bg-blue-500"
                      }`}
                    animate={{
                      boxShadow: subscriptionType === "CREATOR"
                        ? [
                          "0 0 0 0 rgba(168, 85, 247, 0.4)",
                          "0 0 0 8px rgba(168, 85, 247, 0)",
                        ]
                        : [
                          "0 0 0 0 rgba(59, 130, 246, 0.4)",
                          "0 0 0 8px rgba(59, 130, 246, 0)",
                        ],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  >
                    {subscriptionType === "CREATOR" ? (
                      <Palette className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 text-white" />
                    )}
                  </motion.div> */}

          {/* Text */}
          {/* <span className={`relative text-[10px] font-bold font-mono uppercase tracking-wider transition-colors whitespace-nowrap ${subscriptionType === "CREATOR"
                    ? "text-purple-400 group-hover:text-white"
                    : "text-blue-400 group-hover:text-white"
                    }`}>
                    {subscriptionType === "CREATOR" ? "Elite Creator" : "Elite Viewer"}
                  </span> */}

          {/* Crown Icon */}
          {/* <Crown className={`w-3 h-3 ${subscriptionType === "CREATOR" ? "text-purple-400" : "text-blue-400"
                    }`} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence> */}

          {/* Regular User Badge - Only when not admin and not premium */}
          {/* <AnimatePresence>
            {isRegularUser && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <motion.div
                  className="group relative flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-500/40 px-4 py-2.5 rounded-full overflow-hidden hover:border-green-500 hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                > */}
          {/* Animated Background Glow */}
          {/* <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  /> */}

          {/* Icon Container */}
          {/* <div className="relative w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>

                  {/* Text */}
          {/* <span className="relative text-[10px] font-bold font-mono uppercase tracking-wider text-green-400 group-hover:text-white transition-colors whitespace-nowrap">
                    Member
                  </span>
                </motion.div>
              </motion.div> */}
          {/* )} */}
          {/* </AnimatePresence> */}

          {/* Calendly Button - After Navigation */}
          <CalendlyButton />
          
          {/* Join Community Button */}
          <JoinCommunityButton />
        </div>

        {/* 3. RIGHT: AUTH BUTTON (Pointer Auto) */}
        <div className="pointer-events-auto flex-shrink-0">
          {isAuthenticated ? (
            <UserMenu isAuthenticated={isAuthenticated} />
          ) : (
            <button
              onClick={onLoginClick}
              className="group relative flex items-center gap-3 bg-black/90 backdrop-blur-md border border-white/20 pl-1.5 pr-6 py-1.5 rounded-full hover:border-[#FFAB00] hover:shadow-[0_0_20px_rgba(255,171,0,0.3)] transition-all duration-300 whitespace-nowrap"
            >
              {/* Icon Circle */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 border-white/20 group-hover:border-[#FFAB00]">
                <User className="w-5 h-5 text-white group-hover:text-[#FFAB00]" />
              </div>

              {/* Text */}
              <span className="hidden md:block font-display text-sm font-bold text-white uppercase leading-none tracking-wider group-hover:text-[#FFAB00] transition-colors">
                SIGN IN
              </span>
            </button>
          )}
        </div>
      </header>

      {/* --- MOBILE MENU DRAWER --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#0a0a0a] flex flex-col p-6 lg:hidden"
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
              <span className="font-display text-3xl text-white uppercase tracking-tight">Navigation</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 border border-white/20 rounded-full hover:bg-white/10 text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex flex-col gap-4 overflow-y-auto flex-1">
              {/* Featured Link */}
              {/* Featured Link - Hidden Mobile */
                /* <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-center justify-between py-2"
                >
                  <span className={`font-display text-4xl uppercase transition-colors ${
                    location.pathname === "/" 
                      ? "text-[#FFAB00]" 
                      : "text-gray-500 group-hover:text-white"
                  }`}>
                    Featured
                  </span>
                  <ChevronDown className="w-6 h-6 -rotate-90 text-gray-700 group-hover:text-[#FFAB00] transition-colors" />
                </Link> */
              }

              {/* Videos Section - Expandable */}
              {/* Videos Section - Hidden Mobile */
                false && (
                  <div className="border-y border-white/10 py-4">
                    <button
                      onClick={() => setIsMobileVideosExpanded(!isMobileVideosExpanded)}
                      className="w-full group flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <Video className={`w-8 h-8 ${isMobileVideosExpanded || isVideoPath ? "text-[#FFAB00]" : "text-gray-600"}`} />
                        <span className={`font-display text-4xl uppercase transition-colors ${isVideoPath
                          ? "text-[#FFAB00]"
                          : "text-gray-500 group-hover:text-white"
                          }`}>
                          Videos
                        </span>
                      </div>
                      <ChevronDown className={`w-6 h-6 text-gray-700 group-hover:text-[#FFAB00] transition-all duration-300 ${isMobileVideosExpanded ? "rotate-180" : ""
                        }`} />
                    </button>

                    <AnimatePresence>
                      {isMobileVideosExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-11 pt-4 space-y-3">
                            {videoSubItems.map((item) => {
                              const Icon = item.icon;
                              const isActive = location.pathname === item.path;
                              return (
                                <Link
                                  key={item.path}
                                  to={item.path}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors ${isActive
                                    ? "bg-[#FFAB00]/10 border border-[#FFAB00]/30"
                                    : "bg-white/5 hover:bg-white/10"
                                    }`}
                                >
                                  <div className={`p-2 rounded-lg ${isActive ? "bg-[#FFAB00]/20" : "bg-white/10"}`}>
                                    <Icon className={`w-5 h-5 ${isActive ? "text-[#FFAB00]" : "text-gray-400"}`} />
                                  </div>
                                  <div>
                                    <p className={`font-display text-xl uppercase ${isActive ? "text-[#FFAB00]" : "text-white"}`}>
                                      {item.label}
                                    </p>
                                    <p className="text-xs text-gray-500">{item.description}</p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

              {/* Other Nav Items */}
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-center justify-between py-2"
                >
                  <span className={`font-display text-4xl uppercase transition-colors ${location.pathname === item.path
                    ? "text-[#FFAB00]"
                    : "text-gray-500 group-hover:text-white"
                    }`}>
                    {item.label}
                  </span>
                  <ChevronDown className="w-6 h-6 -rotate-90 text-gray-700 group-hover:text-[#FFAB00] transition-colors" />
                </Link>
              ))}

              {/* Admin Link - Only visible to admins */}
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-center justify-between py-2 border-t border-red-500/20 pt-6 mt-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-red-400" />
                    </div>
                    <span className="font-display text-3xl uppercase text-red-400 group-hover:text-red-300 transition-colors">
                      Admin Panel
                    </span>
                  </div>
                  <ChevronDown className="w-6 h-6 -rotate-90 text-red-700 group-hover:text-red-400 transition-colors" />
                </Link>
              )}

              {/* Premium Badge - Mobile */}
              {/* {isPremium && subscriptionType && (
                <div className={`flex items-center gap-3 py-3 px-4 rounded-lg border mt-4 ${subscriptionType === "CREATOR"
                  ? "bg-purple-500/10 border-purple-500/30"
                  : "bg-blue-500/10 border-blue-500/30"
                  }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${subscriptionType === "CREATOR" ? "bg-purple-500" : "bg-blue-500"
                    }`}>
                    {subscriptionType === "CREATOR" ? (
                      <Palette className="w-5 h-5 text-white" />
                    ) : (
                      <Eye className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-display text-xl uppercase ${subscriptionType === "CREATOR" ? "text-purple-400" : "text-blue-400"
                      }`}>
                      {subscriptionType === "CREATOR" ? "Elite Creator" : "Elite Viewer"}
                    </span>
                    <span className="text-xs text-gray-500">Premium Member</span>
                  </div>
                  <Crown className={`w-5 h-5 ml-auto ${subscriptionType === "CREATOR" ? "text-purple-400" : "text-blue-400"
                    }`} />
                </div>
              )} */}

              {/* Regular User Badge - Mobile */}
              {/* {isRegularUser && (
                <div className="flex items-center gap-3 py-3 px-4 rounded-lg bg-green-500/10 border border-green-500/30 mt-4">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-xl uppercase text-green-400">
                      Member
                    </span>
                    <span className="text-xs text-gray-500">Free Account</span>
                  </div>
                </div>
              )} */}
            </div>

            {/* Mobile Calendly Button */}
            <motion.a
              href="https://calendly.com/thegametout/connect"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 mb-2 bg-gradient-to-r from-[#FFAB00]/20 to-[#FF6B00]/20 border border-[#FFAB00]/40 flex items-center justify-center gap-3 rounded-lg"
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(255, 171, 0, 0.4)",
                    "0 0 0 6px rgba(255, 171, 0, 0)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-8 h-8 rounded-full bg-[#FFAB00] flex items-center justify-center"
              >
                <Calendar className="w-4 h-4 text-black" />
              </motion.div>
              <span className="font-display text-lg text-[#FFAB00] uppercase tracking-wider">
                Schedule a Meeting
              </span>
            </motion.a>

            {/* Mobile Join Community Button */}
            <motion.a
              href="https://discord.gg/your-community"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 mb-4 bg-gradient-to-r from-[#5865F2]/20 to-[#7289DA]/20 border border-[#5865F2]/40 flex items-center justify-center gap-3 rounded-lg"
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(88, 101, 242, 0.4)",
                    "0 0 0 6px rgba(88, 101, 242, 0)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center"
              >
                <User className="w-4 h-4 text-white" />
              </motion.div>
              <span className="font-display text-lg text-[#5865F2] uppercase tracking-wider">
                Join Community
              </span>
            </motion.a>

            {/* Drawer Footer */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              {isAuthenticated ? (
                <>
                  {/* User Email Display */}
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-gray-400">Logged in as</p>
                    <p className="text-sm font-display text-white truncate">{dbUser?.email}</p>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={async () => {
                      try {
                        await logout();
                        setIsMobileMenuOpen(false);
                      } catch (error) {
                        console.error("Logout failed:", error);
                      }
                    }}
                    className="w-full py-4 bg-red-600 text-white font-display text-lg font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-700 transition-colors rounded-lg"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}
                  className="w-full py-5 bg-[#FFAB00] text-black font-display text-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-colors"
                >
                  <User className="w-6 h-6" />
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};