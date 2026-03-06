import { useState, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Twitter, Youtube, Linkedin, Instagram, Facebook,
  Zap, Users, Play, Camera, MessageCircle, TrendingUp,
  Gamepad2, Trophy, Star, Sparkles, X
} from "lucide-react";

// Enhanced Social Data with descriptions and stats
const socials = [
  // { 
  //   icon: Twitter, 
  //   label: "Twitter", 
  //   handle: "@IndieGameDev",
  //   url: "#",
  //   color: "#1DA1F2",
  //   gradient: "from-[#1DA1F2] to-[#0C85D0]",
  //   description: "Hot takes & dev logs",
  //   fullDescription: "Daily game dev insights, industry news, and behind-the-scenes content",
  //   stat: "25K+",
  //   statLabel: "Followers",
  //   badge: "Active"
  // },
  { 
    icon: Linkedin, 
    label: "LinkedIn", 
    handle: "/company/gamedev",
    url: "https://www.linkedin.com/in/gametout/",
    color: "#0077B5",
    gradient: "from-[#0077B5] to-[#005885]",
    description: "Career & networking",
    fullDescription: "Job opportunities, studio news, and professional connections",
    stat: "10K+",
    statLabel: "Network",
    badge: "Hiring"
  },
  { 
    icon: Youtube, 
    label: "YouTube", 
    handle: "@DevStreams",
    url: "#",
    color: "#FF0000",
    gradient: "from-[#FF0000] to-[#CC0000]",
    description: "Tutorials & devlogs",
    fullDescription: "In-depth tutorials, game breakdowns, and live coding sessions",
    stat: "100K+",
    statLabel: "Subscribers",
    badge: "Live"
  },
  { 
    icon: Instagram, 
    label: "Instagram", 
    handle: "@gamedev.art",
    url: "#",
    color: "#E4405F",
    gradient: "from-[#E4405F] via-[#C13584] to-[#833AB4]",
    description: "Art & screenshots",
    fullDescription: "Stunning game art, concept designs, and visual inspiration",
    stat: "50K+",
    statLabel: "Followers",
    badge: "New Post"
  },
  // { 
  //   icon: Facebook, 
  //   label: "Facebook", 
  //   handle: "/GameDevCommunity",
  //   url: "#",
  //   color: "#1877F2",
  //   gradient: "from-[#1877F2] to-[#0C5DC7]",
  //   description: "Community hub",
  //   fullDescription: "Join discussions, events, and connect with fellow developers",
  //   stat: "30K+",
  //   statLabel: "Members",
  //   badge: "Community"
  // },
];

// ============================================
// MAIN COMPONENT
// ============================================
export const SocialLink3D = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* Section Header */}
      <motion.div 
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
      >
        <div className="flex items-center gap-2 text-[#FFAB00]">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-mono uppercase tracking-widest">Connect With Us</span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-[#FFAB00]/50 to-transparent" />
      </motion.div>

      {/* Social Buttons Grid */}
      <div className="flex flex-wrap gap-4 justify-center lg:justify-start perspective-1000">
        {socials.map((social, index) => (
          <SocialCard 
            key={index} 
            {...social} 
            index={index}
            isHovered={hoveredIndex === index}
            isExpanded={expandedIndex === index}
            onHover={() => setHoveredIndex(index)}
            onLeave={() => setHoveredIndex(null)}
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          />
        ))}
      </div>

      {/* Expanded Card Details Panel */}
      <AnimatePresence>
        {expandedIndex !== null && (
          <ExpandedPanel 
            social={socials[expandedIndex]} 
            onClose={() => setExpandedIndex(null)}
          />
        )}
      </AnimatePresence>

      {/* Floating CTA */}
      <motion.div
        className="mt-8 text-center lg:text-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <p className="text-xs text-gray-500 font-mono">
          <span className="text-[#FFAB00]">▸</span> Social Handles to connect GameTout™
        </p>
      </motion.div>
    </div>
  );
};

