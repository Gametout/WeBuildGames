import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield, Building2, FileText, Star, Users, Settings,
  ChevronRight, Zap, Activity, TrendingUp, Clock,
  Database, Server, Globe, Lock, Terminal, Cpu
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PageTransition } from "@/components/PageTransition";
import { statsService } from "@/services/statsService";
import { AnimatedCounter } from "@/components/AnimatedCounter";

// Admin navigation cards configuration
const adminCards = [
  {
    id: "create-post",
    title: "Content Creator",
    subtitle: "Create & manage articles",
    description: "Write reviews, documentaries, and featured content for GameTout",
    icon: FileText,
    path: "/admin/create-post",
    color: "#00FF88",
    gradient: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
    stats: { label: "Articles", value: "∞" }
  },
  {
    id: "studios",
    title: "Studio Command",
    subtitle: "Manage game studios",
    description: "Add, edit, approve and manage game development studios database",
    icon: Building2,
    path: "/admin/studios",
    color: "#FFAB00",
    gradient: "from-yellow-500/20 to-orange-500/20",
    borderColor: "border-yellow-500/30",
    stats: { label: "Studios", value: "DB" }
  },
  {
    id: "featured",
    title: "Featured Control",
    subtitle: "Homepage spotlight",
    description: "Control what appears on the homepage featured sections",
    icon: Star,
    path: "/admin/featured",
    color: "#FF6B6B",
    gradient: "from-red-500/20 to-pink-500/20",
    borderColor: "border-red-500/30",
    stats: { label: "Featured", value: "5" }
  },
  {
    id: "portfolios",
    title: "Portfolio Control",
    subtitle: "Manage talent profiles",
    description: "Search, filter and permanently delete any portfolio profile on the platform",
    icon: Users,
    path: "/admin/portfolios",
    color: "#00D4FF",
    gradient: "from-cyan-500/20 to-blue-500/20",
    borderColor: "border-cyan-500/30",
    stats: { label: "Profiles", value: "DB" }
  },
];

// Animated background grid component
const CyberGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Perspective grid */}
    <div 
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,171,0,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,171,0,0.1) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
        transform: "perspective(500px) rotateX(60deg)",
        transformOrigin: "center top",
      }}
    />
    
    {/* Floating particles */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-primary/30 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

// Terminal-style status line
const StatusLine = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-6 text-xs font-mono text-gray-500"
    >
      <span className="flex items-center gap-2">
        <motion.div 
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-2 h-2 bg-green-500 rounded-full"
        />
        SYSTEM ONLINE
      </span>
      <span className="flex items-center gap-2">
        <Server className="w-3 h-3" />
        API: CONNECTED
      </span>
      <span className="flex items-center gap-2">
        <Database className="w-3 h-3" />
        DB: ACTIVE
      </span>
      <span className="flex items-center gap-2">
        <Clock className="w-3 h-3" />
        {time.toLocaleTimeString('en-US', { hour12: false })}
      </span>
    </motion.div>
  );
};

