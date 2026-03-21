import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, Trash2, Save, Terminal, AlertCircle, CheckCircle,
  Loader2, ChevronDown, Globe, Linkedin, Github, Twitter,
  Youtube, Link2, ExternalLink, Upload, Eye, Edit2
} from "lucide-react";
import { usePortfolioMutation } from "@/hooks/usePortfolioDetail";
import { useAuth } from "@/context/AuthContext";
import {
  JobCategory, JobProfileStatus, PortfolioRequest, CATEGORY_TO_BACKEND,
  DISPLAY_TO_STATUS, PortfolioDetail, BACKEND_TO_CATEGORY, GameEngine
} from "@/types/portfolio";
import { MediaUploader } from "@/components/MediaUploader";
import { mediaUploadService } from "@/services/mediaUploadService";
import { toast } from "./ui/sonner";

interface UpdatePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: PortfolioDetail;
  onSuccess?: () => void;
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

const PLATFORM_OPTIONS = [
  { value: "LinkedIn", label: "LinkedIn", icon: Linkedin, color: "#0077B5" },
  { value: "GitHub", label: "GitHub", icon: Github, color: "#333" },
  { value: "Twitter", label: "Twitter / X", icon: Twitter, color: "#1DA1F2" },
  { value: "Discord", label: "Discord", icon: Link2, color: "#5865F2" },
  { value: "Portfolio", label: "Portfolio", icon: ExternalLink, color: "#FFAB00" },
  { value: "ArtStation", label: "ArtStation", icon: ExternalLink, color: "#13AFF0" },
  { value: "Behance", label: "Behance", icon: ExternalLink, color: "#0057FF" },
  { value: "YouTube", label: "YouTube", icon: Youtube, color: "#FF0000" },
  { value: "Steam", label: "Steam", icon: ExternalLink, color: "#1B2838" },
];

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
        className={`w-full text-left bg-black/50 border-b border-white/20 text-white text-sm font-mono py-2 px-3 hover:border-[#FFAB00] transition-colors flex items-center justify-between rounded-sm ${isOpen ? "border-[#FFAB00]" : ""}`}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            {/* Changed: Opens upward with bottom-full and mb-2 */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 right-0 bottom-full mb-2 bg-[#0a0a0a] border border-[#FFAB00]/30 rounded-lg shadow-2xl max-h-60 overflow-y-auto z-50"
              style={{
                boxShadow: '0 -10px 50px rgba(0,0,0,0.8), 0 0 20px rgba(255,171,0,0.1)',
              }}
            >
              {PLATFORM_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 flex items-center gap-3 text-left border-b border-white/5 last:border-b-0 transition-colors ${
                    value === option.value
                      ? "text-[#FFAB00] bg-[#FFAB00]/10"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <option.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: option.color }} />
                  <span className="text-sm">{option.label}</span>
                  {value === option.value && (
                    <CheckCircle className="w-3.5 h-3.5 ml-auto" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const RoleDropdown = ({ value, onChange }: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedRole = roles.find(r => r === value);

  return (
    <div className="relative w-full">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left bg-black/50 border-b border-white/20 text-white text-sm font-mono py-2 px-3 hover:border-[#FFAB00] transition-colors flex items-center justify-between rounded-sm ${isOpen ? "border-[#FFAB00]" : ""}`}
        whileTap={{ scale: 0.98 }}
      >
        <span>{selectedRole}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 right-0 mt-2 bg-[#0a0a0a] border border-[#FFAB00]/30 rounded-lg shadow-2xl max-h-60 overflow-y-auto z-50"
            >
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    onChange(role);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm border-b border-white/5 last:border-b-0 ${
                    value === role
                      ? "text-[#FFAB00] bg-[#FFAB00]/10"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  } transition-colors`}
                >
                  {role}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatusDropdown = ({ value, onChange }: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedStatus = statusOptions.find(s => s === value);
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
        className={`w-full text-left bg-black/50 border-b border-white/20 text-white text-sm font-mono py-2 px-3 hover:border-[#FFAB00] transition-colors flex items-center justify-between rounded-sm ${isOpen ? "border-[#FFAB00]" : ""}`}
        whileTap={{ scale: 0.98 }}
      >
        <span>{selectedStatus}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 right-0 mt-2 bg-[#0a0a0a] border border-[#FFAB00]/30 rounded-lg shadow-2xl z-50"
            >
              {statusOptions.map((status) => {
                const Icon = statusIcons[status];
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      onChange(status);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 border-b border-white/5 last:border-b-0 ${
                      value === status
                        ? "text-[#FFAB00] bg-[#FFAB00]/10"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    } transition-colors`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {status}
                  </button>
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
        className={`w-full text-left bg-black/50 border-b border-white/20 text-white text-sm font-mono py-2 px-3 hover:border-[#FFAB00] transition-colors flex items-center justify-between rounded-sm ${isOpen ? "border-[#FFAB00]" : ""}`}
        whileTap={{ scale: 0.98 }}
      >
        <span className="uppercase">{value || "Select Engine"}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 right-0 mt-2 bg-[#0a0a0a] border border-[#FFAB00]/30 rounded-lg shadow-2xl z-50"
            >
              {engineOptions.map((engine) => (
                <button
                  key={engine}
                  type="button"
                  onClick={() => {
                    onChange(engine);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 border-b border-white/5 last:border-b-0 ${
                    value === engine
                      ? "text-[#FFAB00] bg-[#FFAB00]/10"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  } transition-colors`}
                >
                  <span className="uppercase">{engine}</span>
                </button>
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

export const UpdatePortfolioModal = ({
  isOpen,
  onClose,
  initialData,
  onSuccess
}: UpdatePortfolioModalProps) => {
  const { createOrUpdate, loading: isSubmitting, error: submitError, success, reset } = usePortfolioMutation();
  const { isAuthenticated, dbUser } = useAuth();

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

  const [deletingPhoto, setDeletingPhoto] = useState<"profile" | "cover" | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState<"profile" | "cover" | null>(null);
  const [deletingResume, setDeletingResume] = useState(false);

  // Initialize form with initial data
  useEffect(() => {
    if (isOpen && initialData) {
      const frontendRole = BACKEND_TO_CATEGORY[initialData.jobCategory] || "Programmer";
      setFormData({
        name: initialData.name || "",
        shortDescription: initialData.shortDescription || "",
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
        skills: initialData.skills && initialData.skills.length > 0
          ? initialData.skills.map(s => ({ name: s.name, score: s.score || 50 }))
          : [{ name: "", score: 50 }],
        socials: initialData.socials && initialData.socials.length > 0
          ? initialData.socials.map(s => ({ platform: s.platform, url: s.url }))
          : [{ platform: "", url: "" }]
      });
    }
  }, [isOpen, initialData]);

  // Reset form and close on success
  useEffect(() => {
    if (success) {
      toast.success("Portfolio updated successfully!", {
        description: "Your changes have been saved.",
      });

      setTimeout(() => {
        onClose();
        onSuccess?.();
        reset();
      }, 1500);
    }
  }, [success, onClose, onSuccess, reset]);

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
    if (field === "platform") {
      newSocials[index].platform = value;
    } else {
      newSocials[index].url = value;
    }
    setFormData({ ...formData, socials: newSocials });
  };

  const handleProfilePhotoUpload = useCallback(async (file: File) => {
    setUploadingPhoto("profile");
    try {
      const result = await mediaUploadService.uploadFile(file, false);
      setFormData(prev => ({ ...prev, profilePhotoUrl: result.publicUrl }));
      toast.success("Profile photo uploaded successfully");
      return result;
    } catch (error) {
      toast.error("Failed to upload profile photo");
      throw error;
    } finally {
      setUploadingPhoto(null);
    }
  }, []);

  const handleCoverPhotoUpload = useCallback(async (file: File) => {
    setUploadingPhoto("cover");
    try {
      const result = await mediaUploadService.uploadFile(file, false);
      setFormData(prev => ({ ...prev, coverPhotoUrl: result.publicUrl }));
      toast.success("Cover photo uploaded successfully");
      return result;
    } catch (error) {
      toast.error("Failed to upload cover photo");
      throw error;
    } finally {
      setUploadingPhoto(null);
    }
  }, []);

  const handleResumeUpload = useCallback(async (file: File) => {
    try {
      const result = await mediaUploadService.uploadFile(file, true);
      setFormData(prev => ({ ...prev, resumeUrl: result.publicUrl }));
      toast.success("Resume uploaded successfully");
      return result;
    } catch (error) {
      toast.error("Failed to upload resume");
      throw error;
    }
  }, []);

  const handleProfilePhotoDelete = async () => {
    setDeletingPhoto("profile");
    try {
      // Optional: Call backend to remove from DB
      setFormData(prev => ({ ...prev, profilePhotoUrl: "" }));
      toast.success("Profile photo removed");
    } catch (error) {
      toast.error("Failed to remove profile photo");
      console.error("Profile photo delete error:", error);
    } finally {
      setDeletingPhoto(null);
    }
  };

  const handleCoverPhotoDelete = async () => {
    setDeletingPhoto("cover");
    try {
      // Optional: Call backend to remove from DB
      setFormData(prev => ({ ...prev, coverPhotoUrl: "" }));
      toast.success("Cover photo removed");
    } catch (error) {
      toast.error("Failed to remove cover photo");
      console.error("Cover photo delete error:", error);
    } finally {
      setDeletingPhoto(null);
    }
  };

  const handleResumeDelete = async () => {
    setDeletingResume(true);
    try {
      // Optional: Call backend to remove from DB
      setFormData(prev => ({ ...prev, resumeUrl: "" }));
      toast.success("Resume removed");
    } catch (error) {
      toast.error("Failed to remove resume");
      console.error("Resume delete error:", error);
    } finally {
      setDeletingResume(false);
    }
  };

  const clean = (value: string | undefined): string | undefined => {
    return value && value.trim() !== "" ? value.trim() : undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.location || !formData.location.trim()) {
      toast.error("Location is required");
      return;
    }
    if (!formData.contactEmail || !formData.contactEmail.trim()) {
      toast.error("Contact email is required");
      return;
    }

    const cleanedExperience = formData.experienceYears === -1 ? 0 : formData.experienceYears;

    // Build request payload
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="pointer-events-auto w-full max-w-3xl max-h-[90vh] bg-[#0a0a0a] border border-[#FFAB00]/20 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_100px_rgba(255,171,0,0.1)] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Edit2 className="w-5 h-5 text-[#FFAB00]" />
                  <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">
                    EDIT PORTFOLIO
                  </h2>
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

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <form onSubmit={handleSubmit} className="p-6 space-y-8">

                  {/* Basic Info Section */}
                  <div className="space-y-4">
                    <h3 className="text-white font-bold uppercase text-sm tracking-wider">BASIC INFO</h3>

                    <div>
                      <label className="block text-xs text-gray-400 uppercase mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/50 border-b border-white/20 text-white text-sm py-2 focus:border-[#FFAB00] outline-none transition-colors"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 uppercase mb-2">Short Description</label>
                      <input
                        type="text"
                        value={formData.shortDescription}
                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                        className="w-full bg-black/50 border-b border-white/20 text-white text-sm py-2 focus:border-[#FFAB00] outline-none transition-colors"
                        placeholder="e.g., Senior Game Programmer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 uppercase mb-2">Location</label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full bg-black/50 border-b border-white/20 text-white text-sm py-2 focus:border-[#FFAB00] outline-none transition-colors"
                          placeholder="City, Country"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 uppercase mb-2">Experience (Years)</label>
                        <input
                          type="number"
                          value={formData.experienceYears}
                          onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                          className="w-full bg-black/50 border-b border-white/20 text-white text-sm py-2 focus:border-[#FFAB00] outline-none transition-colors"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 uppercase mb-2">Primary Role</label>
                        <RoleDropdown value={formData.role} onChange={(role) => setFormData({ ...formData, role })} />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 uppercase mb-2">Job Status</label>
                        <StatusDropdown value={formData.jobStatus} onChange={(status) => setFormData({ ...formData, jobStatus: status })} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 uppercase mb-2">Game Engine (Optional)</label>
                      <EngineDropdown value={formData.enginePreference} onChange={(engine) => setFormData({ ...formData, enginePreference: engine })} />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 uppercase mb-2">Contact Email (Read-Only)</label>
                      <input
                        type="email"
                        value={formData.contactEmail}
                        disabled
                        className="w-full bg-black/30 border-b border-white/10 text-gray-400 text-sm py-2 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 uppercase mb-2">Mobile (Optional)</label>
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className="w-full bg-black/50 border-b border-white/20 text-white text-sm py-2 focus:border-[#FFAB00] outline-none transition-colors"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 uppercase mb-2">Profile Summary</label>
                      <textarea
                        value={formData.profileSummary}
                        onChange={(e) => setFormData({ ...formData, profileSummary: e.target.value })}
                        className="w-full bg-black/50 border-b border-white/20 text-white text-sm py-2 focus:border-[#FFAB00] outline-none transition-colors resize-none"
                        rows={4}
                        placeholder="Tell your story..."
                      />
                    </div>
                  </div>

                  {/* Media Section */}
                  <div className="space-y-4">
                    <h3 className="text-white font-bold uppercase text-sm tracking-wider">MEDIA</h3>

                    {/* Profile Photo */}
                    <div>
                      <label className="block text-xs text-gray-400 uppercase mb-3">Profile Photo</label>
                      {formData.profilePhotoUrl ? (
                        <div className="space-y-3">
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-[#FFAB00]/30">
                            <img
                              src={formData.profilePhotoUrl}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleProfilePhotoDelete}
                            disabled={deletingPhoto === "profile"}
                            className="flex items-center gap-2 px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded text-sm transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {deletingPhoto === "profile" ? "Removing..." : "Delete"}
                          </button>
                        </div>
                      ) : (
                        <MediaUploader
                          onUpload={handleProfilePhotoUpload}
                          onComplete={(publicUrl) => setFormData(prev => ({ ...prev, profilePhotoUrl: publicUrl }))}
                          accept="image"
                          label="Upload Profile Photo"
                        />
                      )}
                    </div>

                    {/* Cover Photo */}
                    <div>
                      <label className="block text-xs text-gray-400 uppercase mb-3">Cover Photo</label>
                      {formData.coverPhotoUrl ? (
                        <div className="space-y-3">
                          <div className="relative w-full h-32 rounded-lg overflow-hidden border border-[#FFAB00]/30">
                            <img
                              src={formData.coverPhotoUrl}
                              alt="Cover"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleCoverPhotoDelete}
                            disabled={deletingPhoto === "cover"}
                            className="flex items-center gap-2 px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded text-sm transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {deletingPhoto === "cover" ? "Removing..." : "Delete"}
                          </button>
                        </div>
                      ) : (
                        <MediaUploader
                          onUpload={handleCoverPhotoUpload}
                          onComplete={(publicUrl) => setFormData(prev => ({ ...prev, coverPhotoUrl: publicUrl }))}
                          accept="image"
                          label="Upload Cover Photo"
                        />
                      )}
                    </div>

                    {/* Resume */}
                    <div>
                      <label className="block text-xs text-gray-400 uppercase mb-3">Resume/CV</label>
                      {formData.resumeUrl ? (
                        <div className="space-y-3">
                          <a
                            href={formData.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#FFAB00] hover:text-[#FFB900] text-sm underline"
                          >
                            <Terminal className="w-3.5 h-3.5" />
                            View Current Resume
                          </a>
                          <button
                            type="button"
                            onClick={handleResumeDelete}
                            disabled={deletingResume}
                            className="flex items-center gap-2 px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded text-sm transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {deletingResume ? "Removing..." : "Delete"}
                          </button>
                        </div>
                      ) : (
                        <MediaUploader
                          onUpload={handleResumeUpload}
                          onComplete={(publicUrl) => setFormData(prev => ({ ...prev, resumeUrl: publicUrl }))}
                          accept="pdf"
                          label="Upload Resume"
                        />
                      )}
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-bold uppercase text-sm tracking-wider">Skills (Max 3)</h3>
                      {formData.skills.length < 3 && (
                        <motion.button
                          type="button"
                          onClick={handleAddSkill}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-[#FFAB00]/10 text-[#FFAB00] hover:bg-[#FFAB00]/20 rounded transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Plus className="w-3 h-3" />
                          Add Skill
                        </motion.button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {formData.skills.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex gap-3 items-start">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={skill.name}
                                onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                                className="w-full bg-black/50 border-b border-white/20 text-white text-sm py-2 focus:border-[#FFAB00] outline-none transition-colors"
                                placeholder="e.g., C++, Unity, Unreal"
                              />
                            </div>
                            {formData.skills.length > 1 && (
                              <motion.button
                                type="button"
                                onClick={() => handleRemoveSkill(index)}
                                className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={skill.score}
                              onChange={(e) => handleSkillChange(index, "score", parseInt(e.target.value))}
                              className="flex-1 h-2 bg-black/50 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-xs text-gray-400 w-8 text-right">{skill.score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social Links Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-bold uppercase text-sm tracking-wider">Social Links (Max 5)</h3>
                      {formData.socials.length < 5 && (
                        <motion.button
                          type="button"
                          onClick={handleAddSocial}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-[#FFAB00]/10 text-[#FFAB00] hover:bg-[#FFAB00]/20 rounded transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Plus className="w-3 h-3" />
                          Add Link
                        </motion.button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {formData.socials.map((social, index) => (
                        <div key={index} className="flex gap-3 items-end">
                          <div className="flex-1 min-w-0">
                            <label className="block text-xs text-gray-400 uppercase mb-1">Platform</label>
                            <PlatformDropdown
                              value={social.platform}
                              onChange={(p) => handleSocialChange(index, "platform", p)}
                              index={index}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <label className="block text-xs text-gray-400 uppercase mb-1">URL</label>
                            <input
                              type="url"
                              value={social.url}
                              onChange={(e) => handleSocialChange(index, "url", e.target.value)}
                              className="w-full bg-black/50 border-b border-white/20 text-white text-sm py-2 focus:border-[#FFAB00] outline-none transition-colors"
                              placeholder="https://..."
                            />
                          </div>
                          {formData.socials.length > 1 && (
                            <motion.button
                              type="button"
                              onClick={() => handleRemoveSocial(index)}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors mb-0"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Error Display */}
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span className="text-sm text-red-400">{submitError}</span>
                    </motion.div>
                  )}
                </form>
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-3 p-6 border-t border-white/10 bg-black/50">
                <motion.button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-white/10 text-white hover:bg-white/20 rounded-lg font-semibold transition-all disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-[#FFAB00] text-black hover:bg-[#FFB900] rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
