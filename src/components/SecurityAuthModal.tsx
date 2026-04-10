import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Unlock, X, Terminal, Fingerprint, Mail, Key, Github, Chrome, ChevronRight, ArrowRight, AlertCircle, Gamepad2, Linkedin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

// Discord icon component
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

// Steam icon component  
const SteamIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0z" />
  </svg>
);

interface SecurityAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SecurityAuthModal = ({
  isOpen,
  onClose,
  onSuccess,
}: SecurityAuthModalProps) => {
  const {
    loginWithGoogle,
    loginWithGithub,
    loginWithEmail,
    registerWithEmail,
    loginWithDiscord,
    loginWithLinkedIn,
    loginWithSteam,
  } = useAuth();
  const [sliderValue, setSliderValue] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // --- SLIDER LOGIC ---
  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current || isUnlocked) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderValue(percentage);
    if (percentage >= 95) handleUnlock();
  };

  const handleUnlock = async () => {
    // Play unlock sound effect logic here if needed
    setIsUnlocked(true);
  };

  const handleMouseUp = () => {
    if (sliderValue < 95 && !isUnlocked) setSliderValue(0);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authMode === "login") {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      onSuccess();
      resetState();
    } catch (err: any) {
      setError(err.message.replace("Firebase:", "").trim());
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github" | "discord" | "linkedin" | "steam") => {
    setError(null);
    setLoading(true);
    try {
      switch (provider) {
        case "google":
          await loginWithGoogle();
          break;
        case "github":
          await loginWithGithub();
          break;
        case "discord":
          await loginWithDiscord();
          break;
        case "linkedin":
          await loginWithLinkedIn();
          break;
        case "steam":
          await loginWithSteam();
          break;
      }
      onSuccess();
      resetState();
    } catch (err: any) {
      setError(err.message || "Social authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setSliderValue(0);
    setIsUnlocked(false);
    setAuthMode("login");
    setEmail("");
    setPassword("");
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => { onClose(); resetState(); }}>
      <DialogContent className="bg-[#0a0a0a] border border-[#FFAB00]/30 text-white max-w-md p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">

        {/* Background Scanline Texture */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

        <DialogHeader className="p-6 bg-white/5 border-b border-white/10">
          <DialogTitle className="font-display text-2xl flex items-center gap-3 uppercase tracking-wider text-white">
            <Shield className="w-6 h-6 text-[#FFAB00]" />
            Operative Access
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 relative z-10">
          {/* LOGIN FORM - DIRECTLY SHOWN */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Tabs */}
            <div className="flex bg-black/40 p-1 rounded border border-white/10">
              <button
                onClick={() => setAuthMode("login")}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${authMode === "login" ? "bg-[#FFAB00] text-black" : "text-gray-500 hover:text-white"}`}
              >
                Login
              </button>
              <button
                onClick={() => setAuthMode("register")}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${authMode === "register" ? "bg-[#FFAB00] text-black" : "text-gray-500 hover:text-white"}`}
              >
                Register
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-500/50 rounded flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                <span className="text-xs text-red-200">{error}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-400 uppercase">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gametout.com"
                    className="w-full bg-black border border-white/20 p-2.5 pl-10 text-sm text-white focus:border-[#FFAB00] focus:outline-none rounded-sm transition-colors font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-400 uppercase">Password</label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black border border-white/20 p-2.5 pl-10 text-sm text-white focus:border-[#FFAB00] focus:outline-none rounded-sm transition-colors font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white hover:bg-[#FFAB00] text-black font-bold uppercase py-3 tracking-widest transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? "Authenticating..." : (authMode === "login" ? "Login" : "Sign Up")}
              </button>
            </form>

            {/* Social Login */}
            <div className="relative text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <span className="relative bg-[#0a0a0a] px-2 text-[10px] text-gray-500 uppercase tracking-widest">
                Or Connect Via Protocol
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 justify-items-center">
              {/* Firebase Providers */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center gap-2 p-2.5 border border-white/10 hover:border-[#FFAB00] hover:bg-white/5 transition-colors group disabled:opacity-50"
              >
                <Chrome className="w-4 h-4 text-gray-400 group-hover:text-white" />
                <span className="text-xs font-bold text-gray-400 group-hover:text-white uppercase">Google</span>
              </button>
              {/* <button
                type="button"
                disabled={loading}
                onClick={() => handleSocialLogin("github")}
                className="flex items-center justify-center gap-2 p-2.5 border border-white/10 hover:border-[#FFAB00] hover:bg-white/5 transition-colors group disabled:opacity-50"
              >
                <Github className="w-4 h-4 text-gray-400 group-hover:text-white" />
                <span className="text-xs font-bold text-gray-400 group-hover:text-white uppercase">GitHub</span>
              </button> */}

              {/* OAuth2 Providers */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSocialLogin("discord")}
                className="flex items-center justify-center gap-2 p-2.5 border border-white/10 hover:border-[#5865F2] hover:bg-[#5865F2]/10 transition-colors group disabled:opacity-50 hidden"
              >
                <DiscordIcon className="w-4 h-4 text-gray-400 group-hover:text-[#5865F2]" />
                <span className="text-xs font-bold text-gray-400 group-hover:text-[#5865F2] uppercase">Discord</span>
              </button>
              {/* <button
                type="button"
                disabled={loading}
                onClick={() => handleSocialLogin("linkedin")}
                className="flex items-center justify-center gap-2 p-2.5 border border-white/10 hover:border-[#0A66C2] hover:bg-[#0A66C2]/10 transition-colors group disabled:opacity-50"
              >
                <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-[#0A66C2]" />
                <span className="text-xs font-bold text-gray-400 group-hover:text-[#0A66C2] uppercase">LinkedIn</span>
              </button> */}
            </div>

            {/* Steam - Full Width for Gaming Focus */}
            {/* <button
              type="button"
              disabled={loading}
              onClick={() => handleSocialLogin("steam")}
              className="w-full flex items-center justify-center gap-2 p-2.5 border border-white/10 hover:border-[#1b2838] hover:bg-[#1b2838]/20 transition-colors group disabled:opacity-50"
            >
              <SteamIcon className="w-4 h-4 text-gray-400 group-hover:text-white" />
              <span className="text-xs font-bold text-gray-400 group-hover:text-white uppercase">Steam</span>
              <span className="text-[10px] text-gray-600 group-hover:text-gray-400 ml-1">(Gaming)</span>
            </button> */}
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};