import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, Trash2, Save, Terminal, AlertCircle, CheckCircle,
  Loader2, LogIn, ChevronDown, Globe, Lock, Linkedin,
  Github, Twitter, Youtube, Link2, ExternalLink, ShieldCheck, Edit2
} from "lucide-react";
import { usePortfolioMutation } from "@/hooks/usePortfolioDetail";
import { useAuth } from "@/context/AuthContext";
import { JobCategory, JobProfileStatus, PortfolioRequest, CATEGORY_TO_BACKEND, DISPLAY_TO_STATUS, PortfolioDetail, BACKEND_TO_CATEGORY, GameEngine } from "@/types/portfolio";
import { MediaUploader } from "@/components/MediaUploader";
import { mediaUploadService } from "@/services/mediaUploadService";
import { portfolioService } from "@/services/portfolioService";
import React from "react";
import { toast } from "./ui/sonner";

interface CreatePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: PortfolioDetail | null;
  onOpenEditModal?: (portfolio: PortfolioDetail) => void;
}

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
const statusOptions = ["Open for Work", "Freelance", "Deployed"];

const engineOptions = ["Unity", "Unreal", "Godot", "Other"];

const engineToEnum: Record<string, GameEngine> = {
  "Unity": GameEngine.UNITY,
  "Unreal": GameEngine.UNREAL,
  "Godot": GameEngine.GODOT,
  "Other": GameEngine.OTHER,
};


const MAX_SHORT_DESCRIPTION = 100;
const MAX_PROFILE_SUMMARY = 500;

// Platform options with icons
const PLATFORM_OPTIONS = [
  { value: "LinkedIn", label: "LinkedIn", icon: Linkedin, color: "#0077B5" },
  { value: "GitHub", label: "GitHub", icon: Github, color: "#333" },
  { value: "Twitter", label: "Twitter / X", icon: Twitter, color: "#1DA1F2" },
  { value: "Discord", label: "Discord", icon: Link2, color: "#5865F2" },
  { value: "Portfolio", label: "Portfolio", icon: ExternalLink, color: "#FFAB00" },
  { value: "ArtStation", label: "ArtStation", icon: ExternalLink, color: "#13AFF0" },
  { value: "Behance", label: "Behance", icon: ExternalLink, color: "#0057FF" },
  { value: "YouTube", label: "YouTube", icon: Youtube, color: "#FF0000" },
  { value: "Website", label: "Website", icon: ExternalLink, color: "#FA5C5C" },
];

// Custom Platform Dropdown Component (similar to createpost)
// Custom Platform Dropdown Component (similar to createpost)
const PlatformDropdown = ({
  value,
  onChange,
  index
}: {
  value: string;
  onChange: (value: string) => void;
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedPlatform = PLATFORM_OPTIONS.find(p => p.value === value);

  return (
    <div className="relative w-full" style={{ zIndex: 1000 - index }}>
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left bg-black/50 border-b border-white/20 text-white text-sm font-mono py-2 px-3 hover:border-[#FFAB00] transition-colors flex items-center justify-between rounded-sm ${isOpen ? 'border-[#FFAB00]' : ''
          }`}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedPlatform ? (
            <>
              <selectedPlatform.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: selectedPlatform.color }} />
              <span className="truncate">{selectedPlatform.label}</span>
            </>
          ) : (
            <span className="text-gray-400">Select Platform</span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-2"
        >
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </motion.div>
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

            {/* Dropdown - opens upward on mobile, downward on desktop? Actually let's keep it consistent */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 right-0 mt-2 bg-[#0a0a0a] border border-[#FFAB00]/30 rounded-lg shadow-2xl max-h-60 overflow-y-auto z-50"
              style={{
                boxShadow: '0 10px 50px rgba(0,0,0,0.8), 0 0 20px rgba(255,171,0,0.1)',
              }}
            >
              <div className="p-1">
                {PLATFORM_OPTIONS.map((platform) => {
                  const PlatformIcon = platform.icon;
                  return (
                    <motion.button
                      key={platform.value}
                      type="button"
                      onClick={() => {
                        onChange(platform.value);
                        setIsOpen(false);
                      }}
                      className={`w-full px-3 py-2.5 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-3 rounded ${value === platform.value
                        ? 'bg-[#FFAB00]/20 text-[#FFAB00]'
                        : 'text-gray-300'
                        }`}
                      whileHover={{ x: 4 }}
                    >
                      <PlatformIcon className="w-4 h-4 flex-shrink-0" style={{ color: platform.color }} />
                      <span className="truncate">{platform.label}</span>
                      {value === platform.value && (
                        <CheckCircle className="w-4 h-4 ml-auto flex-shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Custom Dropdown Components (add these inside CreatePortfolioModal component)

// Role Dropdown Component
const RoleDropdown = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedRole = roles.find(r => r === value);

  return (
    <div className="relative w-full">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#0a0a0a] border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] transition-colors font-mono flex items-center justify-between ${isOpen ? 'border-[#FFAB00]' : ''
          }`}
        whileTap={{ scale: 0.98 }}
      >
        <span className="uppercase">{selectedRole || "Select Role"}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
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

            {/* Dropdown - opens below */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-[#FFAB00]/30 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
              style={{
                boxShadow: '0 10px 50px rgba(0,0,0,0.8), 0 0 20px rgba(255,171,0,0.1)',
                zIndex: 50
              }}
            >
              {roles.map((role) => (
                <motion.button
                  key={role}
                  type="button"
                  onClick={() => {
                    onChange(role);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2 ${value === role
                    ? 'bg-[#FFAB00]/20 text-[#FFAB00] font-bold'
                    : 'text-gray-300'
                    }`}
                  whileHover={{ x: 4 }}
                >
                  <span className="uppercase">{role}</span>
                  {value === role && (
                    <CheckCircle className="w-4 h-4 ml-auto" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Status Dropdown Component
const StatusDropdown = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedStatus = statusOptions.find(s => s === value);

  // Status icons mapping
  const statusIcons: Record<string, any> = {
    "Open for Work": Globe,
    "Freelance": ExternalLink,
    "Deployed": CheckCircle
  };

  return (
    <div className="relative w-full">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#0a0a0a] border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] transition-colors font-mono flex items-center justify-between ${isOpen ? 'border-[#FFAB00]' : ''
          }`}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2">
          {selectedStatus && statusIcons[selectedStatus] ?
            React.createElement(statusIcons[selectedStatus], { className: "w-4 h-4 text-[#FFAB00]" }) : null}
          <span className="uppercase">{selectedStatus || "Select Status"}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
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

            {/* Dropdown - opens upward */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 right-0 mb-2 bg-[#0a0a0a] border border-[#FFAB00]/30 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
              style={{
                boxShadow: '0 -10px 50px rgba(0,0,0,0.8), 0 0 20px rgba(255,171,0,0.1)',
                zIndex: 50
              }}
            >
              {statusOptions.map((status) => {
                const StatusIcon = statusIcons[status] || Globe;
                return (
                  <motion.button
                    key={status}
                    type="button"
                    onClick={() => {
                      onChange(status);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2 ${value === status
                      ? 'bg-[#FFAB00]/20 text-[#FFAB00] font-bold'
                      : 'text-gray-300'
                      }`}
                    whileHover={{ x: 4 }}
                  >
                    <StatusIcon className="w-4 h-4" />
                    <span className="uppercase">{status}</span>
                    {value === status && (
                      <CheckCircle className="w-4 h-4 ml-auto" />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Engine Preference Dropdown Component
const EngineDropdown = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#0a0a0a] border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] transition-colors font-mono flex items-center justify-between ${isOpen ? 'border-[#FFAB00]' : ''
          }`}
        whileTap={{ scale: 0.98 }}
      >
        <span className="uppercase">{value || "Select Engine"}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
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

            {/* Dropdown - opens upward */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 right-0 mb-2 bg-[#0a0a0a] border border-[#FFAB00]/30 rounded-lg shadow-2xl"
              style={{
                boxShadow: '0 -10px 50px rgba(0,0,0,0.8), 0 0 20px rgba(255,171,0,0.1)',
                zIndex: 50
              }}
            >
              {engineOptions.map((engine) => (
                <motion.button
                  key={engine}
                  type="button"
                  onClick={() => {
                    onChange(engine);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2 ${value === engine
                    ? 'bg-[#FFAB00]/20 text-[#FFAB00] font-bold'
                    : 'text-gray-300'
                    }`}
                  whileHover={{ x: 4 }}
                >
                  <span className="uppercase">{engine}</span>
                  {value === engine && (
                    <CheckCircle className="w-4 h-4 ml-auto" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const getJobCategoryFromRole = (role: string): JobCategory => {
  return CATEGORY_TO_BACKEND[role] || JobCategory.OTHER;
};

export const CreatePortfolioModal = ({ isOpen, onClose, onSuccess, initialData, onOpenEditModal }: CreatePortfolioModalProps) => {
  const { isAuthenticated, dbUser, loginWithGoogle, loginWithGithub,
    loginWithDiscord,
    loginWithLinkedIn,
    loginWithSteam,
    loginWithEmail
  } = useAuth();
  const { createOrUpdate, loading: isSubmitting, error: submitError, success, reset } = usePortfolioMutation();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Portfolio checking states
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [existingPortfolio, setExistingPortfolio] = useState<PortfolioDetail | null>(null);
  const [isCheckingPortfolio, setIsCheckingPortfolio] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    role: "Programmer",
    location: "",
    experienceYears: 0,
    jobStatus: "Open for Work",
    profileSummary: "",
    contactEmail: "",
    mobile: "",
    profilePhotoUrl: "",
    coverPhotoUrl: "",
    resumeUrl: "",
    enginePreference: "",
    skills: [{ name: "", score: 50 }],
    socials: [{ platform: "", url: "" }]
  });

  useEffect(() => {
    if (isOpen && initialData) {
      // Map API response back to Form State

      const frontendRole = BACKEND_TO_CATEGORY[initialData.jobCategory] || "Programmer";
      setFormData({
        name: initialData.name || "",
        shortDescription: initialData.shortDescription || "",
        // Map backend Enum back to Frontend String if needed, or ensure types match
        // role: initialData.jobCategory === JobCategory.DEVELOPMENT ? "Programmer"
        //   : initialData.jobCategory === JobCategory.DESIGN ? "Artist"
        //     : initialData.jobCategory === JobCategory.OTHER ? "Audio"
        //       : initialData.jobCategory === JobCategory.PRODUCT_MANAGEMENT ? "Producer"
        //         : "Programmer", // Fallback
        role: frontendRole,
        location: initialData.location || "",
        experienceYears: initialData.experienceYears || 0,
        jobStatus: initialData.jobStatus === "OPEN" ? "Open for Work"
          : initialData.jobStatus === "FREELANCE" ? "Freelance"
            : "Deployed",
        profileSummary: initialData.profileSummary || "",
        contactEmail: initialData.contactEmail || "",
        mobile: initialData.mobile || "",
        profilePhotoUrl: initialData.profilePhotoUrl || "",
        coverPhotoUrl: initialData.coverPhotoUrl || "",
        resumeUrl: initialData.resumeUrl || "",
        enginePreference: initialData.enginePreference || "",
        // Ensure arrays have at least one empty item if empty
        skills: initialData.skills && initialData.skills.length > 0
          ? initialData.skills.map(s => ({ name: s.name, score: s.score || 50 }))
          : [{ name: "", score: 50 }],
        socials: initialData.socials && initialData.socials.length > 0
          ? initialData.socials.map(s => ({ platform: s.platform, url: s.url }))
          : [{ platform: "", url: "" }]
      });
    } else if (isOpen && !initialData) {
      // Reset to defaults if creating new
      setFormData({
        name: "",
        shortDescription: "",
        role: "Programmer",
        location: "",
        experienceYears: 1,
        jobStatus: "Open for Work",
        profileSummary: "",
        contactEmail: dbUser?.email || "",
        mobile: "",
        profilePhotoUrl: "",
        coverPhotoUrl: "",
        resumeUrl: "",
        enginePreference: "",
        skills: [{ name: "", score: 50 }],
        socials: [{ platform: "", url: "" }]
      });
    }
  }, [isOpen, initialData, dbUser]);

  // Check if user has existing portfolio
  useEffect(() => {
    if (isOpen && isAuthenticated && dbUser?.id && !initialData) {
      setIsCheckingPortfolio(true);
      portfolioService.getMyPortfolio()
        .then(data => {
          if (data) {
            setExistingPortfolio(data);
            setMode('edit');
          } else {
            setExistingPortfolio(null);
            setMode('create');
          }
        })
        .catch(() => {
          setExistingPortfolio(null);
          setMode('create');
        })
        .finally(() => setIsCheckingPortfolio(false));
    }
  }, [isOpen, isAuthenticated, dbUser?.id, initialData]);

  // Reset form and close on success
  useEffect(() => {
    if (success) {
      // Reset form
      setFormData({
        name: "",
        shortDescription: "",
        role: "Programmer",
        location: "",
        experienceYears: 1,
        jobStatus: "Open for Work",
        profileSummary: "",
        contactEmail: "",
        mobile: "",
        profilePhotoUrl: "",
        coverPhotoUrl: "",
        resumeUrl: "",
        enginePreference: "",
        skills: [{ name: "", score: 50 }],
        socials: [{ platform: "", url: "" }]
      });

      // Call success callback
      onSuccess?.();

      // Close after a short delay to show success message
      setTimeout(() => {
        onClose();
        reset();
      }, 1500);
    }
  }, [success, onClose, onSuccess, reset]);

  // Pre-fill email from auth if available
  useEffect(() => {
    if (dbUser?.email && !formData.contactEmail) {
      setFormData(prev => ({ ...prev, contactEmail: dbUser.email || "" }));
    }
  }, [dbUser?.email, formData.contactEmail]);

  const handleAddSkill = () => {
    if (formData.skills.length >= 3) {
      toast.error("Maximum 3 skills allowed", {
        description: "Remove an existing skill to add a new one.",
      });
      return;
    }
    setFormData({ ...formData, skills: [...formData.skills, { name: "", score: 50 }] });
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: newSkills });
  };

  const handleSkillChange = (index: number, field: "name" | "score", value: string | number) => {
    const newSkills = [...formData.skills];
    if (field === "name") {
      newSkills[index].name = value as string;
    } else {
      newSkills[index].score = value as number;
    }
    setFormData({ ...formData, skills: newSkills });
  };

  const handleAddSocial = () => {
    if (formData.socials.length < 5) {
      setFormData({ ...formData, socials: [...formData.socials, { platform: "", url: "" }] });
    }
  };

  const handleRemoveSocial = (index: number) => {
    const newSocials = formData.socials.filter((_, i) => i !== index);
    setFormData({ ...formData, socials: newSocials });
  };

  const handleSocialChange = (index: number, field: "platform" | "url", value: string) => {
    const newSocials = [...formData.socials];
    newSocials[index][field] = value;
    setFormData({ ...formData, socials: newSocials });
  };

  // Handle file uploads via presigned URLs
  const handleProfilePhotoUpload = useCallback(async (file: File) => {
    return await mediaUploadService.uploadFile(file, false);
  }, []);

  const handleCoverPhotoUpload = useCallback(async (file: File) => {
    return await mediaUploadService.uploadFile(file, false);
  }, []);

  const handleResumeUpload = useCallback(async (file: File) => {
    return await mediaUploadService.uploadFile(file, true);
  }, []);

  const handleProfilePhotoDelete = async () => {
    if (!formData.profilePhotoUrl) return;

    try {
      setIsDeleting("profile");
      await mediaUploadService.deleteFile(formData.profilePhotoUrl);
      setFormData(prev => ({ ...prev, profilePhotoUrl: "" }));
    } catch (error) {
      console.error("Failed to delete profile photo:", error);
      // Optional: Show toast error
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCoverPhotoDelete = async () => {
    if (!formData.coverPhotoUrl) return;

    try {
      setIsDeleting("cover");
      await mediaUploadService.deleteFile(formData.coverPhotoUrl);
      setFormData(prev => ({ ...prev, coverPhotoUrl: "" }));
    } catch (error) {
      console.error("Failed to delete cover photo:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleResumeDelete = async () => {
    if (!formData.resumeUrl) return;

    try {
      setIsDeleting("resume");
      await mediaUploadService.deleteFile(formData.resumeUrl);
      setFormData(prev => ({ ...prev, resumeUrl: "" }));
    } catch (error) {
      console.error("Failed to delete resume:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.name.trim()) {
      alert("Name is required");
      return;
    }
    if (!formData.location || !formData.location.trim()) {
      alert("Location is required");
      return;
    }
    if (!formData.contactEmail || !formData.contactEmail.trim()) {
      alert("Contact email is required");
      return;
    }

    // Helper to convert empty strings to undefined
    const clean = (value: string | undefined): string | undefined => {
      return value && value.trim() !== "" ? value.trim() : undefined;
    };

    const cleanedExperience = formData.experienceYears === -1 ? 0 : formData.experienceYears;

    // Build request payload with proper null handling
    const request: PortfolioRequest = {
      name: formData.name.trim(),
      shortDescription: formData.shortDescription?.trim() || "Game Developer",
      location: formData.location.trim(),
      experienceYears: cleanedExperience,
      jobCategory: CATEGORY_TO_BACKEND[formData.role] || JobCategory.OTHER,
      jobStatus: DISPLAY_TO_STATUS[formData.jobStatus] || JobProfileStatus.OPEN,
      profileSummary: formData.profileSummary?.trim() || undefined,
      contactEmail: formData.contactEmail.trim(),
      mobile: clean(formData.mobile),
      profilePhotoUrl: clean(formData.profilePhotoUrl),
      coverPhotoUrl: clean(formData.coverPhotoUrl),
      resumeUrl: clean(formData.resumeUrl),
      enginePreference: formData.enginePreference ? (formData.enginePreference as any) : undefined,
      skills: formData.skills
        .filter(s => s.name && s.name.trim() !== "")
        .map(s => ({ name: s.name.trim(), score: s.score })),
      socials: formData.socials
        .filter(s => s.platform?.trim() && s.url?.trim())
        .map(s => ({ platform: s.platform.trim(), url: s.url.trim() })),
    };

    await createOrUpdate(request);
  };

  const renderLockedPortfolioView = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 40 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="w-full max-w-3xl mx-auto bg-[#0a0a0a] border border-[#FFAB00]/20 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#FFAB00]" />
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">PORTFOLIO EXISTS</h2>
        </div>
        <motion.button
          onClick={onClose}
          className="p-2 hover:bg-[#FFAB00]/10 rounded-lg text-white hover:text-[#FFAB00] transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FFAB00]/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-[#FFAB00]" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-2 uppercase">Your Portfolio Already Exists</h3>
          <p className="text-gray-400 text-sm">
            You already have a portfolio. To make changes, please use the
            <br />
            <span className="text-[#FFAB00] font-bold">"Update Portfolio"</span> button in your User Menu.
          </p>
        </div>

        {existingPortfolio && (
          <div className="bg-black/50 border border-[#FFAB00]/20 rounded-lg p-4 w-full max-w-sm">
            <p className="text-gray-400 text-xs uppercase mb-3 tracking-wider">Quick Preview</p>
            <p className="text-white font-bold text-lg mb-1">{existingPortfolio.name}</p>
            <p className="text-gray-400 text-sm mb-3">{BACKEND_TO_CATEGORY[existingPortfolio.jobCategory]}</p>
            <p className="text-gray-500 text-xs">{existingPortfolio.location}</p>
          </div>
        )}

        <div className="flex gap-3 w-full max-w-sm justify-center">
          <motion.button
            onClick={() => {
              if (existingPortfolio) {
                onOpenEditModal?.(existingPortfolio);
              }
              onClose();
            }}
            className="flex-1 px-4 py-3 bg-[#FFAB00] text-black hover:bg-[#FFB900] rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit2 className="w-4 h-4" />
            EDIT PORTFOLIO
          </motion.button>
          <motion.button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white/10 text-white hover:bg-white/20 rounded-lg font-semibold transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            CLOSE
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Show login prompt if not authenticated
  // Show login prompt if not authenticated
  const renderAuthPrompt = () => (
    <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-[#FFAB00]/10 flex items-center justify-center">
        <LogIn className="w-8 h-8 text-[#FFAB00]" />
      </div>
      <div>
        <h3 className="font-display text-2xl text-white uppercase mb-2">SIGN UP NOW FOR FREE</h3>
        <p className="text-gray-400 font-mono text-sm">
          You must be logged in to create a portfolio profile.
        </p>
      </div>

      {/* Social Login Grid */}
      <div className="w-full space-y-4">
        {/* Primary Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => loginWithGoogle()}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 hover:border-[#FFAB00] hover:bg-white/5 transition-colors group rounded-lg"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-xs font-bold text-gray-300 group-hover:text-white uppercase">Google</span>
          </button>

          <button
            onClick={() => loginWithDiscord()}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 hover:border-[#5865F2] hover:bg-[#5865F2]/10 transition-colors group rounded-lg"
          >
            <svg className="w-4 h-4 text-gray-400 group-hover:text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <span className="text-xs font-bold text-gray-300 group-hover:text-[#5865F2] uppercase">Discord</span>
          </button>

          {/* <button
            onClick={() => loginWithGithub()}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 hover:border-[#FFAB00] hover:bg-white/5 transition-colors group rounded-lg"
          >
            <Github className="w-4 h-4 text-gray-400 group-hover:text-white" />
            <span className="text-xs font-bold text-gray-300 group-hover:text-white uppercase">GitHub</span>
          </button> */}
        </div>

        {/* Secondary Buttons */}
        {/* <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => loginWithDiscord()}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 hover:border-[#5865F2] hover:bg-[#5865F2]/10 transition-colors group rounded-lg"
          >
            <svg className="w-4 h-4 text-gray-400 group-hover:text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <span className="text-xs font-bold text-gray-300 group-hover:text-[#5865F2] uppercase">Discord</span>
          </button> */}

        {/* <button
            onClick={() => loginWithLinkedIn()}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 hover:border-[#0A66C2] hover:bg-[#0A66C2]/10 transition-colors group rounded-lg"
          >
            <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-[#0A66C2]" />
            <span className="text-xs font-bold text-gray-300 group-hover:text-[#0A66C2] uppercase">LinkedIn</span>
          </button> */}
        {/* </div> */}

        {/* Steam - Full Width */}
        {/* <button
          onClick={() => loginWithSteam()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 hover:border-[#1b2838] hover:bg-[#1b2838]/20 transition-colors group rounded-lg"
        >
          <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0z" />
          </svg>
          <span className="text-xs font-bold text-gray-300 group-hover:text-white uppercase">Steam</span>
          <span className="text-[10px] text-gray-600 group-hover:text-gray-400">(Gaming)</span>
        </button> */}
      </div>

      {/* Divider */}
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <span className="relative bg-[#0a0a0a] px-2 text-[10px] text-gray-500 uppercase tracking-widest">
          Or continue with email
        </span>
      </div>

      {/* Email Option */}
      <div className="w-full text-center">
        <p className="text-xs text-gray-500 mb-3">Want to use email instead?</p>
        <button
          onClick={() => {/* You can add email login modal here */ }}
          className="text-sm text-[#FFAB00] hover:text-white transition-colors font-mono uppercase tracking-wider"
        >
          Sign in with Email →
        </button>
      </div>

      {/* Note about email verification */}
      <p className="text-[10px] text-gray-600 font-mono mt-4">
        Note: Email verification required for portfolio creation
      </p>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
          >
            <div className="bg-[#0a0a0a] border border-[#FFAB00]/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] pointer-events-auto relative">

              {/* Decorative Scanline */}
              <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2 text-[#FFAB00]">
                  <Terminal className="w-5 h-5" />
                  <h2 className="font-display text-xl uppercase tracking-widest">Initiate Registration</h2>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form Content */}
              {!isAuthenticated ? (
                renderAuthPrompt()
              ) : isCheckingPortfolio ? (
                <div className="p-8 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-8 h-8 text-[#FFAB00] animate-spin" />
                  <p className="text-gray-400">Checking portfolio...</p>
                </div>
              ) : mode === 'edit' && existingPortfolio ? (
                renderLockedPortfolioView()
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-8">

                  {/* Success Message */}
                  {/* {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded text-green-400"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-mono text-sm">Portfolio created successfully!</span>
                    </motion.div>
                  )} */}

                  {/* Error Message */}
                  {/* {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400"
                    >
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-mono text-sm">{submitError}</span>
                    </motion.div>
                  )} */}

                  {/* Email Verification Warning */}
                  {/* {dbUser && !dbUser.emailVerified && (
                    <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-400">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-mono text-sm">Please verify your email to create a portfolio.</span>
                    </div>
                  )} */}

                  {/* 1. Identity Section */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">
                      Identity Matrix
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 uppercase">Candidate Name *</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                          placeholder="ENTER_NAME"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 uppercase">Category (Role) *</label>
                        <RoleDropdown
                          value={formData.role}
                          onChange={(value) => setFormData({ ...formData, role: value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 uppercase">Game Engine (Optional)</label>
                        <EngineDropdown
                          value={formData.enginePreference}
                          onChange={(value) => setFormData({ ...formData, enginePreference: value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 uppercase">Base Location *</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                          placeholder="CITY, REGION"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 uppercase">Experience (Years)</label>
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                            placeholder="e.g., 5"
                            value={formData.experienceYears === -1 ? "" : formData.experienceYears}
                            onChange={(e) => {
                              const raw = e.target.value;
                              if (raw === "") {
                                setFormData({ ...formData, experienceYears: -1 });
                                return;
                              }
                              if (!/^\d+$/.test(raw)) return;

                              const numValue = parseInt(raw, 10);
                              if (numValue >= 0 && numValue <= 50) {
                                setFormData({ ...formData, experienceYears: numValue });
                              }
                            }}
                            onBlur={() => {
                              if (formData.experienceYears === -1) {
                                setFormData({ ...formData, experienceYears: 0 });
                              }
                            }}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col">
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  experienceYears: Math.min(50, (formData.experienceYears === -1 ? 0 : formData.experienceYears) + 1)
                                })
                              }
                              className="text-[#FFAB00] hover:text-white w-4 h-4 flex items-center justify-center"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  experienceYears: Math.max(0, (formData.experienceYears === -1 ? 0 : formData.experienceYears) - 1)
                                })
                              }
                              className="text-[#FFAB00] hover:text-white w-4 h-4 flex items-center justify-center"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 font-mono">Enter 0 for less than 1 year</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 uppercase">Status</label>
                        <StatusDropdown
                          value={formData.jobStatus}
                          onChange={(value) => setFormData({ ...formData, jobStatus: value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 uppercase">Contact Email *</label>
                        <input
                          type="email"
                          required
                          className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                          placeholder="operative@email.com"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 uppercase">Phone Number (Optional)</label>
                        <input
                          type="tel"
                          className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                          placeholder="e.g, +919876543210"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-300 uppercase">
                          Short Description <span className="text-[10px] text-gray-500 ml-2">({formData.shortDescription.length}/{MAX_SHORT_DESCRIPTION})</span>
                        </label>
                        <input
                          type="text"
                          maxLength={MAX_SHORT_DESCRIPTION}
                          className={`w-full bg-black/50 border p-3 rounded-sm text-white focus:outline-none transition-colors font-mono ${formData.shortDescription.length >= MAX_SHORT_DESCRIPTION
                            ? 'border-red-500/50 focus:border-red-500'
                            : 'border-white/20 focus:border-[#FFAB00]'
                            }`}
                          placeholder="Game Designer with 8 yrs of Experience | Senior Game Programmer | Unity & Unreal Expert"
                          value={formData.shortDescription}
                          onChange={(e) => {
                            if (e.target.value.length <= MAX_SHORT_DESCRIPTION) {
                              setFormData({ ...formData, shortDescription: e.target.value });
                            }
                          }}
                        />
                        {formData.shortDescription.length >= MAX_SHORT_DESCRIPTION && (
                          <p className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Maximum {MAX_SHORT_DESCRIPTION} characters reached
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-300 uppercase">
                          Profile Summary <span className="text-[10px] text-gray-500 ml-2">({formData.profileSummary.length}/{MAX_PROFILE_SUMMARY})</span>
                        </label>
                        <textarea
                          rows={3}
                          maxLength={MAX_PROFILE_SUMMARY}
                          className={`w-full bg-black/50 border p-3 rounded-sm text-white focus:outline-none transition-colors font-mono resize-none ${formData.profileSummary.length >= MAX_PROFILE_SUMMARY
                            ? 'border-red-500/50 focus:border-red-500'
                            : 'border-white/20 focus:border-[#FFAB00]'
                            }`}
                          placeholder="Tell us about your experience, skills, and what you're looking for..."
                          value={formData.profileSummary}
                          onChange={(e) => {
                            if (e.target.value.length <= MAX_PROFILE_SUMMARY) {
                              setFormData({ ...formData, profileSummary: e.target.value });
                            }
                          }}
                        />
                        {formData.profileSummary.length >= MAX_PROFILE_SUMMARY && (
                          <p className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Maximum {MAX_PROFILE_SUMMARY} characters reached
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. Upload Section */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">
                      Visual Data Upload
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 uppercase">Profile Photo</label>
                        <MediaUploader
                          accept="image"
                          value={formData.profilePhotoUrl}
                          onUpload={handleProfilePhotoUpload}
                          onComplete={(url) => setFormData({ ...formData, profilePhotoUrl: url })}
                          onClear={handleProfilePhotoDelete}
                          label="profile photo"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 uppercase">Cover Photo</label>
                        <MediaUploader
                          accept="image"
                          value={formData.coverPhotoUrl}
                          onUpload={handleCoverPhotoUpload}
                          onComplete={(url) => setFormData({ ...formData, coverPhotoUrl: url })}
                          onClear={handleCoverPhotoDelete}
                          label="cover photo"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-300 uppercase">Resume/CV</label>
                        <MediaUploader
                          accept="pdf"
                          value={formData.resumeUrl}
                          onUpload={handleResumeUpload}
                          onComplete={(url) => setFormData({ ...formData, resumeUrl: url })}
                          onClear={handleResumeDelete}
                          label="resume (PDF)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Skills Matrix (Dynamic) */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                        List Your Skills
                      </h3>
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        disabled={formData.skills.length >= 3}
                        className="text-[#FFAB00] text-xs font-bold uppercase hover:underline flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3 h-3" /> Add Skill ({formData.skills.length}/3)
                      </button>
                    </div>

                    <div className="space-y-4">
                      {formData.skills.map((skill, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-4 items-center bg-white/5 p-3 rounded border border-white/5"
                        >
                          <input
                            type="text"
                            placeholder="SKILL_NAME (e.g. UNITY)"
                            className="bg-transparent border-b border-white/20 text-white text-sm w-1/3 focus:border-[#FFAB00] focus:outline-none font-mono py-1"
                            value={skill.name}
                            onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                          />
                          <div className="flex-1 flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FFAB00]"
                              value={skill.score}
                              onChange={(e) => handleSkillChange(index, "score", parseInt(e.target.value))}
                            />
                            <span className="text-xs font-mono text-[#FFAB00] w-8">{skill.score}%</span>
                          </div>
                          {index > 0 && (
                            <button type="button" onClick={() => handleRemoveSkill(index)} className="text-red-500 hover:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* 4. Social Links */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                        Social Handles
                      </h3>
                      <button
                        type="button"
                        onClick={handleAddSocial}
                        disabled={formData.socials.length >= 5}
                        className="text-[#FFAB00] text-xs font-bold uppercase hover:underline flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3 h-3" /> Add Link
                      </button>
                    </div>

                    <div className="space-y-4">
                      {formData.socials.map((social, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-white/5 p-3 rounded border border-white/5"
                        >
                          {/* Mobile: Stacked layout */}
                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                            {/* Platform Dropdown - Full width on mobile */}
                            <div className="w-full sm:w-1/4">
                              <PlatformDropdown
                                value={social.platform}
                                onChange={(value) => handleSocialChange(index, "platform", value)}
                                index={index}
                              />
                            </div>

                            {/* URL Input - Full width on mobile */}
                            <div className="flex-1 w-full sm:w-auto flex items-center gap-2">
                              <input
                                type="url"
                                placeholder="https://..."
                                className="flex-1 bg-transparent border-b border-white/20 text-white text-sm focus:border-[#FFAB00] focus:outline-none font-mono py-1 w-full"
                                value={social.url}
                                onChange={(e) => handleSocialChange(index, "url", e.target.value)}
                              />
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSocial(index)}
                                  className="text-red-500 hover:text-red-400 flex-shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Hint text for mobile - shows platform selection hint */}
                          {!social.platform && (
                            <p className="text-[10px] text-gray-600 mt-2 sm:hidden">
                              Select platform first, then enter URL
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Success Message */}
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded text-green-400"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-mono text-sm">Portfolio created successfully! It will take 60 mins to appear on the website 😊🚀.</span>
                      </motion.div>
                    )}

                    {/* Error Message */}
                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400"
                      >
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-mono text-sm">{submitError}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="px-6 py-3 border border-white/20 text-gray-400 font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.name || !formData.location || !formData.contactEmail}
                      className="relative group px-8 py-3 bg-[#FFAB00] text-black font-bold uppercase tracking-widest overflow-hidden hover:bg-white transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            UPLOADING...
                          </>
                        ) : (
                          <>
                            SUBMIT <Save className="w-4 h-4" />
                          </>
                        )}
                      </span>
                      {/* Glitch Overlay */}
                      {!isSubmitting && (
                        <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-300 ease-out opacity-50" />
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};