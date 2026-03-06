import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Users, ExternalLink, Star, Building, Loader2, AlertCircle,
  Filter, Plus, Search, XCircle, Grid, Zap, Globe,
  Terminal, Mail, Phone, Youtube, Linkedin, Twitter, Briefcase, LogIn
} from "lucide-react";
import { PageTransition, FadeInView } from "@/components/PageTransition";
import { Footer } from "@/components/Footer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { UserStudioFormModal } from "@/components/UserStudioFormModal";
import { StarRating, CompactStarRating } from "@/components/StarRating";
import { useStudios, useStudioFilters, useStudioMutation } from "@/hooks/useStudios";
import { useStudioRating } from "@/hooks/useStudioRating";
import { Studio, StudioFilters, StudioRequest, formatEmployeeCount } from "@/types/studio";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { statsService } from "@/services/statsService";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { HeroTagline } from "@/components/HeroTagline";
import { CustomDropdown } from "@/components/CustomDropdown";

// ============================================
// STUDIO RATING SECTION COMPONENT
// ============================================
interface StudioRatingSectionProps {
  studioId: number;
  initialRating: number;
  initialRatingCount?: number;
  isAuthenticated: boolean;
}

const StudioRatingSection = ({
  studioId,
  initialRating,
  initialRatingCount = 0,
  isAuthenticated,
}: StudioRatingSectionProps) => {
  const { toast } = useToast();
  const {
    myRating,
    stats,
    isLoading,
    isSubmitting,
    submitRating,
    hasRated,
  } = useStudioRating({ studioId, autoFetch: isAuthenticated });

  const averageRating = stats?.averageRating ?? initialRating;
  const ratingCount = stats?.ratingCount ?? initialRatingCount;

  const handleRate = async (rating: number) => {
    try {
      await submitRating(rating);
      toast({
        title: hasRated ? "⭐ Rating Updated!" : "⭐ Rating Submitted!",
        description: `You rated this studio ${rating} star${rating > 1 ? "s" : ""}.`,
      });
    } catch {
      toast({
        title: "❌ Rating Failed",
        description: "Failed to submit your rating. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h4 className="font-display text-lg mb-3">Community Rating</h4>
      <div className="p-4 rounded-lg bg-muted/30 border border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <CompactStarRating rating={Math.round(averageRating)} size="md" />
            {ratingCount > 0 && (
              <span className="text-xs text-muted-foreground">
                ({ratingCount} {ratingCount === 1 ? "rating" : "ratings"})
              </span>
            )}
          </div>
          <span className="text-lg font-bold text-primary">
            {averageRating.toFixed(1)}/5
          </span>
        </div>

        {isAuthenticated ? (
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">
                {hasRated ? "Your rating (click to update):" : "Rate this studio:"}
              </p>
              {isSubmitting && (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              )}
            </div>
            <StarRating
              rating={myRating ?? 0}
              size="lg"
              interactive={!isSubmitting}
              onRate={handleRate}
            />
            {hasRated && myRating && (
              <p className="text-xs text-primary mt-2">
                You rated: {myRating} star{myRating > 1 ? "s" : ""}
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground pt-3 border-t border-border/50">
            <span className="text-primary">Login</span> to rate this studio
          </p>
        )}
      </div>
    </div>
  );
};

// ============================================
// STUDIO CARD COMPONENT
// ============================================
const StudioCard = ({
  studio,
  onClick,
  isAuthenticated,
  index
}: {
  studio: Studio;
  onClick: () => void;
  isAuthenticated: boolean;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="group relative cursor-pointer"
  >
    <div className="relative bg-gradient-to-br from-[#0a0a0a] to-[#111111] rounded-lg border border-white/10 overflow-hidden transition-all duration-300 group-hover:border-[#FFAB00]/50 group-hover:shadow-[0_0_30px_rgba(255,171,0,0.15)]">
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFAB00]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 border border-white/10 group-hover:border-[#FFAB00]/30 transition-colors">
            {studio.studioLogoUrl ? (
              <img
                src={studio.studioLogoUrl}
                alt={studio.studioName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building className="w-6 h-6 text-gray-600" />
              </div>
            )}
            {/* Hiring Status Indicator Dot */}
            {studio.hiringStatus && studio.hiringStatus !== "NOT_HIRING" && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0a0a0a] ${
                  studio.hiringStatus === "HIRING" 
                    ? "bg-green-500" 
                    : "bg-yellow-500"
                }`}
                title={studio.hiringStatus === "HIRING" ? "Hiring" : "Open to Hire"}
              >
                <span className="absolute inset-0 rounded-full animate-ping opacity-50" 
                  style={{ backgroundColor: studio.hiringStatus === "HIRING" ? "#22c55e" : "#eab308" }} 
                />
              </motion.div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display text-sm sm:text-base text-white group-hover:text-[#FFAB00] transition-colors truncate">
              {studio.studioName}
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 flex-shrink-0 text-[#FFAB00]" />
              <span className="truncate">{studio.city}, {studio.country}</span>
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between mb-3 p-2 rounded bg-white/5 border border-white/5">
          <CompactStarRating rating={Math.round(studio.ratings)} size="sm" />
          <span className="text-xs font-mono text-[#FFAB00]">{studio.ratings.toFixed(1)}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users className="w-3.5 h-3.5" />
            {formatEmployeeCount(studio.employeesCount)}
          </span>

          <motion.span
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1 px-2 py-1 text-[10px] bg-[#FFAB00]/10 text-[#FFAB00] rounded-full font-bold uppercase tracking-wide"
          >
            <Star className="w-3 h-3" />
            {isAuthenticated ? "Rate" : "View"}
          </motion.span>
        </div>
      </div>
    </div>
  </motion.div>
);

// ============================================
// MAIN COMPONENT
// ============================================

const Studios = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<StudioFilters>({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [totalStudios, setTotalStudios] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    statsService.getStudiosCount().then(res => setTotalStudios(res.data.count));
  }, []);

  const { data, isLoading, isError, refetch } = useStudios(page, 12, filters);
  const { countries, cities } = useStudioFilters();
  const { createRequest, loading: submitting, error: submitError, success: submitSuccess, reset } = useStudioMutation();

  const studios = data?.content || [];

  // Filter studios by search query (client-side)
  const filteredStudios = searchQuery.trim()
    ? studios.filter(s =>
      s.studioName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : studios;

  const handleFilterChange = (key: keyof StudioFilters, value: string) => {
    setPage(0);
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleSubmitStudio = async (studioData: StudioRequest) => {
    try {
      await createRequest(studioData);
      toast({
        title: "🎮 Studio Submitted!",
        description: "Your studio has been submitted for review. We'll notify you once it's approved.",
      });
    } catch (err) {
      toast({
        title: "❌ Submission Failed",
        description: "Failed to submit studio. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCloseSubmitModal = () => {
    setIsSubmitModalOpen(false);
    reset();
  };

  const hasActiveFilters = filters.country || filters.city || filters.ratings || filters.category || filters.hiringStatus;

  return (
    <PageTransition>
      <main className="min-h-screen bg-background pt-20 selection:bg-[#FFAB00] selection:text-black relative overflow-hidden">

        {/* HeroTagline */}
        <HeroTagline
          phrase="Register Your Studio for Free"
          size="sm"
          className="mb-4"
        />

        {/* Background Effects */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 171, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 171, 0, 0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
        <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-background via-transparent to-background" />

        {/* Compact Header */}
        <section className="px-4 md:px-8 max-w-7xl mx-auto mb-4 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left: Title & Stats */}
            <div className="flex items-center gap-4">
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tight">
                Game <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAB00] via-yellow-400 to-[#FFAB00]">Studios</span>
              </h1>

              {/* Stats Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                <Building className="w-3 h-3 text-[#FFAB00]" />
                <span className="text-[10px] font-mono text-gray-400">
                  <span className="text-white font-bold"><AnimatedCounter value={totalStudios} /></span> Listed
                </span>
              </div>
            </div>

            {/* Right: Submit CTA - Auth Protected */}
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsSubmitModalOpen(true)}
                className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFAB00] to-[#FF8C00] text-black font-bold uppercase text-xs tracking-wide overflow-hidden rounded-sm shadow-[0_0_20px_rgba(255,171,0,0.3)] hover:shadow-[0_0_30px_rgba(255,171,0,0.5)] transition-shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Studio</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                  animate={{ translateX: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              </motion.button>
            ) : (
              <a
                href="/login"
                className="group relative flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white font-bold uppercase text-xs tracking-wide overflow-hidden rounded-sm hover:border-[#FFAB00]/50 hover:bg-white/5 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Login to Submit</span>
              </a>
            )}
          </div>

          {/* Tagline */}
          <p className="text-xs sm:text-sm text-gray-500 font-mono mt-2">
            {'>'} Discover India's thriving game development ecosystem
          </p>
        </section>

        {/* Control Deck - Sticky Filters */}
        <section className="sticky top-20 z-40 mb-6">
          <div className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-2xl" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFAB00]/30 to-transparent" />

          <div className="relative px-4 md:px-8 max-w-7xl mx-auto py-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search studios..."
                  className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFAB00]/50 focus:bg-white/[0.06] transition-all duration-300 font-mono placeholder:text-gray-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <XCircle className="w-4 h-4 text-gray-500 hover:text-white" />
                  </motion.button>
                )}
              </div>

              {/* Filter Dropdowns */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 text-gray-500">
                  <Filter className="w-3.5 h-3.5" />
                </div>

                {/* Country Filter */}
                <div className="w-36">
                  <CustomDropdown
                    value={filters.country || ""}
                    onChange={(value) => handleFilterChange("country", value)}
                    placeholder="Countries"
                    options={[
                      { value: "", label: "Countries" },
                      ...countries.map((country) => ({ value: country, label: country })),
                    ]}
                    searchable={countries.length > 10}
                  />
                </div>

                {/* City Filter */}
                <div className="w-36">
                  <CustomDropdown
                    value={filters.city || ""}
                    onChange={(value) => handleFilterChange("city", value)}
                    placeholder="All Cities"
                    options={[
                      { value: "", label: "Cities" },
                      ...cities.map((city) => ({ value: city, label: city })),
                    ]}
                    searchable={cities.length > 10}
                  />
                </div>

                {/* Rating Filter */}
                <div className="w-32">
                  <CustomDropdown
                    value={filters.ratings?.toString() || ""}
                    onChange={(value) => handleFilterChange("ratings", value)}
                    placeholder="All Ratings"
                    icon={<Star className="w-3 h-3" />}
                    options={[
                      { value: "", label: "Ratings" },
                      { value: "5", label: "5 Stars" },
                      { value: "4", label: "4+ Stars" },
                      { value: "3", label: "3+ Stars" },
                      { value: "2", label: "2+ Stars" },
                      { value: "1", label: "1+ Stars" },
                    ]}
                  />
                </div>

                {/* Category Filter */}
                <div className="w-36">
                  <CustomDropdown
                    value={filters.category || ""}
                    onChange={(value) => handleFilterChange("category", value)}
                    placeholder="Category"
                    icon={<Grid className="w-3 h-3" />}
                    options={[
                      { value: "", label: "Category" },
                      { value: "PRODUCT_BASED", label: "Product/IP Based" },
                      { value: "SERVICE_BASED", label: "Service Based" },
                    ]}
                  />
                </div>

                {/* Hiring Status Filter */}
                <div className="w-36">
                  <CustomDropdown
                    value={filters.hiringStatus || ""}
                    onChange={(value) => handleFilterChange("hiringStatus", value)}
                    placeholder="Hiring"
                    icon={<Zap className="w-3 h-3" />}
                    options={[
                      { value: "", label: "Hiring Status" },
                      { value: "HIRING", label: "Hiring" },
                      { value: "OPEN_TO_HIRE", label: "Open to Hire" },
                      { value: "NOT_HIRING", label: "Not Hiring" },
                    ]}
                  />
                </div>

                {/* Clear Filters */}
                <AnimatePresence>
                  {hasActiveFilters && (
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      onClick={() => setFilters({})}
                      className="flex items-center gap-1 px-2 py-1.5 text-xs text-[#FFAB00] hover:bg-[#FFAB00]/10 rounded-lg transition-colors"
                    >
                      <XCircle className="w-3 h-3" />
                      Clear
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Studio Grid */}
        <section className="px-4 md:px-8 max-w-7xl mx-auto pb-20 min-h-[400px] relative z-10">

          {/* Section Header */}
          <div className="flex items-center gap-2 mb-4 text-gray-500 font-mono text-xs uppercase">
            <Terminal className="w-3 h-3 text-[#FFAB00]" />
            <span className="text-white">Studios</span>
            <span>•</span>
            <span className="text-[#FFAB00]">{filteredStudios.length}</span>
            <span>results</span>
            {isLoading && <Loader2 className="w-3 h-3 text-[#FFAB00] animate-spin ml-2" />}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="aspect-[4/3] bg-white/5 rounded-lg animate-pulse border border-white/5" />
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle className="w-12 h-12 text-red-500/50 mb-4" />
              <h3 className="font-display text-xl text-white mb-2">CONNECTION FAILED</h3>
              <p className="text-gray-500 font-mono text-sm mb-6">Failed to load studios</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => refetch()}
                className="px-6 py-2 bg-[#FFAB00] text-black font-bold uppercase text-sm rounded"
              >
                Retry
              </motion.button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && filteredStudios.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Building className="w-12 h-12 text-gray-700 mb-4" />
              <h3 className="font-display text-xl text-white mb-2">NO STUDIOS FOUND</h3>
              <p className="text-gray-500 font-mono text-sm">
                {searchQuery ? `No results for "${searchQuery}"` : "Try adjusting your filters"}
              </p>
            </div>
          )}

          {/* Studios Grid */}
          {!isLoading && !isError && filteredStudios.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {filteredStudios.map((studio, index) => (
                  <StudioCard
                    key={studio.id}
                    studio={studio}
                    onClick={() => setSelectedStudio(studio)}
                    isAuthenticated={isAuthenticated}
                    index={index}
                  />
                ))}
              </div>

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:border-[#FFAB00]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </motion.button>
                  <span className="text-xs text-gray-500 font-mono">
                    {page + 1} / {data.totalPages}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(p => p + 1)}
                    disabled={data.last}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:border-[#FFAB00]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </motion.button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Studio Details Sheet */}
        <Sheet open={!!selectedStudio} onOpenChange={() => setSelectedStudio(null)}>
          <SheetContent className="bg-[#0a0a0a] border-[#FFAB00]/20 overflow-y-auto">
            {selectedStudio && (
              <>
                <SheetHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                      {selectedStudio.studioLogoUrl ? (
                        <img
                          src={selectedStudio.studioLogoUrl}
                          alt={selectedStudio.studioName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building className="w-8 h-8 text-gray-600" />
                        </div>
                      )}
                      {/* Hiring Status Indicator */}
                      {selectedStudio.hiringStatus && selectedStudio.hiringStatus !== "NOT_HIRING" && (
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0a0a0a] ${
                          selectedStudio.hiringStatus === "HIRING" ? "bg-green-500" : "bg-yellow-500"
                        }`}>
                          <span className="absolute inset-0 rounded-full animate-ping opacity-50" 
                            style={{ backgroundColor: selectedStudio.hiringStatus === "HIRING" ? "#22c55e" : "#eab308" }} 
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <SheetTitle className="font-display text-xl text-white">
                        {selectedStudio.studioName}
                      </SheetTitle>
                      <SheetDescription className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-3 h-3 text-[#FFAB00]" />
                        {selectedStudio.city}, {selectedStudio.country}
                      </SheetDescription>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedStudio.hiringStatus && (
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold uppercase ${
                        selectedStudio.hiringStatus === "HIRING" 
                          ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                          : selectedStudio.hiringStatus === "OPEN_TO_HIRE"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                      }`}>
                        <Zap className="w-3 h-3" />
                        {selectedStudio.hiringStatus === "HIRING" ? "Hiring" : selectedStudio.hiringStatus === "OPEN_TO_HIRE" ? "Open to Hire" : "Not Hiring"}
                      </span>
                    )}
                    {selectedStudio.category && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold uppercase bg-[#FFAB00]/20 text-[#FFAB00] border border-[#FFAB00]/30">
                        <Briefcase className="w-3 h-3" />
                        {selectedStudio.category === "PRODUCT_BASED" ? "Product/IP" : "Service"}
                      </span>
                    )}
                  </div>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                  {/* Rating Section */}
                  <StudioRatingSection
                    studioId={selectedStudio.id}
                    initialRating={selectedStudio.ratings}
                    initialRatingCount={selectedStudio.ratingCount}
                    isAuthenticated={isAuthenticated}
                  />

                  {/* Description */}
                  {(selectedStudio.description || selectedStudio.studioDescription) && (
                    <div>
                      <h4 className="font-display text-base text-white mb-2">About</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {selectedStudio.description || selectedStudio.studioDescription}
                      </p>
                    </div>
                  )}

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <Users className="w-4 h-4 text-[#FFAB00] mb-1" />
                      <p className="text-[10px] text-gray-500 uppercase">Employees</p>
                      <p className="text-sm font-medium text-white">{formatEmployeeCount(selectedStudio.employeesCount)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <MapPin className="w-4 h-4 text-[#FFAB00] mb-1" />
                      <p className="text-[10px] text-gray-500 uppercase">Location</p>
                      <p className="text-sm font-medium text-white">{selectedStudio.city}</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  {(selectedStudio.studioEmail || selectedStudio.studioMobile) && (
                    <div>
                      <h4 className="font-display text-base text-white mb-3">Contact</h4>
                      <div className="space-y-2">
                        {selectedStudio.studioEmail && (
                          <a 
                            href={`mailto:${selectedStudio.studioEmail}`}
                            className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#FFAB00]/30 transition-colors group"
                          >
                            <Mail className="w-4 h-4 text-[#FFAB00]" />
                            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{selectedStudio.studioEmail}</span>
                          </a>
                        )}
                        {selectedStudio.studioMobile && (
                          <a 
                            href={`tel:${selectedStudio.studioMobile}`}
                            className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#FFAB00]/30 transition-colors group"
                          >
                            <Phone className="w-4 h-4 text-[#FFAB00]" />
                            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{selectedStudio.studioMobile}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  {(selectedStudio.youtubeUrl || selectedStudio.linkedinUrl || selectedStudio.twitterUrl || selectedStudio.discordUrl) && (
                    <div>
                      <h4 className="font-display text-base text-white mb-3">Social</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedStudio.youtubeUrl && (
                          <a
                            href={selectedStudio.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <Youtube className="w-4 h-4" />
                            <span className="text-xs font-medium">YouTube</span>
                          </a>
                        )}
                        {selectedStudio.linkedinUrl && (
                          <a
                            href={selectedStudio.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                            <span className="text-xs font-medium">LinkedIn</span>
                          </a>
                        )}
                        {selectedStudio.twitterUrl && (
                          <a
                            href={selectedStudio.twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 transition-colors"
                          >
                            <Twitter className="w-4 h-4" />
                            <span className="text-xs font-medium">Twitter</span>
                          </a>
                        )}
                        {selectedStudio.discordUrl && (
                          <a
                            href={selectedStudio.discordUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                            </svg>
                            <span className="text-xs font-medium">Discord</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  {selectedStudio.studioWebsiteUrl && (
                    <motion.a
                      href={selectedStudio.studioWebsiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#FFAB00] text-black rounded-lg font-bold uppercase text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Website
                    </motion.a>
                  )}
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* User Studio Submit Modal */}
        <UserStudioFormModal
          isOpen={isSubmitModalOpen}
          onClose={handleCloseSubmitModal}
          onSubmit={handleSubmitStudio}
          isSubmitting={submitting}
          error={submitError}
          success={submitSuccess}
        />

        <Footer />
      </main>
    </PageTransition>
  );
};

export default Studios;