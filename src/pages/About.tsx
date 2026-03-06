import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate, useScroll } from "framer-motion";
import { Copy, Check, Headphones, Users, Gamepad2, Film, MessageSquare, Award, Send, Terminal, Mail, User, Lock, ChevronDown, Zap, Globe, ArrowRight } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/PageTransition";
import { TypewriterText } from "@/components/TypewriterText";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { SecurityAuthModal } from "@/components/SecurityAuthModal";
import { SocialLink3D } from "@/components/SocialLink3d";
import { BackgroundBeams } from "@/components/BackgroundBeams";

// Hook to detect mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

// Animated Counter Component
const AnimatedCounter = ({ value, label }: { value: string; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const numericValue = parseInt(value.replace(/\D/g, ""));
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, numericValue, { duration: 2.5, ease: "easeOut" });
      const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));
      return () => {
        controls.stop();
        unsubscribe();
      };
    }
  }, [isInView, numericValue, count, rounded]);

  return (
    <div ref={ref} className="text-center p-4 sm:p-6 relative">
      <div className="font-display text-[clamp(2.2rem,8vw,5rem)] text-primary leading-none tracking-tight">
        {displayValue}
        {value.includes("+") && (
          <span className="text-primary">+</span>
        )}
      </div>
      <div className="font-mono text-xs sm:text-sm md:text-base text-foreground/70 uppercase tracking-wider sm:tracking-widest mt-2 sm:mt-4">
        {label}
      </div>
    </div>
  );
};

// Floating Particles Component
const FloatingParticles = () => {
  const isMobile = useIsMobile();
  const particleCount = isMobile ? 8 : 20;

  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Contact Section Component
const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Message sent successfully",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setIsAuthenticated(true);
    toast({
      title: "Access Granted",
      description: "You can now submit your message.",
    });
  };

  return (
    <>
      <section className="relative py-16 sm:py-24 md:py-32 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <BackgroundBeams />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <FadeInView>
            <div className="mb-10 sm:mb-16 text-center">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "4rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="h-[2px] bg-primary mx-auto mb-6 sm:mb-8"
              />
              {/* <div className="inline-flex items-center gap-2 px-3 sm:px-5 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6 sm:mb-8"> */}
                {/* <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> */}
                {/* <span className="font-mono text-sm sm:text-base text-primary tracking-wider">system.contact()</span> */}
              {/* </div> */}

              <h2 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-8 tracking-tight">
                <TypewriterText text="GET IN TOUCH" delay={300} speed={80} />
              </h2>

              <p className="text-foreground/70 max-w-lg mx-auto text-base sm:text-lg md:text-xl leading-relaxed px-2">
                <span className="text-primary font-bold">{">"}</span>Drop your queries and we'll respond within 24 hours.
              </p>
            </div>
          </FadeInView>

          <FadeInView delay={0.2}>
            <motion.div
              className="relative p-5 sm:p-8 md:p-12 rounded-xl sm:rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(145deg, hsl(0 0% 6% / 0.9) 0%, hsl(0 0% 3% / 0.9) 100%)",
                border: "1px solid hsl(0 0% 100% / 0.08)",
              }}
            >
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

              <form onSubmit={handleSubmit} className="relative z-10 space-y-5 sm:space-y-8">
                {/* Name Input */}
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-mono text-foreground/60 mb-2 sm:mb-3 uppercase tracking-widest font-medium">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${focusedField === 'name' ? 'text-primary' : 'text-foreground/30'}`} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder="Enter your name..."
                      className="w-full pl-10 sm:pl-14 pr-4 sm:pr-5 py-3.5 sm:py-5 bg-white/[0.03] border border-white/[0.08] rounded-lg sm:rounded-xl text-base sm:text-lg text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-primary/40 focus:bg-primary/[0.02] focus:shadow-[0_0_24px_-5px_hsl(43_100%_50%_/_0.12)] transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-mono text-foreground/60 mb-2 sm:mb-3 uppercase tracking-widest font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-primary' : 'text-foreground/30'}`} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder="your@email.com"
                      className="w-full pl-10 sm:pl-14 pr-4 sm:pr-5 py-3.5 sm:py-5 bg-white/[0.03] border border-white/[0.08] rounded-lg sm:rounded-xl text-base sm:text-lg text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-primary/40 focus:bg-primary/[0.02] focus:shadow-[0_0_24px_-5px_hsl(43_100%_50%_/_0.12)] transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Message Input */}
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-mono text-foreground/60 mb-2 sm:mb-3 uppercase tracking-widest font-medium">
                    Message
                  </label>
                  <div className="relative">
                    <MessageSquare className={`absolute left-3 sm:left-4 top-4 sm:top-5 w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${focusedField === 'message' ? 'text-primary' : 'text-foreground/30'}`} />
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={4}
                      placeholder="Type your message here..."
                      className="w-full pl-10 sm:pl-14 pr-4 sm:pr-5 py-3.5 sm:py-5 bg-white/[0.03] border border-white/[0.08] rounded-lg sm:rounded-xl text-base sm:text-lg text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-primary/40 focus:bg-primary/[0.02] focus:shadow-[0_0_24px_-5px_hsl(43_100%_50%_/_0.12)] transition-all duration-300 resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-2.5 sm:gap-3 px-6 sm:px-8 py-4 sm:py-5 bg-primary text-primary-foreground rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_-5px_hsl(43_100%_50%_/_0.3)] hover:shadow-[0_0_40px_-5px_hsl(43_100%_50%_/_0.5)] transition-shadow duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      />
                      <span>TRANSMITTING...</span>
                    </>
                  ) : isAuthenticated ? (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>SEND MESSAGE</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>VERIFY & SEND</span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Status Bar */}
              <div className="mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-white/[0.06] font-mono text-xs sm:text-sm text-foreground/40 flex items-center justify-between gap-2">
                <span className="truncate">AES-256 Encrypted</span>
                <span className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
                  <span className="hidden sm:inline">{isAuthenticated ? "Authenticated" : "Pending Verification"}</span>
                  <span className="sm:hidden">{isAuthenticated ? "Auth" : "Pending"}</span>
                </span>
              </div>
            </motion.div>
          </FadeInView>
        </div>
      </section>

      <SecurityAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