// 3D Card Component
const AdminCard = ({ card, index }: { card: typeof adminCards[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const Icon = card.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
      className="perspective-1000"
    >
      <Link to={card.path}>
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0, y: 0 }); }}
          onMouseMove={handleMouseMove}
          animate={{
            rotateX: isHovered ? mousePos.y * -20 : 0,
            rotateY: isHovered ? mousePos.x * 20 : 0,
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`relative group h-full bg-[#0a0a0a] border ${card.borderColor} rounded-2xl overflow-hidden cursor-pointer`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          
          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              boxShadow: `0 0 40px ${card.color}20, inset 0 0 40px ${card.color}10`,
            }}
          />

          {/* Scan line effect on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "linear" }}
                className="absolute left-0 right-0 h-[2px] pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
                  boxShadow: `0 0 20px ${card.color}`,
                }}
              />
            )}
          </AnimatePresence>

          <div className="relative p-8 h-full flex flex-col" style={{ transform: "translateZ(20px)" }}>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              {/* Icon container with glow */}
              <motion.div
                animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                className="relative"
              >
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center border"
                  style={{ 
                    backgroundColor: `${card.color}15`,
                    borderColor: `${card.color}40`,
                  }}
                >
                  <Icon className="w-8 h-8" style={{ color: card.color }} />
                </div>
                {/* Glow effect */}
                <motion.div
                  animate={{ opacity: isHovered ? 0.5 : 0 }}
                  className="absolute inset-0 rounded-xl blur-xl"
                  style={{ backgroundColor: card.color }}
                />
              </motion.div>

              {/* Stats badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                <Activity className="w-3 h-3" style={{ color: card.color }} />
                <span className="text-xs font-mono text-gray-400">
                  {card.stats.label}: <span style={{ color: card.color }}>{card.stats.value}</span>
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="font-display text-2xl text-white mb-1 group-hover:text-[#FFAB00] transition-colors">
                {card.title}
              </h3>
              <p className="text-sm font-mono uppercase tracking-widest mb-4" style={{ color: card.color }}>
                {card.subtitle}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                {card.description}
              </p>
            </div>

            {/* Footer with arrow */}
            <motion.div 
              className="flex items-center gap-2 mt-6 text-gray-600 group-hover:text-white transition-colors"
              animate={{ x: isHovered ? 5 : 0 }}
            >
              <span className="text-xs font-mono uppercase tracking-widest">Access Panel</span>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </div>

          {/* Corner accent */}
          <div 
            className="absolute top-0 right-0 w-20 h-20 opacity-20"
            style={{
              background: `linear-gradient(135deg, ${card.color}40, transparent 70%)`,
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
};

// Main Dashboard Component
export default function AdminDashboard() {
  const { dbUser } = useAuth();
  const [glitchText, setGlitchText] = useState("COMMAND CENTER");
  const [stats, setStats] = useState({
    totalContent: 0,
    studios: 0,
    reviews: 0,
    portfolios: 0
  });

  useEffect(() => {
    statsService.getAllCounts().then(data => setStats(data));
  }, []);

  // Glitch effect on title
  useEffect(() => {
    const glitchChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?";
    const originalText = "COMMAND CENTER";
    let interval: NodeJS.Timeout;

    const startGlitch = () => {
      let iterations = 0;
      interval = setInterval(() => {
        setGlitchText(
          originalText
            .split("")
            .map((char, idx) => {
              if (idx < iterations) return char;
              return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            })
            .join("")
        );
        iterations += 1;
        if (iterations > originalText.length) {
          clearInterval(interval);
        }
      }, 50);
    };

    const timeout = setTimeout(startGlitch, 500);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] pt-28 pb-16 relative overflow-hidden">
        <CyberGrid />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            {/* Status Line */}
            <StatusLine />

            {/* Main Title */}
            <div className="mt-8 mb-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 mb-4"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-2 border-dashed border-primary/30 rounded-full absolute inset-0"
                  />
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-yellow-600 rounded-full flex items-center justify-center relative">
                    <Shield className="w-8 h-8 text-black" />
                  </div>
                </div>
                <div>
                  <h1 className="font-display text-4xl md:text-6xl text-white tracking-tight">
                    ADMIN <span className="text-primary">{glitchText}</span>
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    <Lock className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-mono text-gray-500">
                      SECURITY CLEARANCE: <span className="text-green-400">LEVEL 5 // ADMIN</span>
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* User Info Bar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                    <Terminal className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-mono">OPERATOR</p>
                    <p className="text-sm text-white font-medium">{dbUser?.email || "Unknown"}</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/10 hidden md:block" />
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono text-gray-400">
                    ROLE: <span className="text-primary">{dbUser?.role}</span>
                  </span>
                </div>
                <div className="h-8 w-px bg-white/10 hidden md:block" />
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-mono text-gray-400">
                    STATUS: <span className="text-green-400">ACTIVE</span>
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <h2 className="text-xs font-mono text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Admin Modules
              <Zap className="w-4 h-4 text-primary" />
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminCards.map((card, index) => (
              <AdminCard key={card.id} card={card} index={index} />
            ))}
          </div>

          {/* Quick Stats Footer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: "Total Content", value: stats.totalContent, icon: FileText, trend: "+12%" },
              { label: "Active Studios", value: stats.studios, icon: Building2, trend: "+5%" },
              { label: "Pending Reviews", value: 0, icon: Clock, trend: "Active" }, // Pending not yet implemented
              { label: "Open Positions", value: stats.portfolios, icon: Activity, trend: "Optimal" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="relative p-4 bg-white/5 border border-white/10 rounded-lg overflow-hidden group hover:border-primary/30 transition-colors"
              >
                <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity">
                  <stat.icon className="w-full h-full" />
                </div>
                <p className="text-xs font-mono text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-display text-white">
                  <AnimatedCounter value={Number(stat.value) || 0} />
                </p>
                <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Terminal Line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 p-4 bg-black/50 border border-white/10 rounded-lg font-mono text-xs text-gray-500"
          >
            <span className="text-green-500">admin@gametout</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-white">$ </span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-primary"
            >
              Ready for commands...█
            </motion.span>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
