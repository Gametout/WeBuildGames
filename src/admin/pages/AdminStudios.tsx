import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Plus, Search, Filter, Trash2, Edit, 
  MapPin, Users, Star, ExternalLink, ChevronLeft, 
  ChevronRight, Loader2, AlertCircle, CheckCircle,
  RefreshCw, Globe, Upload, FileJson, X,
  Clock, Check, XCircle, Shield, Mail, Phone, 
  Youtube, Linkedin, Twitter, Zap, Briefcase
} from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { StudioFormModal } from "@/components/StudioFormModal";
import { useStudios, useStudioMutation, useStudioFilters, usePendingStudios } from "@/hooks/useStudios";
import { Studio, StudioRequest, StudioFilters, formatEmployeeCount } from "@/types/studio";
import { useToast } from "@/hooks/use-toast";

// ============================================
// MAIN COMPONENT
// ============================================
export default function AdminStudios() {
  const { toast } = useToast();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<"all" | "pending">("all");
  
  // Pagination & Filters
  const [page, setPage] = useState(0);
  const [pendingPage, setPendingPage] = useState(0);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<StudioFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  
  // Bulk Import Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkJsonText, setBulkJsonText] = useState("");
  const [bulkError, setBulkError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Data Fetching
  const { data, isLoading, isError, refetch, isFetching } = useStudios(page, pageSize, filters);
  const { 
    data: pendingData, 
    isLoading: pendingLoading, 
    isError: pendingError, 
    refetch: refetchPending,
    isFetching: pendingFetching 
  } = usePendingStudios(pendingPage, pageSize);
  const { countries, cities } = useStudioFilters();
  const { create, update, remove, bulkRemove, bulkCreate, approve, loading, error, success, reset } = useStudioMutation();

  // Filtered data based on search
  const filteredStudios = useMemo(() => {
    if (!data?.content) return [];
    if (!searchQuery.trim()) return data.content;
    
    const query = searchQuery.toLowerCase();
    return data.content.filter(studio => 
      studio.studioName.toLowerCase().includes(query) ||
      studio.city.toLowerCase().includes(query) ||
      studio.country.toLowerCase().includes(query)
    );
  }, [data?.content, searchQuery]);

  // Handlers
  const handleOpenCreate = () => {
    setSelectedStudio(null);
    reset();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (studio: Studio) => {
    setSelectedStudio(studio);
    reset();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudio(null);
    reset();
  };

  const handleSubmit = async (formData: StudioRequest) => {
    try {
      if (selectedStudio) {
        await update(selectedStudio.id, formData);
        toast({
          title: "✅ Studio Updated",
          description: `${formData.studioName} has been updated successfully.`,
        });
      } else {
        await create(formData);
        toast({
          title: "✅ Studio Created",
          description: `${formData.studioName} has been added to the database.`,
        });
      }
    } catch (err) {
      toast({
        title: "❌ Error",
        description: "Failed to save studio. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedStudio) return;
    try {
      await remove(selectedStudio.id);
      toast({
        title: "🗑️ Studio Deleted",
        description: `${selectedStudio.studioName} has been removed.`,
      });
      handleCloseModal();
    } catch (err) {
      toast({
        title: "❌ Error",
        description: "Failed to delete studio.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    try {
      await bulkRemove(Array.from(selectedIds));
      toast({
        title: "🗑️ Studios Deleted",
        description: `${selectedIds.size} studios have been removed.`,
      });
      setSelectedIds(new Set());
    } catch (err) {
      toast({
        title: "❌ Error",
        description: "Failed to delete studios.",
        variant: "destructive",
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredStudios.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStudios.map(s => s.id)));
    }
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleFilterChange = (key: keyof StudioFilters, value: string) => {
    setPage(0);
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  // Approve/Reject Handlers
  const handleApprove = async (studioId: number) => {
    try {
      await approve(studioId, true);
      toast({
        title: "✅ Studio Approved",
        description: "The studio has been published and is now visible to users.",
      });
      refetchPending();
    } catch (err) {
      toast({
        title: "❌ Error",
        description: "Failed to approve studio. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (studioId: number) => {
    try {
      await approve(studioId, false);
      toast({
        title: "🚫 Studio Rejected",
        description: "The studio submission has been rejected.",
      });
      refetchPending();
    } catch (err) {
      toast({
        title: "❌ Error",
        description: "Failed to reject studio. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Bulk Import Handlers
  const handleOpenBulkImport = () => {
    setBulkJsonText("");
    setBulkError(null);
    setIsBulkModalOpen(true);
  };

  const handleCloseBulkImport = () => {
    setIsBulkModalOpen(false);
    setBulkJsonText("");
    setBulkError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setBulkJsonText(text);
      setBulkError(null);
    };
    reader.onerror = () => {
      setBulkError("Failed to read file");
    };
    reader.readAsText(file);
  };

  const handleBulkImport = async () => {
    if (!bulkJsonText.trim()) {
      setBulkError("Please enter JSON data or upload a file");
      return;
    }

    try {
      const parsed = JSON.parse(bulkJsonText);
      const studiosArray: StudioRequest[] = Array.isArray(parsed) ? parsed : [parsed];
      
      // Validate required fields
      for (const studio of studiosArray) {
        if (!studio.studioName || !studio.country || !studio.city) {
          throw new Error("Each studio must have studioName, country, and city");
        }
      }

      await bulkCreate(studiosArray);
      toast({
        title: "✅ Studios Imported",
        description: `${studiosArray.length} studio(s) have been added successfully.`,
      });
      handleCloseBulkImport();
    } catch (err) {
      if (err instanceof SyntaxError) {
        setBulkError("Invalid JSON format. Please check your input.");
      } else if (err instanceof Error) {
        setBulkError(err.message);
      } else {
        setBulkError("Failed to import studios. Please try again.");
      }
    }
  };

  const sampleJson = JSON.stringify([
    {
      studioName: "Example Studio",
      studioLogoUrl: "https://example.com/logo.png",
      studioDescription: "Short description",
      studioWebsiteUrl: "https://example.com",
      ratings: 4,
      country: "India",
      city: "Mumbai",
      description: "Full description of the studio",
      employeesCount: 50,
      latitude: 19.076,
      longitude: 72.877
    }
  ], null, 2);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="font-display text-4xl md:text-5xl text-white flex items-center gap-3">
                <Building2 className="w-10 h-10 text-[#FFAB00]" />
                Studio <span className="text-gradient-gold">Management</span>
              </h1>
              <p className="text-gray-400 mt-2">
                Manage game development studios in the database
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenBulkImport}
                className="flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/20 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Bulk Import
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenCreate}
                className="flex items-center gap-2 px-6 py-3 bg-[#FFAB00] text-black font-bold uppercase tracking-widest hover:bg-white transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Studio
              </motion.button>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex gap-2 mb-6"
          >
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest transition-all duration-300 border-b-2 ${
                activeTab === "all"
                  ? "text-[#FFAB00] border-[#FFAB00] bg-[#FFAB00]/10"
                  : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
              }`}
            >
              <Building2 className="w-5 h-5" />
              All Studios
              {data && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  activeTab === "all" ? "bg-[#FFAB00]/20" : "bg-white/10"
                }`}>
                  {data.totalElements}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest transition-all duration-300 border-b-2 relative ${
                activeTab === "pending"
                  ? "text-yellow-400 border-yellow-400 bg-yellow-400/10"
                  : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
              }`}
            >
              <Clock className="w-5 h-5" />
              Pending Approval
              {pendingData && pendingData.totalElements > 0 && (
                <span className={`px-2 py-0.5 text-xs rounded-full animate-pulse ${
                  activeTab === "pending" ? "bg-yellow-400/30 text-yellow-300" : "bg-yellow-500/30 text-yellow-400"
                }`}>
                  {pendingData.totalElements}
                </span>
              )}
            </button>
          </motion.div>

          {/* All Studios Tab Content */}
          {activeTab === "all" && (
            <>
              {/* Filters & Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
          >
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search studios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-white/20 pl-10 pr-4 py-3 rounded-lg text-white placeholder:text-gray-500 focus:border-[#FFAB00] focus:outline-none transition-colors"
              />
            </div>

            {/* Country Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={filters.country || ""}
                onChange={(e) => handleFilterChange("country", e.target.value)}
                className="w-full bg-black/50 border border-white/20 pl-10 pr-4 py-3 rounded-lg text-white appearance-none focus:border-[#FFAB00] focus:outline-none transition-colors"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={filters.city || ""}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                className="w-full bg-black/50 border border-white/20 pl-10 pr-4 py-3 rounded-lg text-white appearance-none focus:border-[#FFAB00] focus:outline-none transition-colors"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Bulk Actions Bar */}
          <AnimatePresence>
            {selectedIds.size > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 bg-[#FFAB00]/10 border border-[#FFAB00]/30 rounded-lg flex items-center justify-between"
              >
                <span className="text-[#FFAB00] font-mono">
                  {selectedIds.size} studio{selectedIds.size > 1 ? "s" : ""} selected
                </span>
                <button
                  onClick={handleBulkDelete}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded hover:bg-red-500/30 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete Selected
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Studios Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden"
          >
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-white/5 border-b border-white/10 text-xs font-mono text-gray-500 uppercase tracking-widest">
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={selectedIds.size === filteredStudios.length && filteredStudios.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 accent-[#FFAB00]"
                />
              </div>
              <div className="col-span-4">Studio</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-2">Employees</div>
              <div className="col-span-2">Rating</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#FFAB00] animate-spin" />
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="flex flex-col items-center justify-center py-20 text-red-400">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p className="text-lg mb-4">Failed to load studios</p>
                <button
                  onClick={() => refetch()}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && filteredStudios.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Building2 className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg mb-2">No studios found</p>
                <p className="text-sm">
                  {searchQuery ? "Try a different search term" : "Add your first studio to get started"}
                </p>
              </div>
            )}

            {/* Table Rows */}
            <AnimatePresence>
              {filteredStudios.map((studio, index) => (
                <motion.div
                  key={studio.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`grid grid-cols-12 gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${
                    selectedIds.has(studio.id) ? "bg-[#FFAB00]/5" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <div className="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(studio.id)}
                      onChange={() => toggleSelect(studio.id)}
                      className="w-4 h-4 accent-[#FFAB00]"
                    />
                  </div>

                  {/* Studio Info */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                      {studio.studioLogoUrl ? (
                        <img
                          src={studio.studioLogoUrl}
                          alt={studio.studioName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">{studio.studioName}</p>
                      {studio.studioWebsiteUrl && (
                        <a
                          href={studio.studioWebsiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#FFAB00] hover:underline flex items-center gap-1"
                        >
                          <Globe className="w-3 h-3" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="col-span-2 flex items-center text-sm text-gray-400">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{studio.city}, {studio.country}</span>
                  </div>

                  {/* Employees */}
                  <div className="col-span-2 flex items-center text-sm text-gray-400">
                    <Users className="w-4 h-4 mr-1" />
                    {formatEmployeeCount(studio.employeesCount)}
                  </div>

                  {/* Rating */}
                  <div className="col-span-2 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < studio.ratings 
                            ? "text-[#FFAB00] fill-[#FFAB00]" 
                            : "text-gray-700"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end">
                    <button
                      onClick={() => handleOpenEdit(studio)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                      title="Edit Studio"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between p-4 bg-white/5 border-t border-white/10">
                <p className="text-sm text-gray-500">
                  Showing {data.pageNumber * data.pageSize + 1} - {Math.min((data.pageNumber + 1) * data.pageSize, data.totalElements)} of {data.totalElements} studios
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={data.pageNumber === 0 || isFetching}
                    className="p-2 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-400 font-mono px-3">
                    {data.pageNumber + 1} / {data.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={data.last || isFetching}
                    className="p-2 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
          </>
          )}

          {/* Pending Studios Tab Content */}
          {activeTab === "pending" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Pending Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Shield className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Pending Studio Submissions</h2>
                    <p className="text-sm text-gray-400">Review and approve or reject user-submitted studios</p>
                  </div>
                </div>
                <button
                  onClick={() => refetchPending()}
                  disabled={pendingFetching}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${pendingFetching ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>

              {/* Pending Studios Grid */}
              {pendingLoading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                </div>
              )}

              {pendingError && (
                <div className="flex flex-col items-center justify-center py-20 text-red-400">
                  <AlertCircle className="w-12 h-12 mb-4" />
                  <p className="text-lg mb-4">Failed to load pending studios</p>
                  <button
                    onClick={() => refetchPending()}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </button>
                </div>
              )}

              {!pendingLoading && !pendingError && (!pendingData?.content || pendingData.content.length === 0) && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-[#0a0a0a] border border-white/10 rounded-lg">
                  <CheckCircle className="w-16 h-16 mb-4 opacity-30 text-green-500" />
                  <p className="text-lg mb-2 text-green-400">All caught up!</p>
                  <p className="text-sm">No pending studios to review</p>
                </div>
              )}

              {!pendingLoading && !pendingError && pendingData?.content && pendingData.content.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AnimatePresence>
                    {pendingData.content.map((studio, index) => (
                      <motion.div
                        key={studio.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative bg-[#0a0a0a] border border-yellow-500/30 rounded-lg overflow-hidden hover:border-yellow-500/60 transition-all duration-300"
                      >
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Pending Badge */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
                          <Clock className="w-3 h-3 text-yellow-400 animate-pulse" />
                          <span className="text-xs font-mono text-yellow-400">PENDING</span>
                        </div>

                        <div className="p-6 relative">
                          {/* Studio Header */}
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10 flex-shrink-0 border border-white/10">
                              {studio.studioLogoUrl ? (
                                <img
                                  src={studio.studioLogoUrl}
                                  alt={studio.studioName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Building2 className="w-8 h-8 text-gray-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-white truncate group-hover:text-yellow-400 transition-colors">
                                {studio.studioName}
                              </h3>
                              <p className="text-sm text-gray-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {studio.city}, {studio.country}
                              </p>
                              {studio.studioWebsiteUrl && (
                                <a
                                  href={studio.studioWebsiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-[#FFAB00] hover:underline flex items-center gap-1 mt-1"
                                >
                                  <Globe className="w-3 h-3" />
                                  {studio.studioWebsiteUrl}
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Status Badges */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {studio.hiringStatus && (
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold uppercase ${
                                studio.hiringStatus === "HIRING" 
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                                  : studio.hiringStatus === "OPEN_TO_HIRE"
                                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                    : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                              }`}>
                                <Zap className="w-3 h-3" />
                                {studio.hiringStatus === "HIRING" ? "Hiring" : studio.hiringStatus === "OPEN_TO_HIRE" ? "Open to Hire" : "Not Hiring"}
                              </span>
                            )}
                            {studio.category && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold uppercase bg-[#FFAB00]/20 text-[#FFAB00] border border-[#FFAB00]/30">
                                <Briefcase className="w-3 h-3" />
                                {studio.category === "PRODUCT_BASED" ? "Product/IP" : "Service"}
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          {(studio.studioDescription || studio.description) && (
                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                              {studio.studioDescription || studio.description}
                            </p>
                          )}

                          {/* Stats */}
                          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {formatEmployeeCount(studio.employeesCount)}
                            </span>
                            <span className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < studio.ratings 
                                      ? "text-[#FFAB00] fill-[#FFAB00]" 
                                      : "text-gray-700"
                                  }`}
                                />
                              ))}
                            </span>
                          </div>

                          {/* Contact Info */}
                          {(studio.studioEmail || studio.studioMobile) && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {studio.studioEmail && (
                                <a 
                                  href={`mailto:${studio.studioEmail}`}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-[#FFAB00]/30 transition-colors"
                                >
                                  <Mail className="w-3 h-3" />
                                  {studio.studioEmail}
                                </a>
                              )}
                              {studio.studioMobile && (
                                <a 
                                  href={`tel:${studio.studioMobile}`}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-[#FFAB00]/30 transition-colors"
                                >
                                  <Phone className="w-3 h-3" />
                                  {studio.studioMobile}
                                </a>
                              )}
                            </div>
                          )}

                          {/* Social Links */}
                          {(studio.youtubeUrl || studio.linkedinUrl || studio.twitterUrl || studio.discordUrl) && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {studio.youtubeUrl && (
                                <a
                                  href={studio.youtubeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                                  title="YouTube"
                                >
                                  <Youtube className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {studio.linkedinUrl && (
                                <a
                                  href={studio.linkedinUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                  title="LinkedIn"
                                >
                                  <Linkedin className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {studio.twitterUrl && (
                                <a
                                  href={studio.twitterUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 transition-colors"
                                  title="Twitter"
                                >
                                  <Twitter className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {studio.discordUrl && (
                                <a
                                  href={studio.discordUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                                  title="Discord"
                                >
                                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                  </svg>
                                </a>
                              )}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleApprove(studio.id)}
                              disabled={loading}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 border border-green-500/30 text-green-400 font-bold uppercase tracking-widest hover:bg-green-500/30 hover:border-green-500/50 transition-all disabled:opacity-50"
                            >
                              {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Check className="w-5 h-5" />
                              )}
                              Approve
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleReject(studio.id)}
                              disabled={loading}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 border border-red-500/30 text-red-400 font-bold uppercase tracking-widest hover:bg-red-500/30 hover:border-red-500/50 transition-all disabled:opacity-50"
                            >
                              {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <XCircle className="w-5 h-5" />
                              )}
                              Reject
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Pending Pagination */}
              {pendingData && pendingData.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-6">
                  <button
                    onClick={() => setPendingPage(p => Math.max(0, p - 1))}
                    disabled={pendingPage === 0 || pendingFetching}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <span className="text-sm text-gray-400 font-mono">
                    Page {pendingPage + 1} of {pendingData.totalPages}
                  </span>
                  <button
                    onClick={() => setPendingPage(p => p + 1)}
                    disabled={pendingData.last || pendingFetching}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Refresh indicator */}
          {isFetching && !isLoading && (
            <div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-[#FFAB00]/20 border border-[#FFAB00]/30 rounded-lg text-[#FFAB00]">
              <Loader2 className="w-4 h-4 animate-spin" />
              Refreshing...
            </div>
          )}
        </div>

        {/* Studio Form Modal */}
        <StudioFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          onDelete={selectedStudio ? handleDelete : undefined}
          studio={selectedStudio}
          isSubmitting={loading}
          error={error}
          success={success}
        />

        {/* Bulk Import Modal */}
        <AnimatePresence>
          {isBulkModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              onClick={(e) => e.target === e.currentTarget && handleCloseBulkImport()}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#0a0a0a] border border-white/20 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#FFAB00]/20 rounded-lg">
                      <FileJson className="w-6 h-6 text-[#FFAB00]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Bulk Import Studios</h2>
                      <p className="text-sm text-gray-400">Import multiple studios via JSON</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseBulkImport}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(80vh-180px)]">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Upload JSON File
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-white/20 rounded-lg hover:border-[#FFAB00]/50 hover:bg-white/5 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-400">Click to upload JSON file</span>
                    </button>
                  </div>

                  {/* JSON Textarea */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Or paste JSON directly
                    </label>
                    <textarea
                      value={bulkJsonText}
                      onChange={(e) => {
                        setBulkJsonText(e.target.value);
                        setBulkError(null);
                      }}
                      placeholder={sampleJson}
                      rows={12}
                      className="w-full bg-black/50 border border-white/20 rounded-lg p-4 text-white font-mono text-sm placeholder:text-gray-600 focus:border-[#FFAB00] focus:outline-none resize-none"
                    />
                  </div>

                  {/* Error Display */}
                  {bulkError && (
                    <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{bulkError}</span>
                    </div>
                  )}

                  {/* Sample Format */}
                  <details className="group">
                    <summary className="flex items-center gap-2 cursor-pointer text-sm text-gray-400 hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                      View expected JSON format
                    </summary>
                    <pre className="mt-3 p-4 bg-white/5 rounded-lg text-xs text-gray-300 overflow-x-auto">
                      {sampleJson}
                    </pre>
                  </details>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
                  <button
                    onClick={handleCloseBulkImport}
                    className="px-5 py-2.5 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBulkImport}
                    disabled={loading || !bulkJsonText.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#FFAB00] text-black font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Import Studios
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
