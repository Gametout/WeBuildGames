import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Building2, MapPin, Globe, Users, Star,
  Send, Loader2, AlertCircle, CheckCircle, Clock, ChevronDown,
  Briefcase, Mail, Phone, Youtube, Linkedin, Twitter, MessageCircle
} from "lucide-react";
import { StudioRequest, StudioCategory, HiringStatus } from "@/types/studio";
import { MediaUploader } from "@/components/MediaUploader";
import { mediaUploadService } from "@/services/mediaUploadService";
import { CustomDropdown } from "@/components/CustomDropdown";

interface UserStudioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudioRequest) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
  success?: boolean;
}

// ============================================
// LOCATION DATA - Indian States
// ============================================
const INDIAN_STATES: Record<string, { lat: number; lng: number }> = {
  "Andhra Pradesh": { lat: 15.9129, lng: 79.7400 },
  "Arunachal Pradesh": { lat: 28.2180, lng: 94.7278 },
  "Assam": { lat: 26.2006, lng: 92.9376 },
  "Bihar": { lat: 25.0961, lng: 85.3131 },
  "Chhattisgarh": { lat: 21.2787, lng: 81.8661 },
  "Goa": { lat: 15.2993, lng: 74.1240 },
  "Gujarat": { lat: 22.2587, lng: 71.1924 },
  "Haryana": { lat: 29.0588, lng: 76.0856 },
  "Himachal Pradesh": { lat: 31.1048, lng: 77.1734 },
  "Jharkhand": { lat: 23.6102, lng: 85.2799 },
  "Karnataka": { lat: 15.3173, lng: 75.7139 },
  "Kerala": { lat: 10.8505, lng: 76.2711 },
  "Madhya Pradesh": { lat: 22.9734, lng: 78.6569 },
  "Maharashtra": { lat: 19.7515, lng: 75.7139 },
  "Manipur": { lat: 24.6637, lng: 93.9063 },
  "Meghalaya": { lat: 25.4670, lng: 91.3662 },
  "Mizoram": { lat: 23.1645, lng: 92.9376 },
  "Nagaland": { lat: 26.1584, lng: 94.5624 },
  "Odisha": { lat: 20.9517, lng: 85.0985 },
  "Punjab": { lat: 31.1471, lng: 75.3412 },
  "Rajasthan": { lat: 27.0238, lng: 74.2179 },
  "Sikkim": { lat: 27.5330, lng: 88.5122 },
  "Tamil Nadu": { lat: 11.1271, lng: 78.6569 },
  "Telangana": { lat: 18.1124, lng: 79.0193 },
  "Tripura": { lat: 23.9408, lng: 91.9882 },
  "Uttar Pradesh": { lat: 26.8467, lng: 80.9462 },
  "Uttarakhand": { lat: 30.0668, lng: 79.0193 },
  "West Bengal": { lat: 22.9868, lng: 87.8550 },
  // Union Territories
  "Andaman and Nicobar Islands": { lat: 11.7401, lng: 92.6586 },
  "Chandigarh": { lat: 30.7333, lng: 76.7794 },
  "Dadra and Nagar Haveli and Daman and Diu": { lat: 20.4283, lng: 72.8397 },
  "Delhi": { lat: 28.7041, lng: 77.1025 },
  "Jammu and Kashmir": { lat: 33.7782, lng: 76.5762 },
  "Ladakh": { lat: 34.1526, lng: 77.5771 },
  "Lakshadweep": { lat: 10.5667, lng: 72.6417 },
  "Puducherry": { lat: 11.9416, lng: 79.8083 },
};

// Major Indian cities (for more precise location if needed)
const INDIAN_CITIES: Record<string, { lat: number; lng: number; state: string }> = {
  "Mumbai": { lat: 19.0760, lng: 72.8777, state: "Maharashtra" },
  "Bangalore": { lat: 12.9716, lng: 77.5946, state: "Karnataka" },
  "Bengaluru": { lat: 12.9716, lng: 77.5946, state: "Karnataka" },
  "Delhi": { lat: 28.7041, lng: 77.1025, state: "Delhi" },
  "New Delhi": { lat: 28.6139, lng: 77.2090, state: "Delhi" },
  "Hyderabad": { lat: 17.3850, lng: 78.4867, state: "Telangana" },
  "Chennai": { lat: 13.0827, lng: 80.2707, state: "Tamil Nadu" },
  "Kolkata": { lat: 22.5726, lng: 88.3639, state: "West Bengal" },
  "Pune": { lat: 18.5204, lng: 73.8567, state: "Maharashtra" },
  "Ahmedabad": { lat: 23.0225, lng: 72.5714, state: "Gujarat" },
  "Jaipur": { lat: 26.9124, lng: 75.7873, state: "Rajasthan" },
  "Lucknow": { lat: 26.8467, lng: 80.9462, state: "Uttar Pradesh" },
  "Chandigarh": { lat: 30.7333, lng: 76.7794, state: "Chandigarh" },
  "Gurgaon": { lat: 28.4595, lng: 77.0266, state: "Haryana" },
  "Gurugram": { lat: 28.4595, lng: 77.0266, state: "Haryana" },
  "Noida": { lat: 28.5355, lng: 77.3910, state: "Uttar Pradesh" },
  "Kochi": { lat: 9.9312, lng: 76.2673, state: "Kerala" },
  "Thiruvananthapuram": { lat: 8.5241, lng: 76.9366, state: "Kerala" },
  "Indore": { lat: 22.7196, lng: 75.8577, state: "Madhya Pradesh" },
  "Bhopal": { lat: 23.2599, lng: 77.4126, state: "Madhya Pradesh" },
  "Coimbatore": { lat: 11.0168, lng: 76.9558, state: "Tamil Nadu" },
  "Nagpur": { lat: 21.1458, lng: 79.0882, state: "Maharashtra" },
  "Visakhapatnam": { lat: 17.6868, lng: 83.2185, state: "Andhra Pradesh" },
  "Surat": { lat: 21.1702, lng: 72.8311, state: "Gujarat" },
  "Vadodara": { lat: 22.3072, lng: 73.1812, state: "Gujarat" },
  "Goa": { lat: 15.2993, lng: 74.1240, state: "Goa" },
  "Panaji": { lat: 15.4909, lng: 73.8278, state: "Goa" },
  "Mysore": { lat: 12.2958, lng: 76.6394, state: "Karnataka" },
  "Mysuru": { lat: 12.2958, lng: 76.6394, state: "Karnataka" },
  "Mangalore": { lat: 12.9141, lng: 74.8560, state: "Karnataka" },
  "Patna": { lat: 25.5941, lng: 85.1376, state: "Bihar" },
  "Ranchi": { lat: 23.3441, lng: 85.3096, state: "Jharkhand" },
  "Bhubaneswar": { lat: 20.2961, lng: 85.8245, state: "Odisha" },
  "Guwahati": { lat: 26.1445, lng: 91.7362, state: "Assam" },
  "Dehradun": { lat: 30.3165, lng: 78.0322, state: "Uttarakhand" },
  "Shimla": { lat: 31.1048, lng: 77.1734, state: "Himachal Pradesh" },
  "Amritsar": { lat: 31.6340, lng: 74.8723, state: "Punjab" },
  "Ludhiana": { lat: 30.9010, lng: 75.8573, state: "Punjab" },
  "Jamshedpur": { lat: 22.8046, lng: 86.2029, state: "Jharkhand" },
  "Raipur": { lat: 21.2514, lng: 81.6296, state: "Chhattisgarh" },
};

// ============================================
// LOCATION DATA - Countries
// ============================================
const COUNTRIES: Record<string, { lat: number; lng: number }> = {
  "India": { lat: 20.5937, lng: 78.9629 },
  "United States": { lat: 37.0902, lng: -95.7129 },
  "USA": { lat: 37.0902, lng: -95.7129 },
  "United Kingdom": { lat: 55.3781, lng: -3.4360 },
  "UK": { lat: 55.3781, lng: -3.4360 },
  "Canada": { lat: 56.1304, lng: -106.3468 },
  "Australia": { lat: -25.2744, lng: 133.7751 },
  "Germany": { lat: 51.1657, lng: 10.4515 },
  "France": { lat: 46.2276, lng: 2.2137 },
  "Japan": { lat: 36.2048, lng: 138.2529 },
  "China": { lat: 35.8617, lng: 104.1954 },
  "South Korea": { lat: 35.9078, lng: 127.7669 },
  "Singapore": { lat: 1.3521, lng: 103.8198 },
  "Netherlands": { lat: 52.1326, lng: 5.2913 },
  "Sweden": { lat: 60.1282, lng: 18.6435 },
  "Poland": { lat: 51.9194, lng: 19.1451 },
  "Finland": { lat: 61.9241, lng: 25.7482 },
  "Spain": { lat: 40.4637, lng: -3.7492 },
  "Italy": { lat: 41.8719, lng: 12.5674 },
  "Brazil": { lat: -14.2350, lng: -51.9253 },
  "Mexico": { lat: 23.6345, lng: -102.5528 },
  "Russia": { lat: 61.5240, lng: 105.3188 },
  "Ukraine": { lat: 48.3794, lng: 31.1656 },
  "Romania": { lat: 45.9432, lng: 24.9668 },
  "Czech Republic": { lat: 49.8175, lng: 15.4730 },
  "Portugal": { lat: 39.3999, lng: -8.2245 },
  "Ireland": { lat: 53.1424, lng: -7.6921 },
  "Denmark": { lat: 56.2639, lng: 9.5018 },
  "Norway": { lat: 60.4720, lng: 8.4689 },
  "Belgium": { lat: 50.5039, lng: 4.4699 },
  "Austria": { lat: 47.5162, lng: 14.5501 },
  "Switzerland": { lat: 46.8182, lng: 8.2275 },
  "New Zealand": { lat: -40.9006, lng: 174.8860 },
  "South Africa": { lat: -30.5595, lng: 22.9375 },
  "UAE": { lat: 23.4241, lng: 53.8478 },
  "United Arab Emirates": { lat: 23.4241, lng: 53.8478 },
  "Saudi Arabia": { lat: 23.8859, lng: 45.0792 },
  "Indonesia": { lat: -0.7893, lng: 113.9213 },
  "Malaysia": { lat: 4.2105, lng: 101.9758 },
  "Thailand": { lat: 15.8700, lng: 100.9925 },
  "Vietnam": { lat: 14.0583, lng: 108.2772 },
  "Philippines": { lat: 12.8797, lng: 121.7740 },
  "Bangladesh": { lat: 23.6850, lng: 90.3563 },
  "Pakistan": { lat: 30.3753, lng: 69.3451 },
  "Sri Lanka": { lat: 7.8731, lng: 80.7718 },
  "Nepal": { lat: 28.3949, lng: 84.1240 },
  "Israel": { lat: 31.0461, lng: 34.8516 },
  "Turkey": { lat: 38.9637, lng: 35.2433 },
  "Argentina": { lat: -38.4161, lng: -63.6167 },
  "Chile": { lat: -35.6751, lng: -71.5430 },
  "Colombia": { lat: 4.5709, lng: -74.2973 },
  "Egypt": { lat: 26.8206, lng: 30.8025 },
  "Nigeria": { lat: 9.0820, lng: 8.6753 },
  "Kenya": { lat: -0.0236, lng: 37.9062 },
  "Ghana": { lat: 7.9465, lng: -1.0232 },
  "Morocco": { lat: 31.7917, lng: -7.0926 },
  "Taiwan": { lat: 23.6978, lng: 120.9605 },
  "Hong Kong": { lat: 22.3193, lng: 114.1694 },
};

// Get sorted lists for dropdowns
const INDIAN_STATE_LIST = Object.keys(INDIAN_STATES).sort();
const COUNTRY_LIST = Object.keys(COUNTRIES).sort();

// ============================================
// HELPER FUNCTION
// ============================================
const getCoordinates = (
  city: string,
  country: string
): { lat: number; lng: number } => {
  // Normalize inputs
  const normalizedCity = city.trim();
  const normalizedCountry = country.trim();

  // For India, check city first (major cities), then state
  if (normalizedCountry.toLowerCase() === "india") {
    // Check if it's a known city
    const cityMatch = Object.keys(INDIAN_CITIES).find(
      (c) => c.toLowerCase() === normalizedCity.toLowerCase()
    );
    if (cityMatch) {
      return {
        lat: INDIAN_CITIES[cityMatch].lat,
        lng: INDIAN_CITIES[cityMatch].lng,
      };
    }

    // Check if it's a state
    const stateMatch = Object.keys(INDIAN_STATES).find(
      (s) => s.toLowerCase() === normalizedCity.toLowerCase()
    );
    if (stateMatch) {
      return INDIAN_STATES[stateMatch];
    }

    // Fallback to India's center
    return COUNTRIES["India"];
  }

  // For other countries, use country coordinates
  const countryMatch = Object.keys(COUNTRIES).find(
    (c) => c.toLowerCase() === normalizedCountry.toLowerCase()
  );
  if (countryMatch) {
    return COUNTRIES[countryMatch];
  }

  // Default fallback (center of the world)
  return { lat: 0, lng: 0 };
};

// ============================================
// INITIAL FORM DATA
// ============================================
const initialFormData: StudioRequest = {
  studioName: "",
  studioLogoUrl: "",
  studioDescription: "",
  studioWebsiteUrl: "",
  ratings: 3,
  status: "PENDING",
  country: "India",
  city: "",
  description: "",
  employeesCount: 10,
  latitude: 20.5937,
  longitude: 78.9629,
  category: undefined,
  hiringStatus: "NOT_HIRING",
  studioEmail: "",
  studioMobile: "",
  youtubeUrl: "",
  linkedinUrl: "",
  twitterUrl: "",
  discordUrl: "",
};

// ============================================
// MAIN COMPONENT
// ============================================
export const UserStudioFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  error,
  success,
}: UserStudioFormModalProps) => {
  const [formData, setFormData] = useState<StudioRequest>(initialFormData);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
    }
  }, [isOpen]);

  // Close modal on success after delay
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  // Auto-update lat/lng when city or country changes
  useEffect(() => {
    if (formData.city || formData.country) {
      const coords = getCoordinates(formData.city, formData.country);
      setFormData((prev) => ({
        ...prev,
        latitude: coords.lat,
        longitude: coords.lng,
      }));
    }
  }, [formData.city, formData.country]);

  const handleLogoUpload = useCallback(async (file: File) => {
    return await mediaUploadService.uploadFile(file, false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ ...formData, status: "PENDING" });
  };

  const updateField = <K extends keyof StudioRequest>(
    field: K,
    value: StudioRequest[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const countryOptions = COUNTRY_LIST.map((country) => ({
    value: country,
    label: country,
  }));

  const stateOptions = INDIAN_STATE_LIST.map((state) => ({
    value: state,
    label: state,
  }));

  const isIndia = formData.country.toLowerCase() === "india";

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
            <div className="bg-[#0a0a0a] border border-primary/30 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] pointer-events-auto relative">
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-yellow-500/20 to-primary/20 opacity-50 blur-xl -z-10 animate-pulse" />

              {/* Scanline effect */}
              <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-gradient-to-r from-primary/10 to-transparent">
                <div className="flex items-center gap-3 text-primary">
                  <div className="relative">
                    <Building2 className="w-7 h-7" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
                    />
                  </div>
                  <div>
                    <h2 className="font-display text-xl uppercase tracking-widest">
                      Submit Your Studio
                    </h2>
                    <p className="text-xs text-gray-400 font-mono">
                      Request to be listed on GameTout
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Pending Notice */}
              <div className="mx-6 mt-6 flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-400 font-medium">
                    Submission Review Required
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Your studio will be reviewed by our team before being
                    published. This usually takes 1-2 business days.
                  </p>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Status Messages */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400"
                    >
                      <div className="relative">
                        <CheckCircle className="w-6 h-6" />
                        <motion.div
                          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                          transition={{ repeat: 3, duration: 0.5 }}
                          className="absolute inset-0 bg-green-400 rounded-full opacity-30"
                        />
                      </div>
                      <div>
                        <p className="font-medium">
                          Studio Submitted Successfully!
                        </p>
                        <p className="text-xs text-green-400/70 mt-0.5">
                          We'll review your submission and notify you once it's
                          approved.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400"
                    >
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-mono text-sm">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Section 1: Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                    <span className="text-primary">01</span>
                    <span>//</span>
                    Studio Identity
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Studio Name */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        Studio Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.studioName}
                        onChange={(e) =>
                          updateField("studioName", e.target.value)
                        }
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        placeholder="Enter your studio name"
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
                        <Globe className="w-4 h-4 text-primary" />
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={formData.studioWebsiteUrl}
                        onChange={(e) =>
                          updateField("studioWebsiteUrl", e.target.value)
                        }
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        placeholder="https://yourstudio.com"
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
                        onChange={(e) =>
                          updateField("studioDescription", e.target.value)
                        }
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        placeholder="Brief tagline for your studio"
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
                        onChange={(e) =>
                          updateField("description", e.target.value)
                        }
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono resize-none"
                        placeholder="Tell us about your studio, the games you've made, your team culture..."
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Location */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                    <span className="text-primary">02</span>
                    <span>//</span>
                    Location Data
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Country */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        Country *
                      </label>
                      <CustomDropdown
                        value={formData.country}
                        onChange={(value) => {
                          updateField("country", value);
                          // Clear city when country changes
                          if (value.toLowerCase() !== "india") {
                            updateField("city", "");
                          }
                        }}
                        placeholder="Select Country"
                        options={countryOptions}
                        searchable
                        dropdownClassName="max-h-72"
                      />
                    </div>

                    {/* City/State */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {isIndia ? "State *" : "City"}
                      </label>
                      {isIndia ? (
                        <CustomDropdown
                          value={formData.city}
                          onChange={(value) => updateField("city", value)}
                          placeholder="Select State"
                          options={stateOptions}
                          searchable
                          dropdownClassName="max-h-72"
                        />
                      ) : (
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                          placeholder="City name"
                        />
                      )}
                    </div>

                    {/* Auto-filled Coordinates Info */}
                    <div className="md:col-span-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span>Coordinates (Auto-filled based on location)</span>
                      </div>
                      <div className="flex gap-6 font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Latitude:</span>
                          <span className="text-primary font-bold">
                            {formData.latitude.toFixed(4)}°
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Longitude:</span>
                          <span className="text-primary font-bold">
                            {formData.longitude.toFixed(4)}°
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Stats */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                    <span className="text-primary">03</span>
                    <span>//</span>
                    Studio Stats
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Employee Count *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          required
                          value={
                            formData.employeesCount === 1
                              ? ""
                              : formData.employeesCount
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              updateField("employeesCount", 1);
                            } else {
                              const numValue = parseInt(value);
                              if (!isNaN(numValue) && numValue >= 1) {
                                updateField("employeesCount", numValue);
                              }
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value === "") {
                              updateField("employeesCount", 1);
                            }
                          }}
                          className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="50"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col">
                          <button
                            type="button"
                            onClick={() =>
                              updateField(
                                "employeesCount",
                                Math.min(10000, formData.employeesCount + 1)
                              )
                            }
                            className="text-primary hover:text-white w-4 h-4 flex items-center justify-center"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateField(
                                "employeesCount",
                                Math.max(1, formData.employeesCount - 1)
                              )
                            }
                            className="text-primary hover:text-white w-4 h-4 flex items-center justify-center"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Self Rating - COMMENTED OUT, using default value of 3 */}
                    {/* <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary" />
                        Self Rating (1-5) *
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={formData.ratings}
                          onChange={(e) =>
                            updateField("ratings", parseInt(e.target.value))
                          }
                          className="flex-1 accent-primary h-2 rounded-lg"
                        />
                        <div className="flex items-center gap-1 min-w-[80px]">
                          {[...Array(formData.ratings)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              <Star className="w-4 h-4 text-primary fill-primary" />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div> */}

                    {/* Category */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        Studio Category
                      </label>
                      <CustomDropdown
                        value={formData.category || ""}
                        onChange={(value) => updateField("category", value as StudioCategory || undefined)}
                        placeholder="Select Category"
                        options={[
                          { value: "", label: "Select Category" },
                          { value: "PRODUCT_BASED", label: "Product/IP Based" },
                          { value: "SERVICE_BASED", label: "Service Based" },
                        ]}
                      />
                    </div>

                    {/* Hiring Status */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Hiring Status
                      </label>
                      <CustomDropdown
                        value={formData.hiringStatus || "NOT_HIRING"}
                        onChange={(value) => updateField("hiringStatus", value as HiringStatus)}
                        placeholder="Select Status"
                        options={[
                          { value: "NOT_HIRING", label: "Not Hiring" },
                          { value: "HIRING", label: "Hiring" },
                          { value: "OPEN_TO_HIRE", label: "Open to Hire" },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Contact & Social */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                    <span className="text-primary">04</span>
                    <span>//</span>
                    Contact & Social
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Studio Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Studio Email
                      </label>
                      <input
                        type="email"
                        value={formData.studioEmail || ""}
                        onChange={(e) => updateField("studioEmail", e.target.value)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        placeholder="contact@yourstudio.com"
                      />
                    </div>

                    {/* Studio Mobile */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        Studio Mobile
                      </label>
                      <input
                        type="tel"
                        value={formData.studioMobile || ""}
                        onChange={(e) => updateField("studioMobile", e.target.value)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    {/* YouTube */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <Youtube className="w-4 h-4 text-red-500" />
                        Steam/PlayStore Channel
                      </label>
                      <input
                        type="url"
                        value={formData.youtubeUrl || ""}
                        onChange={(e) => updateField("youtubeUrl", e.target.value)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        placeholder="https://steam.com/@yourstudio"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <Linkedin className="w-4 h-4 text-blue-500" />
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={formData.linkedinUrl || ""}
                        onChange={(e) => updateField("linkedinUrl", e.target.value)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        placeholder="https://linkedin.com/company/yourstudio"
                      />
                    </div>

                    {/* Twitter */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <Twitter className="w-4 h-4 text-sky-500" />
                        Itch.io
                      </label>
                      <input
                        type="url"
                        value={formData.twitterUrl || ""}
                        onChange={(e) => updateField("twitterUrl", e.target.value)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        placeholder="https://itch.io/yourstudio"
                      />
                    </div>

                    {/* Discord */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-indigo-500" />
                        Discord Server
                      </label>
                      <input
                        type="url"
                        value={formData.discordUrl || ""}
                        onChange={(e) => updateField("discordUrl", e.target.value)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        placeholder="https://discord.gg/yourstudio"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-6 py-3 border border-white/20 text-gray-400 font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 rounded-lg"
                  >
                    Cancel
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !formData.studioName ||
                      !formData.country ||
                      (isIndia && !formData.city)
                    }
                    className="px-8 py-3 bg-primary text-black font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 rounded-lg relative overflow-hidden group"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit for Review
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserStudioFormModal;