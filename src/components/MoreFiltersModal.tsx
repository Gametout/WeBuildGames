import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Filter,
  Sparkles,
  X,
  CheckCircle,
  RotateCcw,
  Cpu,
  Briefcase,
  Clock,
  Layers,
  Search,
} from "lucide-react";
import {
  JobProfileStatus,
  EXPERIENCE_PRESETS,
  ALL_GAME_ENGINES,
  GameEngine,
  JobCategory,
  BACKEND_TO_CATEGORY,
} from "@/types/portfolio";

interface MoreFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;

  jobCategories: JobCategory[];
  jobStatuses: JobProfileStatus[];
  minExperienceYears: number | null;
  maxExperienceYears: number | null;
  enginePreferences: GameEngine[];

  setJobCategories: (cats: JobCategory[]) => void;
  setJobStatuses: (statuses: JobProfileStatus[]) => void;
  setExperienceRange: (min: number | null, max: number | null) => void;
  setEnginePreferences: (engines: GameEngine[]) => void;

  onApplyFilters: () => Promise<void>;
  isLoading: boolean;
}

// Animation variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 28, stiffness: 320 },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 30,
    transition: { duration: 0.2 },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.06, 
      duration: 0.35, 
      ease: "easeOut" 
    },
  }),
};

const pillVariants = {
  tap: { scale: 0.93 },
  hover: { scale: 1.04 },
};

