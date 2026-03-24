import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Building2, MapPin, Globe, Users, Star, 
  Save, Loader2, AlertCircle, CheckCircle, Trash2
} from "lucide-react";
import { Studio, StudioRequest } from "@/types/studio";
import { MediaUploader } from "@/components/MediaUploader";
import { mediaUploadService } from "@/services/mediaUploadService";
import { ValidationErrorDisplay, validateStudioForm, ValidationError } from "@/utils/formValidation.tsx";

interface StudioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudioRequest) => Promise<void>;
  onDelete?: () => Promise<void>;
  studio?: Studio | null; // If provided, we're in edit mode
  isSubmitting?: boolean;
  error?: string | null;
  success?: boolean;
}

const initialFormData: StudioRequest = {
  studioName: "",
  studioLogoUrl: "",
  studioDescription: "",
  studioWebsiteUrl: "",
  ratings: 3,
  status: "PENDING",
  country: "",
  city: "",
  description: "",
  employeesCount: 10,
  latitude: 0,
  longitude: 0,
};

export const StudioFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  studio,
  isSubmitting = false,
  error,
  success,
}: StudioFormModalProps) => {
  const [formData, setFormData] = useState<StudioRequest>(initialFormData);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const isEditMode = !!studio;

  // Populate form when editing
  useEffect(() => {
    if (studio) {
      setFormData({
        studioName: studio.studioName,
        studioLogoUrl: studio.studioLogoUrl || "",
        studioDescription: studio.studioDescription || "",
        studioWebsiteUrl: studio.studioWebsiteUrl || "",
        ratings: studio.ratings,
        country: studio.country,
        city: studio.city,
        description: studio.description || "",
        employeesCount: studio.employeesCount,
        latitude: studio.latitude,
        longitude: studio.longitude,
        status: studio.status,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [studio, isOpen]);

  // Close modal on success after delay
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  const handleLogoUpload = useCallback(async (file: File) => {
    return await mediaUploadService.uploadFile(file, false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setValidationErrors([]);

    // Validate using new validation utility
    const errors = validateStudioForm(formData);

    if (errors.length > 0) {
      setValidationErrors(errors);
      // Scroll to top to show errors
      setTimeout(() => {
        const form = document.querySelector("form");
        form?.scroll({ top: 0, behavior: "smooth" });
      }, 100);
      return;
    }

    await onSubmit(formData);
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete();
      setShowDeleteConfirm(false);
    }
  };

  const updateField = <K extends keyof StudioRequest>(
    field: K, 
    value: StudioRequest[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
          >
            <div className="bg-[#0a0a0a] border border-[#FFAB00]/30 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] pointer-events-auto relative">
              
              {/* Scanline effect */}
              <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3 text-[#FFAB00]">
                  <Building2 className="w-6 h-6" />
                  <h2 className="font-display text-xl uppercase tracking-widest">
                    {isEditMode ? "Edit Studio" : "Add New Studio"}
                  </h2>
                </div>
                <button 
                  onClick={onClose} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* Validation Errors Display */}
                <AnimatePresence>
                  {validationErrors.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <ValidationErrorDisplay errors={validationErrors} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Status Messages */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded text-green-400"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-mono text-sm">
                        Studio {isEditMode ? "updated" : "created"} successfully!
                      </span>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400"
                    >
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-mono text-sm">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Section 1: Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">
                    01 // Studio Identity
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Studio Name */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#FFAB00]" />
                        Studio Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.studioName}
                        onChange={(e) => updateField("studioName", e.target.value)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                        placeholder="Enter studio name"
                      />
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">
                        Studio Logo
                      </label>
                      <MediaUploader
                        accept="image"
                        value={formData.studioLogoUrl}
                        onUpload={handleLogoUpload}
                        onComplete={(url) => updateField("studioLogoUrl", url)}
                        onClear={() => updateField("studioLogoUrl", "")}
                        label="studio logo"
                      />
                    </div>

                    {/* Website */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#FFAB00]" />
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={formData.studioWebsiteUrl}
                        onChange={(e) => updateField("studioWebsiteUrl", e.target.value)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                        placeholder="https://example.com"
                      />
                    </div>

                    {/* Short Description */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">
                        Short Description
                      </label>
                      <input
                        type="text"
                        value={formData.studioDescription}
                        onChange={(e) => updateField("studioDescription", e.target.value)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                        placeholder="Brief tagline for the studio"
                        maxLength={255}
                      />
                    </div>

                    {/* Full Description */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">
                        Full Description
                      </label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono resize-none"
                        placeholder="Detailed description about the studio, their games, culture..."
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#FFAB00]" />
                        Status *
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => updateField("status", e.target.value as "PENDING" | "PUBLISHED" | "REJECTED")}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono appearance-none cursor-pointer"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: "right 0.5rem center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "1.5em 1.5em",
                            paddingRight: "2.5rem"
                        }}
                      >
                        <option value="PENDING" className="bg-[#1a1a1a] text-yellow-400">PENDING</option>
                        <option value="PUBLISHED" className="bg-[#1a1a1a] text-green-400">PUBLISHED</option>
                        <option value="REJECTED" className="bg-[#1a1a1a] text-red-400">REJECTED</option>
                      </select>
                      <p className="text-xs text-gray-500 font-mono">
                        * "Published" makes the studio visible to public users.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Location */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">
                    02 // Location Data
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#FFAB00]" />
                        Country *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => updateField("country", e.target.value)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                        placeholder="India"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                        placeholder="Bangalore"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">
                        Latitude *
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        required
                        value={formData.latitude}
                        onChange={(e) => updateField("latitude", parseFloat(e.target.value) || 0)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                        placeholder="12.9716"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">
                        Longitude *
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        required
                        value={formData.longitude}
                        onChange={(e) => updateField("longitude", parseFloat(e.target.value) || 0)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                        placeholder="77.5946"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Stats */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">
                    03 // Studio Stats
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#FFAB00]" />
                        Employee Count *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={formData.employeesCount || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            updateField("employeesCount", 1);
                          } else {
                            const parsed = parseInt(value, 10);
                            if (!isNaN(parsed) && parsed >= 1) {
                              updateField("employeesCount", parsed);
                            }
                          }
                        }}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                        placeholder="50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <Star className="w-4 h-4 text-[#FFAB00]" />
                        Rating (1-5) *
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={formData.ratings}
                          onChange={(e) => updateField("ratings", parseInt(e.target.value))}
                          className="flex-1 accent-[#FFAB00]"
                        />
                        <div className="flex items-center gap-1 min-w-[60px]">
                          {[...Array(formData.ratings)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-[#FFAB00] fill-[#FFAB00]" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="px-6 py-3 border border-white/20 text-gray-400 font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    
                    {isEditMode && onDelete && (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={isSubmitting}
                        className="px-6 py-3 border border-red-500/30 text-red-400 font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.studioName || !formData.country || !formData.city}
                    className="px-8 py-3 bg-[#FFAB00] text-black font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {isEditMode ? "Update" : "Create"} Studio
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Delete Confirmation Dialog */}
              <AnimatePresence>
                {showDeleteConfirm && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/90 flex items-center justify-center p-8"
                  >
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.9 }}
                      className="bg-[#1a1a1a] border border-red-500/30 p-6 rounded-lg max-w-md text-center"
                    >
                      <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <h3 className="font-display text-xl text-white mb-2">
                        Delete Studio?
                      </h3>
                      <p className="text-gray-400 text-sm mb-6">
                        This action cannot be undone. The studio "{formData.studioName}" will be permanently removed.
                      </p>
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-6 py-2 border border-white/20 text-gray-400 font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDelete}
                          disabled={isSubmitting}
                          className="px-6 py-2 bg-red-500 text-white font-bold uppercase tracking-widest hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StudioFormModal;
