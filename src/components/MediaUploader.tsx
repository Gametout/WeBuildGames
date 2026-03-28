import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, X, Image, Video, Loader2, AlertCircle, 
  CheckCircle, RefreshCw, Trash2, FileText 
} from "lucide-react";
import { MediaUploadResult } from "@/lib/adminApi";

// ============================================
// TYPES
// ============================================
interface MediaUploaderProps {
  accept: "image" | "video" | "both" | "pdf";
  value?: string; // existing mediaUrl (public URL)
  localPreview?: string; // blob URL for preview before upload completes
  onUpload: (file: File) => Promise<MediaUploadResult>;
  onComplete: (publicUrl: string) => void;
  // For crop-first workflows: onUpload can open cropper and complete later via parent state.
  deferredUpload?: boolean;
  onClear?: () => void;
  caption?: string;
  onCaptionChange?: (caption: string) => void;
  showCaptionInput?: boolean;
  className?: string;
  /** Optional label to display in the drop zone */
  label?: string;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

// ============================================
// ACCEPT TYPES
// ============================================
const acceptTypes = {
  image: "image/jpeg,image/png,image/gif,image/webp",
  video: "video/mp4,video/webm",
  both: "image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm",
  pdf: "application/pdf"
};

const maxSizes = {
  image: 10 * 1024 * 1024, // 10MB
  video: 50 * 1024 * 1024, // 50MB
  pdf: 5 * 1024 * 1024, // 5MB for PDFs
};

// ============================================
// MAIN COMPONENT
// ============================================
export const MediaUploader = ({
  accept,
  value,
  localPreview,
  onUpload,
  onComplete,
  deferredUpload = false,
  onClear,
  caption,
  onCaptionChange,
  showCaptionInput = false,
  className = "",
  label
}: MediaUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | "pdf" | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Determine what to display
  const displayUrl = localPreview || value || previewUrl;
  const hasMedia = !!displayUrl;

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const isPdf = file.type === "application/pdf";
    
    if (accept === "image" && !isImage) {
      setUploadState(prev => ({ ...prev, error: "Please select an image file" }));
      return;
    }
    if (accept === "video" && !isVideo) {
      setUploadState(prev => ({ ...prev, error: "Please select a video file" }));
      return;
    }
    if (accept === "both" && !isImage && !isVideo) {
      setUploadState(prev => ({ ...prev, error: "Please select an image or video file" }));
      return;
    }
    if (accept === "pdf" && !isPdf) {
      setUploadState(prev => ({ ...prev, error: "Please select a PDF file" }));
      return;
    }

    // Validate file size
    const maxSize = isPdf ? maxSizes.pdf : (isImage ? maxSizes.image : maxSizes.video);
    if (file.size > maxSize) {
      setUploadState(prev => ({ 
        ...prev, 
        error: `File too large. Max size: ${maxSize / (1024 * 1024)}MB` 
      }));
      return;
    }

    // Set media type for preview
    setMediaType(isPdf ? "pdf" : (isImage ? "image" : "video"));
    setFileName(file.name);

    // Create local preview
    const blobUrl = URL.createObjectURL(file);
    setPreviewUrl(blobUrl);
    
    // Start upload
    setUploadState({ isUploading: true, progress: 0, error: null });

    try {
      const result = await onUpload(file);

      if (result.publicUrl) {
        onComplete(result.publicUrl);
        setUploadState({ isUploading: false, progress: 100, error: null });
      } else if (deferredUpload) {
        // Crop-first flow: upload happens after user confirms crop.
        setUploadState({ isUploading: false, progress: 0, error: null });
      } else {
        throw new Error("No public URL returned");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : "Upload failed"
      });
      // Keep the preview for retry
    } finally {
      // Don't revoke blob URL immediately - keep for preview
    }
  }, [accept, onUpload, onComplete, deferredUpload]);

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  // Handle clear
  const handleClear = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setMediaType(null);
    setFileName(null);
    setUploadState({ isUploading: false, progress: 0, error: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClear?.();
  }, [previewUrl, onClear]);

  // Handle retry
  const handleRetry = useCallback(() => {
    if (fileInputRef.current?.files?.[0]) {
      handleFileSelect(fileInputRef.current.files[0]);
    }
  }, [handleFileSelect]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptTypes[accept]}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Upload Zone / Preview */}
      <AnimatePresence mode="wait">
        {!hasMedia ? (
          <DropZone
            key="dropzone"
            accept={accept}
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            label={label}
          />
        ) : (
          <MediaPreview
            key="preview"
            url={displayUrl!}
            mediaType={mediaType || (accept === "pdf" ? "pdf" : (displayUrl?.includes("video") ? "video" : "image"))}
            isUploading={uploadState.isUploading}
            progress={uploadState.progress}
            error={uploadState.error}
            onClear={handleClear}
            onRetry={handleRetry}
            onReplace={() => fileInputRef.current?.click()}
            fileName={fileName}
          />
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {uploadState.error && !hasMedia && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-red-400 text-xs"
          >
            <AlertCircle className="w-3 h-3" />
            <span>{uploadState.error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Caption input */}
      {showCaptionInput && hasMedia && (
        <motion.input
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          type="text"
          value={caption || ""}
          onChange={(e) => onCaptionChange?.(e.target.value)}
          placeholder="Add a caption (optional)..."
          className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-2 text-gray-400 text-sm italic placeholder:text-gray-600 outline-none focus:border-white/20 transition-all"
        />
      )}
    </div>
  );
};

// ============================================
// DROP ZONE
// ============================================
interface DropZoneProps {
  accept: "image" | "video" | "both" | "pdf";
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
  label?: string;
}

const DropZone = ({ accept, isDragging, onDragOver, onDragLeave, onDrop, onClick, label: customLabel }: DropZoneProps) => {
  const Icon = accept === "video" ? Video : accept === "pdf" ? FileText : Image;
  const defaultLabel = accept === "both" ? "image or video" : accept === "pdf" ? "PDF" : accept;
  const displayLabel = customLabel || defaultLabel;

  const getSizeHint = () => {
    switch (accept) {
      case "video": return "MP4, WebM up to 50MB";
      case "image": return "JPG, PNG, GIF, WebP up to 10MB";
      case "pdf": return "PDF up to 5MB";
      default: return "Images up to 10MB, Videos up to 50MB";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden ${
        isDragging 
          ? "border-[#FFAB00] bg-[#FFAB00]/10" 
          : "border-white/10 hover:border-white/30 bg-black/30"
      }`}
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,171,0,0.5) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}
      />

      <div className="relative flex flex-col items-center justify-center py-12 px-6">
        <motion.div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
            isDragging ? "bg-[#FFAB00]/20" : "bg-white/5"
          }`}
          animate={isDragging ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
        >
          <Icon className={`w-8 h-8 ${isDragging ? "text-[#FFAB00]" : "text-gray-500"}`} />
        </motion.div>

        <p className="text-sm text-white font-medium mb-1">
          {isDragging ? "Drop to upload" : `Click or drag to upload ${displayLabel}`}
        </p>
        <p className="text-xs text-gray-500">
          {getSizeHint()}
        </p>

        {/* Upload icon animation */}
        <motion.div
          className="absolute bottom-4 right-4"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Upload className="w-4 h-4 text-gray-600" />
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============================================
// MEDIA PREVIEW
// ============================================
interface MediaPreviewProps {
  url: string;
  mediaType: "image" | "video" | "pdf";
  isUploading: boolean;
  progress: number;
  error: string | null;
  onClear: () => void;
  onRetry: () => void;
  onReplace: () => void;
  fileName?: string | null;
}

const MediaPreview = ({ 
  url, 
  mediaType, 
  isUploading, 
  progress, 
  error, 
  onClear, 
  onRetry,
  onReplace,
  fileName
}: MediaPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // For PDFs, we don't need to wait for load
  const isPdf = mediaType === "pdf";
  const showLoading = isLoading && !isPdf;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative rounded-xl overflow-hidden border border-white/10 group"
    >
      {/* Media content */}
      <div className={`relative ${isPdf ? "py-8" : "aspect-video"} bg-black`}>
        {mediaType === "image" ? (
          <img
            src={url}
            alt="Preview"
            className="w-full h-full object-cover"
            onLoad={() => setIsLoading(false)}
          />
        ) : mediaType === "video" ? (
          <video
            src={url}
            className="w-full h-full object-cover"
            onLoadedData={() => setIsLoading(false)}
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          // PDF Preview
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FFAB00]/10 flex items-center justify-center mb-3">
              <FileText className="w-8 h-8 text-[#FFAB00]" />
            </div>
            <p className="text-white text-sm font-medium truncate max-w-[200px]">
              {fileName || "Resume.pdf"}
            </p>
            <p className="text-gray-500 text-xs mt-1">PDF Document</p>
          </div>
        )}

        {/* Loading state */}
        {showLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="w-8 h-8 text-[#FFAB00] animate-spin" />
          </div>
        )}

        {/* Gradient overlay */}
        {!isPdf && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
        )}

        {/* Upload progress overlay */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/70"
            >
              <Loader2 className="w-10 h-10 text-[#FFAB00] animate-spin mb-3" />
              <p className="text-white text-sm font-medium">Uploading...</p>
              
              {/* Progress bar */}
              <div className="w-48 h-1 bg-white/20 rounded-full mt-3 overflow-hidden">
                <motion.div
                  className="h-full bg-[#FFAB00]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error overlay */}
        <AnimatePresence>
          {error && !isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80"
            >
              <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
              <p className="text-red-400 text-sm font-medium mb-3">{error}</p>
              <motion.button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-4 h-4" />
                Retry Upload
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success indicator */}
        <AnimatePresence>
          {!isUploading && !error && progress === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full"
            >
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-400 font-medium">Uploaded</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            type="button"
            onClick={onReplace}
            className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Replace"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
          <motion.button
            type="button"
            onClick={onClear}
            className="p-2 bg-red-500/60 hover:bg-red-500/80 rounded-lg text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Type badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 rounded text-[10px] font-mono text-white/60 uppercase">
          {mediaType}
        </div>
      </div>
    </motion.div>
  );
};

export default MediaUploader;