// Glitch Image Component
const GlitchImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl sm:rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute -inset-[1px] rounded-xl sm:rounded-2xl bg-gradient-to-b from-primary/20 via-transparent to-primary/10 pointer-events-none z-10" />

      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
      />

      {isHovered && (
        <>
          <motion.div
            className="absolute inset-0 bg-primary/15 mix-blend-multiply rounded-xl sm:rounded-2xl"
            animate={{
              x: [0, -5, 5, -3, 0],
              opacity: [0, 1, 0.5, 1, 0],
            }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
          <motion.img
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-60 rounded-xl sm:rounded-2xl"
            style={{ filter: "hue-rotate(90deg)" }}
            animate={{
              x: [0, 3, -3, 2, 0],
              clipPath: [
                "inset(0 0 90% 0)",
                "inset(20% 0 60% 0)",
                "inset(40% 0 40% 0)",
                "inset(80% 0 10% 0)",
                "inset(0 0 90% 0)",
              ],
            }}
            transition={{ duration: 0.15, repeat: Infinity }}
          />
          <motion.img
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-60 rounded-xl sm:rounded-2xl"
            style={{ filter: "hue-rotate(-90deg)" }}
            animate={{
              x: [0, -3, 3, -2, 0],
              clipPath: [
                "inset(80% 0 10% 0)",
                "inset(60% 0 20% 0)",
                "inset(30% 0 50% 0)",
                "inset(10% 0 80% 0)",
                "inset(80% 0 10% 0)",
              ],
            }}
            transition={{ duration: 0.15, repeat: Infinity, delay: 0.05 }}
          />
        </>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent rounded-xl sm:rounded-2xl pointer-events-none" />
      <div className="absolute inset-0 scanlines pointer-events-none opacity-30 rounded-xl sm:rounded-2xl" />
    </motion.div>
  );
};

// Ecosystem Card Component
const EcosystemCard = ({
  icon: Icon,
  title,
  description,
  index = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.1, 0, 1] }}
    whileHover={{ y: -6 }}
    className="relative p-5 sm:p-7 md:p-8 rounded-xl sm:rounded-2xl overflow-hidden group cursor-default"
    style={{
      background: "linear-gradient(165deg, hsl(0 0% 7% / 0.9) 0%, hsl(0 0% 3% / 0.9) 100%)",
      border: "1px solid hsl(0 0% 100% / 0.08)",
    }}
  >
    <motion.div
      className="absolute top-0 left-0 right-0 h-[2px]"
      style={{
        background: "linear-gradient(90deg, transparent, hsl(43 100% 50% / 0.4), transparent)",
      }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.08 + 0.3 }}
    />

    <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
      style={{
        background: "radial-gradient(circle at 50% 0%, hsl(43 100% 50% / 0.06) 0%, transparent 70%)",
      }}
    />

    <div className="relative z-10">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:border-primary/40 group-hover:bg-primary/15 transition-all duration-500">
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary/80 group-hover:text-primary transition-colors duration-500" />
      </div>
      <h3 className="font-display text-xl sm:text-2xl text-foreground mb-2 sm:mb-3 tracking-tight">{title}</h3>
      <p className="text-foreground/60 text-base sm:text-lg leading-relaxed group-hover:text-foreground/70 transition-colors duration-500">{description}</p>
    </div>
  </motion.div>
);

