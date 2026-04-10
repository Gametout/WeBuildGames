import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Youtube, Linkedin, Instagram, TrendingUp,
  Sparkles
} from "lucide-react";

// Custom Discord Icon
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

// Custom Steam Icon
const SteamIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
  </svg>
);

// Enhanced Social Data with descriptions and stats
const socials = [
  { 
    icon: DiscordIcon, 
    label: "Discord", 
    handle: "GameTout Community",
    url: "https://discord.com/invite/7c5hD3zken",
    color: "#7289DA",
    gradient: "from-[#7289DA] to-[#5865F2]",
    description: "Join our community",
    stat: "5K+",
    statLabel: "Members",
    badge: "Active"
  },
  { 
    icon: SteamIcon, 
    label: "Steam", 
    handle: "GameTout",
    url: "https://store.steampowered.com/curator/45509592/",
    color: "#66c0f4",
    gradient: "from-[#66c0f4] to-[#1b2838]",
    description: "Games & Wishlist",
    stat: "Coming",
    statLabel: "Soon",
    badge: "New"
  },
  { 
    icon: Linkedin, 
    label: "LinkedIn", 
    handle: "/gametout",
    url: "https://www.linkedin.com/in/gametout/?originalSubdomain=in",
    color: "#0077B5",
    gradient: "from-[#0077B5] to-[#005885]",
    description: "Career & networking",
    stat: "10K+",
    statLabel: "Network",
    badge: "Hiring"
  },
  { 
    icon: Youtube, 
    label: "YouTube", 
    handle: "@GameTout",
    url: "https://www.youtube.com/@GameTout",
    color: "#FF0000",
    gradient: "from-[#FF0000] to-[#CC0000]",
    description: "Podcasts & reviews",
    stat: "100K+",
    statLabel: "Subscribers",
    badge: "Live"
  },
  { 
    icon: Instagram, 
    label: "Instagram", 
    handle: "@game_tout",
    url: "https://www.instagram.com/game_tout",
    color: "#E4405F",
    gradient: "from-[#E4405F] via-[#C13584] to-[#833AB4]",
    description: "Life updates & behind the scenes",
    stat: "50K+",
    statLabel: "Followers",
    badge: "New Post"
  },
];

// ============================================
// MAIN COMPONENT
// ============================================
export const SocialLink3D = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
            onHover={() => setHoveredIndex(index)}
            onLeave={() => setHoveredIndex(null)}
          />
        ))}
      </div>

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
  onHover: () => void;
  onLeave: () => void;
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
  onHover,
  onLeave
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

  // Handle click to open link
  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
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
      onClick={handleClick}
      style={{ perspective: 1000, cursor: 'pointer' }}
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