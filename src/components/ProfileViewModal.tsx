import { useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
    X, MapPin, Download, Github, Linkedin, Globe, Mail,
    Award, Terminal, Shield, CheckCircle, ExternalLink,
    Gamepad2, Code2, Zap, Star, Heart, Loader2,
    Phone
} from "lucide-react";
import { SkillBar } from "@/components/HealthBar";
import { usePortfolioDetail } from "@/hooks/usePortfolioDetail";
import { Developer, PortfolioDetail, STATUS_DISPLAY, BACKEND_TO_CATEGORY, GameEngine } from "@/types/portfolio"; // Import BACKEND_TO_CATEGORY
import { useAuth } from "@/context/AuthContext";

interface ProfileViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    developer: Developer | null;
    portfolioId?: number | null;
}

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 40 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            damping: 25,
            stiffness: 300,
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: 40,
        transition: { duration: 0.2 }
    }
};

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", damping: 20, stiffness: 300 }
    }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
};

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", damping: 15, stiffness: 400 }
    }
};

const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", damping: 20, stiffness: 300 }
    }
};

const slideInRight: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", damping: 20, stiffness: 300 }
    }
};

export const ProfileViewModal = ({ isOpen, onClose, developer, portfolioId }: ProfileViewModalProps) => {
    const {
        portfolio,
        loading: detailLoading,
        error: detailError,
        fetchPortfolio,
        like,
        liking,
        liked,
        clear
    } = usePortfolioDetail();

    const { isAuthenticated, dbUser } = useAuth();

    useEffect(() => {
        if (isOpen && portfolioId && portfolioId > 0) {
            fetchPortfolio(portfolioId);
        }
        if (!isOpen) {
            clear();
        }
    }, [isOpen, portfolioId, fetchPortfolio, clear]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleLike = async () => {
        if (!isAuthenticated) return;
        await like();
    };

    if (!developer) return null;

    // Derive the display role from jobCategory using BACKEND_TO_CATEGORY
    const displayRole = portfolio?.jobCategory ? BACKEND_TO_CATEGORY[portfolio.jobCategory] : developer.role;

    const displayData = {
        name: portfolio?.name || developer.name,
        role: displayRole, // Use the derived role
        location: portfolio?.location || developer.location,
        avatar: portfolio?.profilePhotoUrl || developer.avatar,
        status: portfolio?.jobStatus ? STATUS_DISPLAY[portfolio.jobStatus] : developer.status,
        exp: portfolio?.experienceYears ? `${portfolio.experienceYears} Yrs` : developer.exp,
        rate: developer.rate || "Contact for rates",
        badges: developer.badges || [], // Badges from developer for initial state
        skills: portfolio?.skills?.map(s => ({ name: s.name, level: s.score })) || developer.skills || [],
        isPremium: portfolio?.isPremium ?? developer.isPremium,
        profileSummary: portfolio?.profileSummary || null, // Full summary
        contactEmail: portfolio?.contactEmail || null,
        mobile: portfolio?.mobile || null,
        resumeUrl: portfolio?.resumeUrl || null,
        socials: portfolio?.socials || [],
        likesCount: portfolio?.likesCount || 0,
        coverPhotoUrl: portfolio?.coverPhotoUrl || null,
        tagline: portfolio?.shortDescription || null, // Short description is now tagline
        enginePreference: portfolio?.enginePreference || null,
    };

    // Prepare the stats array dynamically
    const stats = [
        { label: "Status", value: displayData.status, icon: Zap, color: "text-green-400" },
        { label: "Experience", value: displayData.exp, icon: Code2, color: "text-white" },
    ];
    // Add rate only if available and not the default "Contact for rates" string
    if (displayData.rate && displayData.rate !== "Contact for rates") {
        stats.push({ label: "Rate", value: displayData.rate, icon: Star, color: "text-[#FFAB00]" });
    }

    const gridColumnCount = stats.length; // Will be 2 or 3

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    {/* BACKDROP */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md"
                    />

                    {/* MODAL CONTAINER */}
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="pointer-events-auto w-full sm:max-w-4xl h-[95vh] sm:h-auto sm:max-h-[90vh] bg-[#0a0a0a] border-t sm:border border-[#FFAB00]/20 sm:rounded-xl rounded-t-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_100px_rgba(255,171,0,0.1)] flex flex-col"
                        >
                            {/* Mobile drag handle */}
                            <div className="sm:hidden flex justify-center pt-2 pb-1 shrink-0">
                                <div className="w-10 h-1 rounded-full bg-white/20" />
                            </div>

                            {/* Close button - floating, always visible */}
                            <motion.button
                                onClick={onClose}
                                className="fixed sm:absolute top-2 right-2 sm:top-4 sm:right-4 p-2 sm:p-2.5 bg-black/80 sm:bg-black/60 hover:bg-[#FFAB00] hover:text-black rounded-full text-white transition-all duration-300 border border-white/10 hover:border-[#FFAB00] z-[60] hover:shadow-[0_0_20px_rgba(255,171,0,0.5)]"
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </motion.button>

                            {/* SINGLE SCROLL CONTAINER - everything scrolls on mobile */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar overscroll-contain">

                                {/* --- HEADER BANNER --- */}
                                <motion.div
                                    className="relative h-36 sm:h-48 bg-gray-900 overflow-hidden group"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {/* Cover Image */}
                                    <motion.div
                                        className="absolute inset-0"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.7, ease: "easeOut" }}
                                    >
                                        <img
                                            src={displayData.coverPhotoUrl || "https://images.unsplash.com/photo-1558655146-d09347e0b7a8?w=1200"}
                                            className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-all duration-700"
                                            alt="Cover"
                                        />
                                    </motion.div>

                                    {/* Scan Lines */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />

                                    {/* Animated Gradient */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-[#FFAB00]/10 via-transparent to-[#FFAB00]/10"
                                        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                    />

                                    {/* Bottom Fade */}
                                    <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />

                                    {/* Floating Particles - hidden on mobile for performance */}
                                    <div className="hidden sm:block">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute w-1 h-1 bg-[#FFAB00]/40 rounded-full"
                                                style={{ left: `${20 + i * 15}%`, top: "30%" }}
                                                animate={{ y: [-10, 10, -10], opacity: [0.2, 0.6, 0.2] }}
                                                transition={{
                                                    duration: 2 + i * 0.5,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                    delay: i * 0.3,
                                                }}
                                            />
                                        ))}
                                    </div>

                                    {/* Corner Decorations - hidden on mobile */}
                                    <div className="hidden sm:block">
                                        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#FFAB00]/30" />
                                        <div className="absolute bottom-16 right-4 w-8 h-8 border-r-2 border-b-2 border-[#FFAB00]/30" />
                                    </div>
                                </motion.div>

                                {/* --- PROFILE HEADER SECTION --- */}
                                <div className="relative z-10 -mt-16 sm:-mt-20 px-4 sm:px-8">
                                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">

                                        {/* Avatar */}
                                        <motion.div
                                            className="relative shrink-0"
                                            variants={scaleIn}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            <motion.div
                                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-4 border-[#0a0a0a] shadow-2xl bg-[#0a0a0a] ring-2 ring-[#FFAB00]/30 relative"
                                                whileHover={{
                                                    scale: 1.05,
                                                    boxShadow: "0 0 30px rgba(255,171,0,0.4), 0 0 0 4px rgba(255,171,0,0.3)"
                                                }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {detailLoading ? (
                                                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                        <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFAB00] animate-spin" />
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={displayData.avatar}
                                                        alt={displayData.name}
                                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                                    />
                                                )}
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                                                    initial={{ x: "-200%" }}
                                                    whileHover={{ x: "200%" }}
                                                    transition={{ duration: 0.7 }}
                                                />
                                            </motion.div>

                                            {/* Online Indicator */}
                                            <motion.div
                                                className="absolute -bottom-1 -right-1 z-20"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
                                            >
                                                <span className="flex h-5 w-5 sm:h-6 sm:w-6">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-5 w-5 sm:h-6 sm:w-6 bg-green-500 border-3 sm:border-4 border-[#0a0a0a] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                                                </span>
                                            </motion.div>

                                            {/* PRO Badge */}
                                            {displayData.isPremium && (
                                                <motion.div
                                                    className="absolute -top-2 -left-2 z-20 bg-[#FFAB00] text-black text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded shadow-lg"
                                                    initial={{ scale: 0, rotate: -20 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ delay: 0.4, type: "spring" }}
                                                >
                                                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 inline mr-0.5 sm:mr-1" />
                                                    PRO
                                                </motion.div>
                                            )}
                                        </motion.div>

                                        {/* Name & Info */}
                                        <motion.div
                                            className="flex-1 pt-1 sm:pt-10 text-center sm:text-left w-full"
                                            variants={fadeInUp}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            <div className="flex flex-col gap-3 sm:gap-4">
                                                <div>
                                                    <motion.h2
                                                        className="font-display text-2xl sm:text-3xl md:text-4xl text-white uppercase leading-none flex items-center justify-center sm:justify-start gap-2 sm:gap-3 drop-shadow-lg"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.2 }}
                                                    >
                                                        {displayData.name}
                                                        {displayData.isPremium && (
                                                            <motion.div
                                                                whileHover={{ rotate: 360, scale: 1.2 }}
                                                                transition={{ duration: 0.5 }}
                                                            >
                                                                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFAB00] drop-shadow-[0_0_8px_rgba(255,171,0,0.5)]" fill="currentColor" fillOpacity={0.2} />
                                                            </motion.div>
                                                        )}
                                                    </motion.h2>

                                                    <motion.div
                                                        className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-2 sm:mt-3"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.3 }}
                                                    >
                                                        <span className="text-[#FFAB00] font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                                                            <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                            {displayData.role}
                                                        </span>
                                                        <span className="hidden sm:block w-px h-4 bg-white/20"></span>
                                                        <span className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-400 font-mono bg-white/5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                                            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FFAB00]" /> {displayData.location}
                                                        </span>
                                                        {displayData.likesCount > 0 && (
                                                            <span className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-400 font-mono bg-white/5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                                                <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-500" fill="currentColor" /> {displayData.likesCount}
                                                            </span>
                                                        )}
                                                        {displayData.enginePreference && (
                                                            <span className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-400 font-mono bg-white/5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                                                <Gamepad2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-400" /> {displayData.enginePreference}
                                                            </span>
                                                        )}
                                                    </motion.div>
                                                </div>

                                                {/* Action Buttons */}
                                                <motion.div
                                                    className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.4 }}
                                                >
                                                    {displayData.contactEmail && (
                                                        <motion.a
                                                            href={`mailto:${displayData.contactEmail}`}
                                                            className="group relative flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#FFAB00] text-black font-bold uppercase text-[10px] sm:text-xs rounded overflow-hidden shadow-[0_0_20px_rgba(255,171,0,0.4)]"
                                                            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,171,0,0.6)" }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <motion.div
                                                                className="absolute inset-0 bg-white"
                                                                initial={{ x: "-100%" }}
                                                                whileHover={{ x: "100%" }}
                                                                transition={{ duration: 0.5 }}
                                                            />
                                                            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" />
                                                            <span className="relative z-10">Contact</span>
                                                        </motion.a>
                                                    )}

                                                    {displayData.mobile && (
                                                        <motion.a
                                                            href={`tel:${displayData.mobile}`}
                                                            className="group flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#FFAB00] text-black font-bold uppercase text-[10px] sm:text-xs rounded hover:bg-[#FFAB00]/90 transition-all duration-300"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                            <span>Call</span>
                                                        </motion.a>
                                                    )}

                                                    {displayData.resumeUrl && (
                                                        <motion.a
                                                            href={displayData.resumeUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/5 border border-white/10 text-white font-bold uppercase text-[10px] sm:text-xs rounded hover:bg-white/10 hover:border-[#FFAB00]/50 transition-all duration-300"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:animate-bounce" />
                                                            <span>CV</span>
                                                        </motion.a>
                                                    )}

                                                    <motion.button
                                                        onClick={handleLike}
                                                        disabled={liking}
                                                        className={`group flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 border rounded transition-all duration-300 ${liked
                                                            ? "bg-red-500/20 border-red-500/50 text-red-500"
                                                            : "bg-white/5 border-white/10 text-white hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-500"
                                                            } ${liking ? "opacity-50 cursor-not-allowed" : ""}`}
                                                        whileHover={{ scale: liking ? 1 : 1.1 }}
                                                        whileTap={{ scale: liking ? 1 : 0.9 }}
                                                    >
                                                        {liking ? (
                                                            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                                                        ) : (
                                                            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill={liked ? "currentColor" : "none"} />
                                                        )}
                                                    </motion.button>
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* --- CONTENT AREA --- */}
                                <div className="px-4 sm:px-8 py-6 sm:py-8">
                                    <motion.div
                                        className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
                                        variants={staggerContainer}
                                        initial="hidden"
                                        animate="visible"
                                    >

                                        {/* LEFT COLUMN */}
                                        <div className="lg:col-span-2 space-y-5 sm:space-y-6">

                                            {/* Stats HUD */}
                                            <motion.div
                                                className={`grid grid-cols-${gridColumnCount} gap-2 sm:gap-4 p-4 sm:p-5 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl relative overflow-hidden group`}
                                                variants={fadeInUp}
                                                whileHover={{ borderColor: "rgba(255,171,0,0.3)" }}
                                            >
                                                <motion.div
                                                    className="absolute top-0 left-0 w-1 bg-[#FFAB00]"
                                                    initial={{ height: 0 }}
                                                    animate={{ height: "100%" }}
                                                    transition={{ duration: 0.5, delay: 0.3 }}
                                                />
                                                <div className="absolute inset-0 bg-[#FFAB00]/0 group-hover:bg-[#FFAB00]/5 transition-colors duration-500" />

                                                {stats.map((stat, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className={`text-center relative z-10 ${i > 0 ? 'border-l border-white/10' : ''}`}
                                                        whileHover={{ scale: 1.05 }}
                                                    >
                                                        <stat.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto mb-1.5 sm:mb-2 ${stat.color} opacity-60`} />
                                                        <span className="block text-[8px] sm:text-[10px] text-gray-500 uppercase tracking-widest mb-0.5 sm:mb-1">{stat.label}</span>
                                                        <span className={`block text-sm sm:text-lg font-display ${stat.color} truncate px-1`}>{stat.value}</span>
                                                    </motion.div>
                                                ))}
                                            </motion.div>

                                            {/* Mission Profile (Tagline) */}
                                            {displayData.tagline && ( // Only render if tagline exists
                                                <motion.div className="space-y-3 sm:space-y-4" variants={slideInLeft}>
                                                    <h3 className="font-display text-lg sm:text-xl text-white uppercase flex items-center gap-2">
                                                        <motion.div
                                                            animate={{ rotate: [0, 5, -5, 0] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                        >
                                                            <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFAB00]" />
                                                        </motion.div>
                                                        Tagline
                                                    </h3>
                                                    <motion.div
                                                        className="relative"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.5 }}
                                                    >
                                                        <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-[#FFAB00] via-[#FFAB00]/50 to-transparent" />
                                                        <p className="text-gray-400 leading-relaxed text-xs sm:text-sm pl-3 sm:pl-4 hover:text-gray-300 transition-colors">
                                                            {displayData.tagline}
                                                        </p>
                                                    </motion.div>
                                                </motion.div>
                                            )}

                                            {/* Profile Summary */}
                                            {displayData.profileSummary && ( // Only render if summary exists
                                                <motion.div className="space-y-3 sm:space-y-4" variants={slideInLeft}>
                                                    <h3 className="font-display text-lg sm:text-xl text-white uppercase flex items-center gap-2">
                                                        <motion.div
                                                            animate={{ rotate: [0, 5, -5, 0] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                        >
                                                            <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFAB00]" />
                                                        </motion.div>
                                                        Profile Summary
                                                    </h3>
                                                    <motion.div
                                                        className="relative"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.5 }}
                                                    >
                                                        <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-[#FFAB00] via-[#FFAB00]/50 to-transparent" />
                                                        <p className="text-gray-400 leading-relaxed text-xs sm:text-sm pl-3 sm:pl-4 hover:text-gray-300 transition-colors">
                                                            {displayData.profileSummary}
                                                        </p>
                                                    </motion.div>
                                                </motion.div>
                                            )}


                                            {/* Badges / Awards */}
                                            {/* {displayData.badges.length > 0 && ( // Only render if badges exist
                                                <motion.div variants={fadeInUp}>
                                                    <h3 className="font-display text-base sm:text-lg text-white uppercase mb-3 sm:mb-4 opacity-80 flex items-center gap-2">
                                                        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFAB00]" />
                                                        My Key Skills
                                                    </h3>
                                                    <motion.div
                                                        className="flex flex-wrap gap-2 sm:gap-3"
                                                        variants={staggerContainer}
                                                        initial="hidden"
                                                        animate="visible"
                                                    >
                                                        {displayData.badges.map((badge: string, i: number) => (
                                                            <motion.div
                                                                key={i}
                                                                variants={scaleIn}
                                                                whileHover={{
                                                                    scale: 1.1,
                                                                    backgroundColor: "rgba(255,171,0,0.15)",
                                                                    boxShadow: "0 0 15px rgba(255,171,0,0.3)"
                                                                }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 bg-[#FFAB00]/5 border border-[#FFAB00]/20 rounded-lg text-[#FFAB00] text-[10px] sm:text-xs font-bold uppercase cursor-default transition-all duration-300"
                                                            >
                                                                <Award className="w-3 h-3 sm:w-4 sm:h-4" /> {badge}
                                                            </motion.div>
                                                        ))}
                                                        {displayData.isPremium && (
                                                            <motion.div
                                                                variants={scaleIn}
                                                                whileHover={{ scale: 1.1 }}
                                                                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 bg-green-500/5 border border-green-500/20 rounded-lg text-green-400 text-[10px] sm:text-xs font-bold uppercase cursor-default"
                                                            >
                                                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Verified Pro
                                                            </motion.div>
                                                        )}
                                                    </motion.div>
                                                </motion.div>
                                            )} */}
                                        </div>

                                        {/* RIGHT COLUMN */}
                                        <motion.div className="space-y-5 sm:space-y-6" variants={slideInRight}>

                                            {/* Skills */}
                                            <motion.div
                                                className="bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-white/5 p-4 sm:p-6 rounded-xl relative overflow-hidden group"
                                                whileHover={{ borderColor: "rgba(255,171,0,0.2)" }}
                                            >
                                                <motion.div
                                                    className="absolute top-0 right-0 w-20 h-20 bg-[#FFAB00]/10 rounded-bl-full -mr-10 -mt-10"
                                                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                                                    transition={{ duration: 3, repeat: Infinity }}
                                                />
                                                <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#FFAB00]/5 rounded-tr-full -ml-8 -mb-8" />

                                                <h3 className="font-display text-base sm:text-lg text-white uppercase mb-4 sm:mb-5 relative z-10 flex items-center gap-2">
                                                    <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFAB00]" />
                                                    SkillSet
                                                </h3>

                                                <motion.div
                                                    className="space-y-3 sm:space-y-4 relative z-10"
                                                    variants={staggerContainer}
                                                    initial="hidden"
                                                    animate="visible"
                                                >
                                                    {detailLoading ? (
                                                        [...Array(3)].map((_, i) => (
                                                            <div key={i} className="h-6 bg-white/5 rounded animate-pulse" />
                                                        ))
                                                    ) : displayData.skills.length > 0 ? (
                                                        displayData.skills.map((skill, i: number) => (
                                                            <motion.div key={i} variants={fadeInUp} custom={i}>
                                                                <SkillBar skill={skill.name} level={skill.level} />
                                                            </motion.div>
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-500 text-xs sm:text-sm">No skills listed</p>
                                                    )}
                                                </motion.div>
                                            </motion.div>

                                            {/* Social Links */}
                                            <div>
                                                <h3 className="font-display text-base sm:text-lg text-white uppercase mb-3 sm:mb-4 opacity-80">Comms Channels</h3>
                                                <motion.div
                                                    className="flex flex-col gap-2"
                                                    variants={staggerContainer}
                                                    initial="hidden"
                                                    animate="visible"
                                                >
                                                    {displayData.socials.length > 0 ? (
                                                        displayData.socials.map((social, i) => {
                                                            const iconMap: Record<string, { icon: typeof Globe; color: string; hoverBg: string }> = {
                                                                linkedin: { icon: Linkedin, color: "#0077b5", hoverBg: "hover:bg-[#0077b5]/10" },
                                                                github: { icon: Github, color: "#ffffff", hoverBg: "hover:bg-white/10" },
                                                                portfolio: { icon: Globe, color: "#FFAB00", hoverBg: "hover:bg-[#FFAB00]/10" },
                                                                website: { icon: Globe, color: "#FFAB00", hoverBg: "hover:bg-[#FFAB00]/10" },
                                                                twitter: { icon: Globe, color: "#1DA1F2", hoverBg: "hover:bg-[#1DA1F2]/10" },
                                                                // Add other social platforms as needed
                                                            };
                                                            const config = iconMap[social.platform.toLowerCase()] || { icon: Globe, color: "#FFAB00", hoverBg: "hover:bg-[#FFAB00]/10" };
                                                            const SocialIcon = config.icon;

                                                            return (
                                                                <motion.a
                                                                    key={i}
                                                                    href={social.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    variants={fadeInUp}
                                                                    whileHover={{ x: 5, scale: 1.02 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    className={`flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3.5 bg-white/5 ${config.hoverBg} border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 group`}
                                                                >
                                                                    <span className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                                                                        <motion.div
                                                                            whileHover={{ rotate: 360 }}
                                                                            transition={{ duration: 0.5 }}
                                                                        >
                                                                            <SocialIcon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: config.color }} />
                                                                        </motion.div>
                                                                        {social.platform}
                                                                    </span>
                                                                    <motion.div
                                                                        initial={{ x: 0, opacity: 0.5 }}
                                                                        whileHover={{ x: 3, opacity: 1 }}
                                                                    >
                                                                        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 group-hover:text-white transition-colors" />
                                                                    </motion.div>
                                                                </motion.a>
                                                            );
                                                        })
                                                    ) : (
                                                        [
                                                            { icon: Linkedin, label: "LinkedIn", color: "#0077b5" },
                                                            { icon: Github, label: "GitHub", color: "#ffffff" },
                                                            { icon: Globe, label: "Portfolio Site", color: "#FFAB00" },
                                                        ].map((social, i) => (
                                                            <motion.div
                                                                key={i}
                                                                variants={fadeInUp}
                                                                className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3.5 bg-white/5 border border-white/10 rounded-lg text-gray-500 cursor-not-allowed"
                                                            >
                                                                <span className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold">
                                                                    <social.icon className="w-4 h-4 sm:w-5 sm:h-5 opacity-50" style={{ color: social.color }} />
                                                                    {social.label}
                                                                </span>
                                                                <span className="text-[10px] sm:text-xs opacity-50">Not linked</span>
                                                            </motion.div>
                                                        ))
                                                    )}
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* FOOTER BAR */}
                            <motion.div
                                className="h-1 sm:h-1.5 w-full bg-gradient-to-r from-[#FFAB00] via-yellow-500 to-[#FFAB00] shrink-0 shadow-[0_0_20px_#FFAB00] relative overflow-hidden"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                />
                            </motion.div>

                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};