// Timeline Item Component
const TimelineItem = ({
  year,
  title,
  description,
  index,
}: {
  year: string;
  title: string;
  description: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-30px" }}
    transition={{ duration: 0.6, delay: 0.1 }}
    className="relative pl-8 sm:pl-10 pb-10 sm:pb-14 last:pb-0"
  >
    <div className="absolute left-[3px] sm:left-[4px] top-3 bottom-0 w-[2px] bg-gradient-to-b from-primary/50 to-transparent" />
    <div className="absolute left-0 top-2 w-2 h-2 sm:w-[10px] sm:h-[10px] rounded-full bg-primary shadow-[0_0_12px_hsl(43_100%_50%_/_0.6)]" />

    <div className="font-mono text-xs sm:text-sm text-primary font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-1.5 sm:mb-2">{year}</div>
    <h4 className="font-display text-xl sm:text-2xl text-foreground mb-1.5 sm:mb-2">{title}</h4>
    <p className="text-foreground/65 text-base sm:text-lg leading-relaxed">{description}</p>
  </motion.div>
);

const stats = [
  { label: "Industry Interviews", value: "300+" },
  { label: "Game Reviews", value: "100+" },
  { label: "Podcasts Hosted", value: "50+" },
  { label: "Documentaries", value: "30+" },
];

// const roles = ["Video Game Journalist", "Documentary Maker", "Steam Curator", "Community Builder"];

const milestones = [
  { year: "The Beginning", title: "GameTout™ Channel Launch", description: "Started covering the Indian game development scene with honest, ground-level reporting." },
  { year: "Growing Impact", title: "300+ Industry Interviews", description: "Became the go-to interviewer for Indian game developers, covering events like IGDC extensively." },
  { year: "Community Building", title: "Indian Gamedev Mixer", description: "Founded the specialized community connecting gamedevs and artists across India." },
  { year: "Present Day", title: "Ecosystem Architect", description: "Running multiple initiatives including podcasts, meetups, and advocacy groups for the Indian gamedev scene." },
];

const About = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const email = "thegametout@gmail.com";
  const heroRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // On mobile: no fade out at all (always 1). On desktop: fade from 1→0
  const heroOpacity = useTransform(
    scrollYProgress,
    [0, 0.5],
    isMobile ? [1, 1] : [1, 0]
  );
  const heroY = useTransform(
    scrollYProgress,
    [0, 0.5],
    isMobile ? [0, 0] : [0, -50]
  );

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    toast({
      title: "Email copied!",
      description: "Contact email copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-background overflow-x-hidden">
        {/* ===== HERO SECTION ===== */}
        <section
          ref={heroRef}
          className="relative min-h-[auto] lg:min-h-[100dvh] flex items-center py-20 sm:py-24 px-4 md:px-8"
        >
          <FloatingParticles />

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-primary/[0.03] rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
          </div>

          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="max-w-7xl mx-auto w-full relative z-10"
          >
            <div className="grid lg:grid-cols-[1fr,1.2fr] gap-10 sm:gap-16 lg:gap-24 items-center">
              {/* Left: Portrait */}
              <FadeInView>
                <div className="relative max-w-sm sm:max-w-md mx-auto lg:max-w-none">
                  <motion.div
                    initial={{ rotate: -12, scale: 0, opacity: 0 }}
                    animate={{ rotate: -12, scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                    className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 z-20 px-3 py-1.5 sm:px-4 sm:py-2 bg-destructive/90 font-display text-sm sm:text-lg text-destructive-foreground uppercase tracking-widest rounded-sm"
                    style={{ boxShadow: "3px 3px 0 hsl(0 0% 0% / 0.4)" }}
                  >
                    Founder
                  </motion.div>

                  <div className="aspect-[3/4]">
                    <GlitchImage
                      src="/WebsitePic.png"
                      alt="GameTout Founder"
                    />
                  </div>

                  {/* <div className="flex flex-wrap gap-2 sm:gap-2.5 mt-6 sm:mt-8 justify-center lg:justify-start">
                    {roles.map((role, index) => (
                      <motion.span
                        key={role}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + index * 0.1, ease: [0.25, 0.1, 0, 1] }}
                        className="px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/8 border border-primary/20 text-primary text-[11px] sm:text-sm font-mono uppercase tracking-wider"
                      >
                        {role}
                      </motion.span>
                    ))}
                  </div> */}
                </div>
              </FadeInView>

              {/* Right: Bio */}
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4 sm:mb-6"
                >
                  <span className="font-mono text-xs sm:text-sm text-foreground/50 uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                    // An Initiative by
                  </span>
                </motion.div>

                <h1 className="font-display text-[clamp(2.2rem,6vw,5rem)] leading-[0.92] mb-6 sm:mb-8 tracking-tight">
                  <span className="text-gradient-gold">GAMETOUT™</span>
                  <br />
                  <span className="text-foreground">Voice of Indie Games</span>
                </h1>

                <div className="mb-8 sm:mb-10">
                  <TypewriterText
                    text="The Website is founded and managed by GameTout™"
                    className="text-base sm:text-lg md:text-xl text-foreground/70 leading-relaxed"
                    speed={30}
                    delay={500}
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="space-y-4 sm:space-y-6 max-w-xl mx-auto lg:mx-0"
                >
                  <p className="text-foreground/85 leading-[1.7] sm:leading-[1.8] text-base sm:text-lg">
                    GameTout™ is a highly visible and respected figure in the Indian game development ecosystem,
                    known for his commitment to being upfront and speaking his mind. His work is closely followed
                    by almost all studios and key individuals in the industry.
                  </p>
                  <p className="text-foreground/75 leading-[1.7] sm:leading-[1.8] text-base sm:text-lg">
                    A dedicated game reviewer, documentary maker, and prominent Video Game Journalist, he
                    specializes in ground-level interviews and critical analysis of industry events like IGDC.
                    He is an essential advocate, documentarian, and connector for the Indian gamedev scene.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  <SocialLink3D />
                </motion.div>

                {/* Scroll indicator - desktop only */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  className="mt-12 sm:mt-16 hidden lg:flex items-center gap-3"
                >
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <ChevronDown className="w-5 h-5 text-foreground/30" />
                  </motion.div>
                  <span className="font-mono text-sm text-foreground/30 uppercase tracking-widest">
                    Scroll to explore
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ===== STATS SECTION ===== */}
        <section className="relative py-16 sm:py-24 px-4 md:px-8">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />

          <div className="max-w-5xl mx-auto relative z-10">
            <FadeInView>
              <div className="text-center mb-10 sm:mb-16">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "4rem" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="h-[2px] bg-primary mx-auto mb-6 sm:mb-8"
                />
                <span className="font-mono text-xs sm:text-sm text-primary font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                  // Mission Stats
                </span>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mt-3 sm:mt-4 tracking-tight">
                  Career <span className="text-gradient-gold">Metrics</span>
                </h2>
              </div>
            </FadeInView>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm overflow-hidden group"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: "radial-gradient(circle at 50% 50%, hsl(43 100% 50% / 0.05) 0%, transparent 70%)",
                    }}
                  />
                  <AnimatedCounter value={stat.value} label={stat.label} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== JOURNEY / TIMELINE SECTION ===== */}
        {/* <section className="py-16 sm:py-24 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeInView>
              <div className="text-center mb-10 sm:mb-16">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "4rem" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="h-[2px] bg-primary mx-auto mb-6 sm:mb-8"
                />
                <span className="font-mono text-xs sm:text-sm text-primary font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                  // The Journey
                </span>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mt-3 sm:mt-4 tracking-tight">
                  Key <span className="text-gradient-gold">Milestones</span>
                </h2>
              </div>
            </FadeInView>

            <div className="max-w-2xl mx-auto">
              {milestones.map((milestone, index) => (
                <TimelineItem key={index} {...milestone} index={index} />
              ))}
            </div>
          </div>
        </section> */}

        {/* ===== ECOSYSTEM SECTION ===== */}
        {/* <section className="py-16 sm:py-24 px-4 md:px-8 relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-primary/[0.02] rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <FadeInView>
              <div className="text-center mb-10 sm:mb-16">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "4rem" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="h-[2px] bg-primary mx-auto mb-6 sm:mb-8"
                />
                <span className="font-mono text-xs sm:text-sm text-primary font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                  // The Ecosystem
                </span>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mt-3 sm:mt-4 tracking-tight">
                  Building the <span className="text-gradient-gold">Network</span>
                </h2>
                <p className="text-foreground/65 text-base sm:text-lg md:text-xl mt-4 sm:mt-6 max-w-lg mx-auto leading-relaxed px-2">
                  A growing ecosystem of communities, content, and connections powering the Indian gamedev scene.
                </p>
              </div>
            </FadeInView>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              <EcosystemCard
                icon={Headphones}
                title="GameTout™ Gossip Podcast"
                description="A candid discussion platform available on YouTube & Spotify — a key space for interviewing and engaging with Global Gaming Personalities."
                index={0}
              />
              <EcosystemCard
                icon={Users}
                title="Indian Gamedev Mixer"
                description="A specialized community for gamedevs and artists to connect, with a dedicated YouTube channel to further promote and showcase local talent."
                index={1}
              />
              <EcosystemCard
                icon={Award}
                title="Women Gamedev Mixer"
                description="A dedicated group managed by GameTout™ to foster inclusion and support for women in the Indian games industry."
                index={2}
              />
              <EcosystemCard
                icon={MessageSquare}
                title="Bharat Gamedev Mixer"
                description="Active WhatsApp networking channels through Bharat Gamedev Mixer / Indian GameDev Mixer for real-time industry connections."
                index={3}
              />
              <EcosystemCard
                icon={Gamepad2}
                title="Steam Curator"
                description="Operating as a Steam Curator, promoting indie and Indian-made games to a global audience. Helping hidden gems find their players."
                index={4}
              />
              <EcosystemCard
                icon={Film}
                title="Documentary Series"
                description="An extensive body of work including over 30 documentaries — long-form cinematic content exploring the stories behind India's most innovative game studios."
                index={5}
              />
            </div>
          </div>
        </section> */}

        {/* ===== CTA SECTION ===== */}
        {/* <section className="py-16 sm:py-24 px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-6 sm:p-10 md:p-16 rounded-xl sm:rounded-2xl overflow-hidden text-center"
              style={{
                background: "linear-gradient(165deg, hsl(0 0% 7% / 0.9) 0%, hsl(0 0% 3% / 0.9) 100%)",
                border: "1px solid hsl(0 0% 100% / 0.08)",
              }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 sm:w-80 h-32 sm:h-40 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute inset-0 scanlines pointer-events-none opacity-20 rounded-xl sm:rounded-2xl" />

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center mx-auto mb-6 sm:mb-10"
                >
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </motion.div>

                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 tracking-tight leading-tight">
                  Website & Magazine{" "}
                  <span className="text-gradient-gold">Dropping Soon</span>
                </h2>

                <p className="text-foreground/65 mb-8 sm:mb-12 text-base sm:text-lg md:text-xl leading-relaxed">
                  Connect with the source. Join the movement.
                </p> */}

                {/* Email Copy Button */}
                {/* <motion.button
                  onClick={copyEmail}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex items-center gap-2.5 sm:gap-4 px-4 sm:px-8 py-3.5 sm:py-5 bg-white/[0.04] border border-white/[0.1] rounded-lg sm:rounded-xl text-sm sm:text-lg text-foreground/80 hover:border-primary/30 hover:bg-primary/[0.04] transition-all duration-300 max-w-full"
                >
                  {copied ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 shrink-0" />
                  ) : (
                    <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                  )}
                  <span className="font-mono truncate">{email}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0 hidden sm:block" />
                </motion.button>

                <div className="mt-8 sm:mt-12 flex items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-foreground/35 uppercase tracking-wider sm:tracking-widest">
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    India
                  </span>
                  <span className="w-px h-3 sm:h-4 bg-foreground/15" />
                  <span>Active</span>
                  <span className="w-px h-3 sm:h-4 bg-foreground/15" />
                  <span>Public</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section> */}

        {/* ===== CONTACT SECTION ===== */}
        <ContactSection />

        <Footer />
      </main>
    </PageTransition>
  );
};

export default About;