// ============================================
// SOCIAL CARD COMPONENT
// ============================================
interface SocialCardProps {
  icon: any;
  label: string;
  handle: string;
  url: string;
  color: string;
  gradient: string;
  description: string;
  stat: string;
  statLabel: string;
  badge: string;
  index: number;
  isHovered: boolean;
  isExpanded: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

const SocialCard = ({ 
  icon: Icon, 
  label, 
  handle,
  url, 
  color,
  gradient,
  description,
  stat,
  statLabel,
  badge,
  index,
  isHovered,
  isExpanded,
  onHover,
  onLeave,
  onClick
}: SocialCardProps) => {
  const cardRef = useMotionValue(0);
  
  // Mouse position for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 15 };
  const rotateX = useSpring(useTransform(mouseY, [-50, 50], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-50, 50], [-15, 15]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    onLeave();
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, rotateX: 90, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
      transition={{ 
        delay: 1.6 + index * 0.1, 
        type: "spring", 
        stiffness: 100,
        damping: 12
      }}
      onMouseEnter={onHover}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="relative cursor-pointer"
        style={{ 
          rotateX: isHovered ? rotateX : 0, 
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d"
        }}
        whileHover={{ z: 50 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Main Card */}
        <motion.div
          className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden"
          animate={{
            boxShadow: isHovered 
              ? `0 20px 40px -10px ${color}40, 0 0 20px ${color}30, inset 0 1px 0 rgba(255,255,255,0.1)`
              : "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
          }}
        >
          {/* Background layers */}
          <div className="absolute inset-0 bg-[#0a0a0a]" />
          
          {/* Animated gradient background on hover */}
          <motion.div 
            className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.15 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Tech grid pattern */}
          <motion.div 
            className="absolute inset-0"
            style={{ 
              backgroundImage: `linear-gradient(${color}20 1px, transparent 1px), linear-gradient(90deg, ${color}20 1px, transparent 1px)`,
              backgroundSize: '8px 8px' 
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.4 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Scanning line effect */}
          <motion.div
            className="absolute left-0 right-0 h-[2px]"
            style={{ 
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              boxShadow: `0 0 10px ${color}`
            }}
            initial={{ top: "-10%", opacity: 0 }}
            animate={isHovered ? {
              top: ["0%", "100%", "0%"],
              opacity: [0, 1, 0]
            } : { top: "-10%", opacity: 0 }}
            transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
          />

          {/* Border glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{ 
              border: `1px solid ${isHovered ? color : 'rgba(255,255,255,0.1)'}`,
              transition: 'border-color 0.3s'
            }}
          />

          {/* Animated corner accents */}
          {isHovered && (
            <>
              <motion.div 
                className="absolute top-1 left-1 w-3 h-3"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-full h-[1px]" style={{ background: color }} />
                <div className="w-[1px] h-full" style={{ background: color }} />
              </motion.div>
              <motion.div 
                className="absolute bottom-1 right-1 w-3 h-3"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
              >
                <div className="absolute bottom-0 w-full h-[1px]" style={{ background: color }} />
                <div className="absolute right-0 w-[1px] h-full" style={{ background: color }} />
              </motion.div>
            </>
          )}

          {/* Icon Container */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <motion.div
              animate={{
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? [0, -5, 5, 0] : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <Icon 
                className="w-6 h-6 md:w-7 md:h-7 transition-colors duration-300"
                style={{ color: isHovered ? color : '#6B7280' }}
              />
            </motion.div>
          </div>

          {/* Floating particles on hover */}
          <AnimatePresence>
            {isHovered && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{ 
                      background: color,
                      boxShadow: `0 0 4px ${color}`,
                      left: `${20 + Math.random() * 60}%`,
                      bottom: "10%"
                    }}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ 
                      y: -50 - Math.random() * 30, 
                      opacity: [0, 1, 0],
                      x: (Math.random() - 0.5) * 20
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.8 + Math.random() * 0.4,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 0.5
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Pulse ring on click */}
          {isExpanded && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{ border: `2px solid ${color}` }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* Badge indicator */}
        <motion.div
          className="absolute -top-1 -right-1 z-20"
          initial={{ scale: 0 }}
          animate={{ scale: isHovered ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div 
            className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-black"
            style={{ background: color, boxShadow: `0 0 10px ${color}` }}
          >
            {badge}
          </div>
        </motion.div>

        {/* Stat bubble */}
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: 5, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            y: isHovered ? 0 : 5,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <div 
            className="flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold whitespace-nowrap"
            style={{ 
              background: `linear-gradient(135deg, ${color}20, ${color}10)`,
              border: `1px solid ${color}30`,
              color: color
            }}
          >
            <TrendingUp className="w-2 h-2" />
            {stat}
          </div>
        </motion.div>

        {/* Floor reflection/shadow */}
        <motion.div
          className="absolute -bottom-3 left-1 right-1 h-4 rounded-full blur-lg"
          style={{ background: color }}
          animate={{ opacity: isHovered ? 0.4 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Tooltip with description */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute bottom-full left-1/2 mb-4 z-30 pointer-events-none"
            initial={{ opacity: 0, y: 10, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className="relative px-4 py-3 rounded-xl text-center min-w-[140px] backdrop-blur-xl"
              style={{ 
                background: `linear-gradient(135deg, rgba(10,10,10,0.95), rgba(20,20,20,0.95))`,
                border: `1px solid ${color}40`,
                boxShadow: `0 10px 40px -10px ${color}30`
              }}
            >
              {/* Platform name */}
              <div className="font-display text-sm uppercase tracking-wider mb-0.5" style={{ color }}>
                {label}
              </div>
              
              {/* Handle */}
              <div className="text-[10px] text-gray-500 font-mono mb-2">
                {handle}
              </div>
              
              {/* Description */}
              <div className="text-[10px] text-gray-400 leading-relaxed">
                {description}
              </div>

              {/* Arrow */}
              <div 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                style={{ 
                  background: 'rgba(20,20,20,0.95)',
                  borderRight: `1px solid ${color}40`,
                  borderBottom: `1px solid ${color}40`
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================
// EXPANDED PANEL COMPONENT
// ============================================
// ============================================
// EXPANDED PANEL COMPONENT - FIXED
// ============================================
const ExpandedPanel = ({ social, onClose }: { social: typeof socials[0]; onClose: () => void }) => {
  const Icon = social.icon;
  
  return (
    <motion.div
      className="mt-8 relative"
      initial={{ opacity: 0, height: 0, y: -20 }}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      exit={{ opacity: 0, height: 0, y: -20 }}
      transition={{ duration: 0.4, type: "spring", damping: 20 }}
    >
      <div 
        className="relative p-6 rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(10,10,10,0.95), rgba(15,15,15,0.95))`,
          border: `1px solid ${social.color}30`,
          boxShadow: `0 20px 60px -20px ${social.color}20`
        }}
      >
        {/* Background effects */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(${social.color} 1px, transparent 1px), linear-gradient(90deg, ${social.color} 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
        
        {/* Animated gradient orb */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl"
          style={{ background: social.color }}
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Close button - FIXED */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
            e.preventDefault();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center border transition-colors z-50 cursor-pointer"
          style={{ 
            borderColor: `${social.color}30`,
            color: social.color,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)'
          }}
          whileHover={{ 
            scale: 1.1, 
            borderColor: social.color,
            background: `linear-gradient(135deg, ${social.color}20, ${social.color}10)`
          }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <X className="w-4 h-4" />
        </motion.button>

        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
          
          {/* Left side - Icon and basic info */}
          <div className="flex-shrink-0">
            <motion.div
              className="w-20 h-20 rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${social.color}20, transparent)`,
                border: `1px solid ${social.color}40`
              }}
              animate={{ 
                boxShadow: [
                  `0 0 20px ${social.color}20`,
                  `0 0 40px ${social.color}30`,
                  `0 0 20px ${social.color}20`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Rotating border */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `conic-gradient(from 0deg, transparent, ${social.color}, transparent)`,
                  opacity: 0.3
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              
              <Icon className="w-10 h-10 relative z-10" style={{ color: social.color }} />
            </motion.div>
          </div>

          {/* Right side - Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-display text-2xl uppercase tracking-wider" style={{ color: social.color }}>
                {social.label}
              </h3>
              <span 
                className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                style={{ 
                  background: `${social.color}20`,
                  color: social.color,
                  border: `1px solid ${social.color}40`
                }}
              >
                {social.badge}
              </span>
            </div>

            <p className="text-gray-500 font-mono text-sm mb-4">{social.handle}</p>

            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md">
              {social.fullDescription}
            </p>

            {/* Stats row */}
            <div className="flex gap-6 mb-6">
              <div className="text-center">
                <div className="font-display text-2xl" style={{ color: social.color }}>{social.stat}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">{social.statLabel}</div>
              </div>
              <div className="text-center">
                <div className="font-display text-2xl text-white">Daily</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Updates</div>
              </div>
              <div className="text-center">
                <div className="font-display text-2xl text-green-400">Active</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Status</div>
              </div>
            </div>

            {/* What you'll get section */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">What You'll Get</h4>
              <div className="grid grid-cols-2 gap-2">
                {getPerksForPlatform(social.label).map((perk, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-2 text-xs text-gray-400"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: social.color, boxShadow: `0 0 6px ${social.color}` }}
                    />
                    {perk}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <motion.a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl font-bold uppercase text-sm tracking-wider transition-all group"
              style={{
                background: `linear-gradient(135deg, ${social.color}, ${adjustColor(social.color, -30)})`,
                color: '#000',
                boxShadow: `0 10px 30px -10px ${social.color}60`
              }}
              whileHover={{ scale: 1.02, boxShadow: `0 15px 40px -10px ${social.color}80` }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Follow Now</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.div>
            </motion.a>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
          <motion.div
            className="h-full"
            style={{ background: `linear-gradient(90deg, transparent, ${social.color}, transparent)` }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// HELPER FUNCTIONS
// ============================================
const getPerksForPlatform = (platform: string): string[] => {
  const perks: Record<string, string[]> = {
    Twitter: [
      "Real-time dev updates",
      "Industry hot takes",
      "Quick tips & tricks",
      "Community discussions"
    ],
    LinkedIn: [
      "Job opportunities",
      "Professional insights",
      "Studio announcements",
      "Career growth tips"
    ],
    YouTube: [
      "In-depth tutorials",
      "Game dev breakdowns",
      "Live coding streams",
      "Exclusive content"
    ],
    Instagram: [
      "Stunning game art",
      "Behind-the-scenes",
      "Concept designs",
      "Visual inspiration"
    ],
    Facebook: [
      "Community events",
      "Group discussions",
      "Exclusive previews",
      "Developer AMAs"
    ]
  };
  return perks[platform] || [];
};

const adjustColor = (hex: string, amount: number): string => {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};

// ============================================
// COMPACT VARIANT (Alternative Style)
// ============================================
export const SocialLinksCompact = () => {
  return (
    <div className="flex items-center gap-6">
      {/* Label */}
      <div className="hidden md:flex items-center gap-2 text-gray-500">
        <span className="text-xs font-mono uppercase tracking-widest">Follow</span>
        <div className="w-8 h-px bg-gradient-to-r from-gray-500 to-transparent" />
      </div>

      {/* Social Icons Row */}
      <div className="flex gap-2">
        {socials.map((social, index) => {
          const Icon = social.icon;
          return (
            <motion.a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, type: "spring" }}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Background */}
              <motion.div
                className="absolute inset-0 rounded-lg transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                whileHover={{ 
                  background: `${social.color}20`,
                  borderColor: social.color
                }}
              />

              {/* Icon */}
              <Icon 
                className="w-4 h-4 transition-colors relative z-10"
                style={{ color: '#6B7280' }}
              />

              {/* Hover color overlay */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon className="w-4 h-4" style={{ color: social.color }} />
              </motion.div>

              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ boxShadow: `0 0 20px ${social.color}40` }}
              />
            </motion.a>
          );
        })}
      </div>

      {/* Live indicator */}
      <motion.div 
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        animate={{ borderColor: ['rgba(255,255,255,0.1)', 'rgba(255,171,0,0.3)', 'rgba(255,255,255,0.1)'] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </div>
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Active</span>
      </motion.div>
    </div>
  );
};

export default SocialLink3D;