export default function MoreFiltersModal({
  isOpen,
  onClose,
  jobCategories,
  jobStatuses,
  minExperienceYears,
  maxExperienceYears,
  enginePreferences,
  setJobCategories,
  setJobStatuses,
  setExperienceRange,
  setEnginePreferences,
  onApplyFilters,
  isLoading,
}: MoreFiltersModalProps) {
  const [categorySearch, setCategorySearch] = useState("");

  // Get all backend job categories as array
  const allJobCategories: JobCategory[] = Object.values(JobCategory).filter(
    (val) => typeof val === "string"
  ) as JobCategory[];

  // Map backend category enum to display name
  const getCategoryDisplayName = (cat: JobCategory): string => {
    const entry = Object.entries(BACKEND_TO_CATEGORY).find(
      ([, v]) => v === cat
    );
    return entry ? entry[0] : cat.replace(/_/g, " ");
  };

  // Filtered categories based on search
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return allJobCategories;
    const query = categorySearch.toLowerCase().trim();
    return allJobCategories.filter((cat) => {
      const displayName = getCategoryDisplayName(cat).toLowerCase();
      const enumName = cat.toLowerCase().replace(/_/g, " ");
      return displayName.includes(query) || enumName.includes(query);
    });
  }, [categorySearch, allJobCategories]);

  // Toggle job category
  const toggleJobCategory = (cat: JobCategory) => {
    setJobCategories(
      jobCategories.includes(cat)
        ? jobCategories.filter((c) => c !== cat)
        : [...jobCategories, cat]
    );
  };

  // Toggle job status
  const toggleJobStatus = (status: JobProfileStatus) => {
    setJobStatuses(
      jobStatuses.includes(status)
        ? jobStatuses.filter((s) => s !== status)
        : [...jobStatuses, status]
    );
  };

  // Toggle game engine
  const toggleEngine = (engine: GameEngine) => {
    setEnginePreferences(
      enginePreferences.includes(engine)
        ? enginePreferences.filter((e) => e !== engine)
        : [...enginePreferences, engine]
    );
  };

  // Handle apply filters
  const handleApply = async () => {
    await onApplyFilters();
    onClose();
  };

  // Reset all filters
  const handleReset = () => {
    setJobCategories([]);
    setJobStatuses([]);
    setExperienceRange(null, null);
    setEnginePreferences([]);
    setCategorySearch("");
  };

  // Count total active filters
  const activeFilterCount =
    jobCategories.length +
    jobStatuses.length +
    enginePreferences.length +
    (minExperienceYears !== null || maxExperienceYears !== null ? 1 : 0);

  // Experience display text
  const experienceDisplayText =
    minExperienceYears !== null && maxExperienceYears !== null
      ? `${minExperienceYears} – ${maxExperienceYears} years`
      : minExperienceYears !== null
      ? `${minExperienceYears}+ years`
      : maxExperienceYears !== null
      ? `Up to ${maxExperienceYears} years`
      : "Any experience level";

  // Reset search when modal closes
  React.useEffect(() => {
    if (!isOpen) setCategorySearch("");
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="filters-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* ── Modal container ── */}
          <motion.div
            key="filters-modal-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-[#0a0a0a] border border-[#FFAB00]/30 w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-lg shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_120px_rgba(255,171,0,0.06)] pointer-events-auto relative flex flex-col"
            >
              {/* Decorative Scanline */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-10" />

              {/* Ambient glow top */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#FFAB00]/40 to-transparent" />

              {/* ═══ Header ═══ */}
              <div className="flex justify-between items-center p-5 sm:p-6 border-b border-white/10 bg-white/[0.02] relative z-20 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#FFAB00]/10 border border-[#FFAB00]/20 flex items-center justify-center">
                    <Filter className="w-4 h-4 text-[#FFAB00]" />
                  </div>
                  <div>
                    <h2 className="font-display text-base sm:text-lg uppercase tracking-widest text-white">
                      Advanced Filters
                    </h2>
                    <p className="text-[10px] sm:text-xs text-gray-500 font-mono mt-0.5">
                      Refine results by status, engine &amp; experience
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-2 py-0.5 bg-[#FFAB00]/15 border border-[#FFAB00]/30 rounded-full text-[10px] font-bold text-[#FFAB00] font-mono"
                    >
                      {activeFilterCount} active
                    </motion.span>
                  )}
                  <motion.button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* ═══ Scrollable Body ═══ */}
              <div className="overflow-y-auto flex-1 relative z-20 overscroll-contain">
                <div className="p-5 sm:p-6 space-y-7">
                  {/* ─── Section 1: Job Status ─── */}
                  <motion.div
                    custom={0}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                      <Briefcase className="w-3.5 h-3.5 text-[#FFAB00]/70" />
                      <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                        Job Status
                      </h3>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {Object.values(JobProfileStatus).map((status) => {
                        const active = jobStatuses.includes(status);
                        return (
                          <motion.button
                            key={status}
                            type="button"
                            onClick={() => toggleJobStatus(status)}
                            variants={pillVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wide rounded-md border transition-all duration-200 cursor-pointer select-none ${
                              active
                                ? "bg-[#FFAB00] text-black border-[#FFAB00] shadow-[0_0_16px_rgba(255,171,0,0.3)]"
                                : "bg-white/[0.04] text-gray-400 border-white/10 hover:border-[#FFAB00]/40 hover:text-gray-200"
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              {active && (
                                <motion.span
                                  initial={{ scale: 0, rotate: -90 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 400,
                                  }}
                                >
                                  <CheckCircle className="w-3 h-3" />
                                </motion.span>
                              )}
                              {status}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* ─── Section 2: Game Engine ─── */}
                  <motion.div
                    custom={1}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                      <Cpu className="w-3.5 h-3.5 text-[#FFAB00]/70" />
                      <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                        Game Engine
                      </h3>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {ALL_GAME_ENGINES.map((engine) => {
                        const active = enginePreferences.includes(
                          engine.value as GameEngine
                        );
                        return (
                          <motion.button
                            key={engine.value}
                            type="button"
                            onClick={() =>
                              toggleEngine(engine.value as GameEngine)
                            }
                            variants={pillVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wide rounded-md border transition-all duration-200 cursor-pointer select-none ${
                              active
                                ? "bg-[#FFAB00] text-black border-[#FFAB00] shadow-[0_0_16px_rgba(255,171,0,0.3)]"
                                : "bg-white/[0.04] text-gray-400 border-white/10 hover:border-[#FFAB00]/40 hover:text-gray-200"
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              {active && (
                                <motion.span
                                  initial={{ scale: 0, rotate: -90 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 400,
                                  }}
                                >
                                  <CheckCircle className="w-3 h-3" />
                                </motion.span>
                              )}
                              {engine.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* ─── Section 3: Experience ─── */}
                  <motion.div
                    custom={2}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                      <Clock className="w-3.5 h-3.5 text-[#FFAB00]/70" />
                      <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                        Experience Level
                      </h3>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {EXPERIENCE_PRESETS.map((preset) => {
                        const active =
                          minExperienceYears === preset.min &&
                          maxExperienceYears === preset.max;
                        return (
                          <motion.button
                            key={preset.label}
                            type="button"
                            onClick={() =>
                              active
                                ? setExperienceRange(null, null)
                                : setExperienceRange(preset.min, preset.max)
                            }
                            variants={pillVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wide rounded-md border transition-all duration-200 cursor-pointer select-none ${
                              active
                                ? "bg-[#FFAB00] text-black border-[#FFAB00] shadow-[0_0_16px_rgba(255,171,0,0.3)]"
                                : "bg-white/[0.04] text-gray-400 border-white/10 hover:border-[#FFAB00]/40 hover:text-gray-200"
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              {active && (
                                <motion.span
                                  initial={{ scale: 0, rotate: -90 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 400,
                                  }}
                                >
                                  <CheckCircle className="w-3 h-3" />
                                </motion.span>
                              )}
                              {preset.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                    <motion.p
                      key={experienceDisplayText}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] text-gray-500 mt-2.5 font-mono flex items-center gap-1.5"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FFAB00]/40" />
                      {experienceDisplayText}
                    </motion.p>
                  </motion.div>

                  {/* ─── Section 4: Job Categories ─── */}
                  <motion.div
                    custom={3}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-[#FFAB00]/70" />
                        <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                          Job Categories
                        </h3>
                      </div>
                      <span className="text-[10px] text-gray-600 font-mono tabular-nums">
                        {jobCategories.length}/{allJobCategories.length}{" "}
                        selected
                      </span>
                    </div>

                    {/* ★ Category Search Bar ★ */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-md text-sm text-white placeholder:text-gray-600 pl-9 pr-8 py-2 font-mono focus:border-[#FFAB00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFAB00]/20 transition-all"
                      />
                      {/* Clear button */}
                      <AnimatePresence>
                        {categorySearch && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.15 }}
                            type="button"
                            onClick={() => setCategorySearch("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/10 text-gray-500 hover:text-gray-300 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Category List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-64 sm:max-h-72 overflow-y-auto p-2 sm:p-3 border border-white/10 rounded-md bg-white/[0.02] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                      <AnimatePresence mode="popLayout">
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((cat) => {
                            const active = jobCategories.includes(cat);
                            const displayName = getCategoryDisplayName(cat);
                            return (
                              <motion.label
                                key={cat}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                whileHover={{
                                  x: 2,
                                  backgroundColor: "rgba(255,255,255,0.06)",
                                }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center gap-2.5 cursor-pointer p-2 sm:p-2.5 rounded-md transition-colors select-none ${
                                  active ? "bg-[#FFAB00]/[0.06]" : ""
                                }`}
                              >
                                <div className="relative flex-shrink-0">
                                  <input
                                    type="checkbox"
                                    checked={active}
                                    onChange={() => toggleJobCategory(cat)}
                                    className="sr-only peer"
                                  />
                                  <div
                                    className={`w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                                      active
                                        ? "bg-[#FFAB00] border-[#FFAB00] shadow-[0_0_8px_rgba(255,171,0,0.3)]"
                                        : "border-white/20 bg-black/50 peer-hover:border-white/40"
                                    }`}
                                  >
                                    <AnimatePresence>
                                      {active && (
                                        <motion.svg
                                          initial={{ scale: 0, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          exit={{ scale: 0, opacity: 0 }}
                                          transition={{
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 25,
                                          }}
                                          className="w-2.5 h-2.5 text-black"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                          strokeWidth={4}
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                          />
                                        </motion.svg>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>
                                <span
                                  className={`text-xs sm:text-sm font-mono transition-colors duration-200 ${
                                    active ? "text-[#FFAB00]" : "text-gray-400"
                                  }`}
                                >
                                  {/* Highlight matching text */}
                                  {categorySearch.trim() ? (
                                    <HighlightText
                                      text={displayName}
                                      query={categorySearch.trim()}
                                    />
                                  ) : (
                                    displayName
                                  )}
                                </span>
                              </motion.label>
                            );
                          })
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-8 flex flex-col items-center justify-center gap-2"
                          >
                            <Search className="w-5 h-5 text-gray-600" />
                            <p className="text-xs text-gray-500 font-mono text-center">
                              No categories match{" "}
                              <span className="text-gray-400">
                                "{categorySearch}"
                              </span>
                            </p>
                            <button
                              type="button"
                              onClick={() => setCategorySearch("")}
                              className="text-[11px] text-[#FFAB00] hover:underline font-mono mt-1"
                            >
                              Clear search
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Search result count hint */}
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[10px] sm:text-[11px] text-gray-600 font-mono">
                        Portfolios matching{" "}
                        <span className="text-gray-400">ANY</span> selected
                        category will be shown.
                      </p>
                      {categorySearch.trim() && filteredCategories.length > 0 && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[10px] text-gray-500 font-mono tabular-nums"
                        >
                          {filteredCategories.length} found
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* ═══ Footer ═══ */}
              <div className="relative z-20 shrink-0 border-t border-white/10 bg-white/[0.02] p-4 sm:p-5">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {activeFilterCount > 0 && (
                      <motion.button
                        type="button"
                        onClick={handleReset}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all uppercase tracking-wide"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span className="hidden sm:inline">Reset</span>
                      </motion.button>
                    )}
                    <motion.button
                      type="button"
                      onClick={onClose}
                      className="px-4 sm:px-5 py-2.5 border border-white/15 text-gray-400 font-bold uppercase tracking-widest text-xs hover:bg-white/10 hover:text-white transition-all rounded-md"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Cancel
                    </motion.button>
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleApply}
                    disabled={isLoading}
                    className="relative group px-5 sm:px-7 py-2.5 bg-[#FFAB00] text-black font-bold uppercase tracking-widest text-xs overflow-hidden hover:bg-[#FFB900] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Applying...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          Apply Filters
                          {activeFilterCount > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 bg-black/20 rounded text-[10px] font-mono">
                              {activeFilterCount}
                            </span>
                          )}
                        </>
                      )}
                    </span>
                    {!isLoading && (
                      <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out opacity-30" />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Highlight matching text helper ──
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="text-[#FFAB00] bg-[#FFAB00]/10 rounded-sm px-0.5">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Filter, Sparkles, X } from "lucide-react";
// import {
//   JobProfileStatus,
//   EXPERIENCE_PRESETS,
//   ALL_GAME_ENGINES,
//   GameEngine,
//   JobCategory,
//   BACKEND_TO_CATEGORY,
// } from "@/types/portfolio";

// interface MoreFiltersModalProps {
//   isOpen: boolean;
//   onClose: () => void;

//   // Current filter state from hook
//   jobCategories: JobCategory[];
//   jobStatuses: JobProfileStatus[];
//   // skillNames: string[];
//   minExperienceYears: number | null;
//   maxExperienceYears: number | null;
//   enginePreferences: GameEngine[];
//   // location: string | null;

//   // Callbacks from hook
//   setJobCategories: (cats: JobCategory[]) => void;
//   setJobStatuses: (statuses: JobProfileStatus[]) => void;
//   // setSkillNames: (skills: string[]) => void;
//   setExperienceRange: (min: number | null, max: number | null) => void;
//   setEnginePreferences: (engines: GameEngine[]) => void;
//   // setLocation: (location: string | null) => void;

//   onApplyFilters: () => Promise<void>;
//   isLoading: boolean;
// }

// export default function MoreFiltersModal({
//   isOpen,
//   onClose,
//   jobCategories,
//   jobStatuses,
//   // skillNames,
//   minExperienceYears,
//   maxExperienceYears,
//   enginePreferences,
//   setJobCategories,
//   setJobStatuses,
//   // setSkillNames,
//   setExperienceRange,
//   setEnginePreferences,
//   onApplyFilters,
//   isLoading,
// }: MoreFiltersModalProps) {
//   const [tempSkillInput, setTempSkillInput] = useState("");

//   // Get all backend job categories as array
//   const allJobCategories: JobCategory[] = Object.values(JobCategory).filter(
//     (val) => typeof val === "string"
//   ) as JobCategory[];

//   // Toggle job category
//   const toggleJobCategory = (cat: JobCategory) => {
//     setJobCategories(
//       jobCategories.includes(cat)
//         ? jobCategories.filter((c) => c !== cat)
//         : [...jobCategories, cat]
//     );
//   };

//   // Toggle job status
//   const toggleJobStatus = (status: JobProfileStatus) => {
//     setJobStatuses(
//       jobStatuses.includes(status)
//         ? jobStatuses.filter((s) => s !== status)
//         : [...jobStatuses, status]
//     );
//   };

//   // Toggle game engine
//   const toggleEngine = (engine: GameEngine) => {
//     setEnginePreferences(
//       enginePreferences.includes(engine)
//         ? enginePreferences.filter((e) => e !== engine)
//         : [...enginePreferences, engine]
//     );
//   };

//   // Add skill (case-insensitive, trimmed)
//   // const addSkill = () => {
//   //   const trimmedSkill = tempSkillInput.trim();
//   //   if (trimmedSkill && !skillNames.some((s) => s.toLowerCase() === trimmedSkill.toLowerCase())) {
//   //     setSkillNames([...skillNames, trimmedSkill]);
//   //     setTempSkillInput("");
//   //   }
//   // };

//   // Remove skill
//   // const removeSkill = (skill: string) => {
//   //   setSkillNames(skillNames.filter((s) => s !== skill));
//   // };

//   // Handle apply filters
//   const handleApply = async () => {
//     await onApplyFilters();
//     onClose();
//   };

//   // Map backend category enum to display name
//   const getCategoryDisplayName = (cat: JobCategory): string => {
//     // Find the key in BACKEND_TO_CATEGORY that matches this value
//     const entry = Object.entries(BACKEND_TO_CATEGORY).find(([, v]) => v === cat);
//     return entry ? entry[0] : cat.replace(/_/g, " ");
//   };

//   const activePill = "bg-[#FFAB00] text-black border-[#FFAB00] shadow-[0_0_16px_rgba(255,171,0,0.25)]";
//   const idlePill = "bg-white/5 text-gray-300 border-white/10 hover:border-[#FFAB00]/40 hover:text-white";

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-[#FFAB00]/20 text-white shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_100px_rgba(255,171,0,0.08)]">
//         <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.05),rgba(0,255,0,0.02),rgba(0,0,255,0.05))] bg-[length:100%_2px,3px_100%]" />

//         <DialogHeader className="relative">
//           <DialogTitle className="flex items-center gap-2 text-white uppercase tracking-wider font-display">
//             <Filter className="w-4 h-4 text-[#FFAB00]" />
//             Advanced Filters
//           </DialogTitle>
//           <p className="text-xs text-gray-500 font-mono">
//             Refine results by role status, engine, skill and experience.
//           </p>
//         </DialogHeader>

//         <div className="space-y-6 py-2 relative">
//           {/* ===== JOB STATUS ===== */}
//           <div>
//             <h3 className="font-semibold mb-3 text-xs uppercase tracking-widest text-gray-400">Job Status</h3>
//             <div className="flex gap-2 flex-wrap">
//               {Object.values(JobProfileStatus).map((status) => (
//                 <button
//                   key={status}
//                   type="button"
//                   onClick={() => toggleJobStatus(status)}
//                   className={`px-3 py-2 text-xs font-bold uppercase tracking-wide rounded-lg border transition-all ${
//                     jobStatuses.includes(status) ? activePill : idlePill
//                   }`}
//                 >
//                   {status}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* ===== GAME ENGINE ===== */}
//           <div>
//             <h3 className="font-semibold mb-3 text-xs uppercase tracking-widest text-gray-400">Game Engine</h3>
//             <div className="flex gap-2 flex-wrap">
//               {ALL_GAME_ENGINES.map((engine) => (
//                 <button
//                   key={engine.value}
//                   type="button"
//                   onClick={() => toggleEngine(engine.value as GameEngine)}
//                   className={`px-3 py-2 text-xs font-bold uppercase tracking-wide rounded-lg border transition-all ${
//                     enginePreferences.includes(engine.value as GameEngine) ? activePill : idlePill
//                   }`}
//                 >
//                   {engine.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* ===== EXPERIENCE YEARS ===== */}
//           <div>
//             <h3 className="font-semibold mb-3 text-xs uppercase tracking-widest text-gray-400">Experience Level</h3>
//             <div className="flex gap-2 flex-wrap">
//               {EXPERIENCE_PRESETS.map((preset) => (
//                 <button
//                   key={preset.label}
//                   type="button"
//                   onClick={() => setExperienceRange(preset.min, preset.max)}
//                   className={`px-3 py-2 text-xs font-bold uppercase tracking-wide rounded-lg border transition-all ${
//                     minExperienceYears === preset.min && maxExperienceYears === preset.max
//                       ? activePill
//                       : idlePill
//                   }`}
//                 >
//                   {preset.label}
//                 </button>
//               ))}
//             </div>
//             <p className="text-xs text-gray-500 mt-2 font-mono">
//               {minExperienceYears !== null && maxExperienceYears !== null
//                 ? `${minExperienceYears} - ${maxExperienceYears} years`
//                 : minExperienceYears !== null
//                 ? `${minExperienceYears}+ years`
//                 : maxExperienceYears !== null
//                 ? `Up to ${maxExperienceYears} years`
//                 : "Any"}
//             </p>
//           </div>

//           {/* ===== SKILLS ===== */}
//           {/* <div>
//             <h3 className="font-semibold mb-3 text-xs uppercase tracking-widest text-gray-400">Skills</h3>
//             <div className="flex gap-2 mb-3">
//               <input
//                 type="text"
//                 placeholder="Add skill (e.g., C++, Python, HLSL)"
//                 value={tempSkillInput}
//                 onChange={(e) => setTempSkillInput(e.target.value)}
//                 onKeyPress={(e) => e.key === "Enter" && addSkill()}
//                 className="flex-1 bg-black/50 border border-white/15 rounded-md text-white text-sm px-3 py-2 placeholder:text-gray-600 focus:border-[#FFAB00] focus:outline-none transition-colors"
//               />
//               <button
//                 type="button"
//                 onClick={addSkill}
//                 className="shrink-0 px-3 py-2 bg-[#FFAB00] text-black text-xs font-bold uppercase rounded-md hover:bg-[#FFB900] transition-colors"
//               >
//                 Add
//               </button>
//             </div>
//             {skillNames.length > 0 && (
//               <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-md border border-white/10">
//                 {skillNames.map((skill) => (
//                   <div
//                     key={skill}
//                     className="flex items-center gap-1 px-3 py-1.5 bg-[#FFAB00]/10 border border-[#FFAB00]/20 text-[#FFAB00] rounded-full text-xs font-bold uppercase"
//                   >
//                     {skill}
//                     <button
//                       type="button"
//                       onClick={() => removeSkill(skill)}
//                       className="hover:text-white font-bold ml-1 p-0.5 rounded-full hover:bg-[#FFAB00]/20 transition-colors"
//                       aria-label={`Remove ${skill}`}
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//             <p className="text-xs text-gray-500 mt-2 font-mono">
//               Skills are matched case-insensitively. Find portfolios with any of these skills.
//             </p>
//           </div> */}

//           {/* ===== LOCATION (HIDDEN FOR NOW) ===== */}
//           {/* 
//           <div>
//             <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Location</h3>
//             <input
//               type="text"
//               placeholder="Search location (e.g., San Francisco, London)"
//               value={location || ""}
//               onChange={(e) => setLocation(e.target.value || null)}
//               className={inputStyles}
//             />
//             <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
//               Partial matches work (e.g., &quot;San&quot; matches &quot;San Francisco&quot;)
//             </p>
//           </div>
//           */}

//           {/* ===== JOB CATEGORIES ===== */}
//           <div>
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="font-semibold text-xs uppercase tracking-widest text-gray-400">Job Categories</h3>
//               <span className="text-[10px] text-gray-500 font-mono">
//                 {jobCategories.length} selected
//               </span>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto p-3 border border-white/10 rounded-md bg-white/5">
//               {allJobCategories.map((cat) => (
//                 <label 
//                   key={cat} 
//                   className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-2 rounded transition-colors"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={jobCategories.includes(cat)}
//                     onChange={() => toggleJobCategory(cat)}
//                     className="w-4 h-4 rounded border-white/30 text-[#FFAB00] focus:ring-[#FFAB00] bg-black/50"
//                   />
//                   <span className="text-sm text-gray-300">{getCategoryDisplayName(cat)}</span>
//                 </label>
//               ))}
//             </div>
//             <p className="text-xs text-gray-500 mt-2 font-mono">
//               Select one or more categories. Portfolios matching ANY selected category will be shown.
//             </p>
//           </div>
//         </div>

//         <div className="relative flex items-center justify-between gap-3 border-t border-white/10 pt-4">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors"
//           >
//             Cancel
//           </button>

//           <button
//             type="button"
//             onClick={handleApply}
//             disabled={isLoading}
//             className="inline-flex items-center gap-2 px-5 py-2 bg-[#FFAB00] text-black hover:bg-[#FFB900] rounded-lg text-sm font-bold uppercase tracking-wide disabled:opacity-60 transition-colors"
//           >
//             <Sparkles className="w-4 h-4" />
//             {isLoading ? "Applying..." : "Apply Filters"}
//           </button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }