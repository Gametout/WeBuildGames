import React from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export interface ValidationError {
  field: string;
  message: string;
}

interface ValidationErrorDisplayProps {
  errors: ValidationError[];
}

export const ValidationErrorDisplay = ({
  errors,
}: ValidationErrorDisplayProps): React.ReactNode | null => {
  if (errors.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-2"
    >
      {errors.map((error, index) => (
        <motion.div
          key={error.field}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-400 uppercase">
              {error.field}
            </p>
            <p className="text-sm text-red-300 mt-0.5">{error.message}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

/**
 * Animation variants for field error shake/glow effects
 */
export const fieldErrorVariants = {
  idle: {
    boxShadow: "0 0 0 0px rgba(255, 171, 0, 0)",
    scale: 1,
  },
  error: {
    boxShadow: [
      "0 0 0 0px rgba(239, 68, 68, 0.5)",
      "0 0 0 8px rgba(239, 68, 68, 0.2)",
      "0 0 0 0px rgba(239, 68, 68, 0)",
    ],
    scale: [1, 0.99, 1],
    transition: {
      duration: 0.6,
      times: [0, 0.5, 1],
      boxShadow: {
        duration: 0.6,
      },
    },
  },
};

/**
 * Validation helper functions
 */
export const validatePortfolioForm = (formData: {
  name?: string;
  shortDescription?: string;
  location?: string;
  contactEmail?: string;
  role?: string;
  jobStatus?: string;
  experienceYears: number;
  profilePhotoUrl?: string;
  skills: { name: string; score: number }[];
  socials: { platform: string; url: string }[];
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!formData.name?.trim()) {
    errors.push({ field: "Name", message: "Please enter your name" });
  }

  if (!formData.shortDescription?.trim()) {
    errors.push({
      field: "Tagline",
      message: "Please enter a short description/tagline",
    });
  }

  if (!formData.location?.trim()) {
    errors.push({ field: "Location", message: "Please enter your location" });
  }

  if (!formData.contactEmail?.trim()) {
    errors.push({
      field: "Contact Email",
      message: "Please enter your contact email",
    });
  }

  if (!formData.role?.trim()) {
    errors.push({
      field: "Role/Category",
      message: "Please select your role/category",
    });
  }

  if (!formData.jobStatus?.trim()) {
    errors.push({
      field: "Job Status",
      message: "Please select your availability status",
    });
  }

  if (formData.experienceYears < 0) {
    errors.push({
      field: "Experience",
      message: "Please enter valid years of experience",
    });
  }

  if (!formData.profilePhotoUrl?.trim()) {
    errors.push({
      field: "Profile Photo",
      message: "Please upload a profile photo",
    });
  }

  const validSkills = formData.skills.filter(
    (s) => s.name && s.name.trim() !== ""
  );
  if (validSkills.length === 0) {
    errors.push({
      field: "Skills",
      message: "Please add at least one skill",
    });
  }

  const validSocials = formData.socials.filter(
    (s) => s.platform?.trim() && s.url?.trim()
  );
  if (validSocials.length === 0) {
    errors.push({
      field: "Social Handles",
      message: "Please add at least one social handle",
    });
  }

  return errors;
};

export const validateStudioForm = (formData: {
  studioName?: string;
  studioDescription?: string;
  studioWebsiteUrl?: string;
  country?: string;
  city?: string;
  description?: string;
  employeesCount?: number;
  studioLogoUrl?: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!formData.studioName?.trim()) {
    errors.push({ field: "Studio Name", message: "Studio name is required" });
  }

  if (!formData.studioDescription?.trim()) {
    errors.push({
      field: "Studio Tagline",
      message: "Studio tagline is required",
    });
  }

  if (!formData.studioWebsiteUrl?.trim()) {
    errors.push({
      field: "Website URL",
      message: "Website URL is required",
    });
  }

  if (!formData.country?.trim()) {
    errors.push({ field: "Country", message: "Country is required" });
  }

  if (!formData.city?.trim()) {
    errors.push({ field: "City", message: "City is required" });
  }

  if (!formData.description?.trim()) {
    errors.push({
      field: "Description",
      message: "Studio description is required",
    });
  }

  if (!formData.employeesCount || formData.employeesCount < 1) {
    errors.push({
      field: "Employee Count",
      message: "Please enter a valid employee count",
    });
  }

  if (!formData.studioLogoUrl?.trim()) {
    errors.push({ field: "Studio Logo", message: "Studio logo is required" });
  }

  return errors;
};
