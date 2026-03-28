import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCw, Check, AlertCircle } from "lucide-react";
import Crop from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";

interface ImageCropperProps {
  isOpen: boolean;
  imageSrc: string;
  aspect: number; // 1 for 1:1 (profile), 16/9 for 16:9 (cover)
  cropShape: "rect" | "round";
  title: string;
  description: string;
  onCrop: (croppedImage: Blob) => void;
  onClose: () => void;
}

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob> => {
  const image = new Image();
  image.crossOrigin = "anonymous";

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Guard against zero/invalid dimensions from transient crop state.
      const cropX = Math.max(0, Math.floor(pixelCrop.x));
      const cropY = Math.max(0, Math.floor(pixelCrop.y));
      const cropWidth = Math.max(1, Math.floor(pixelCrop.width));
      const cropHeight = Math.max(1, Math.floor(pixelCrop.height));

      // Set canvas size to the cropped area.
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw the cropped image
      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      // Convert canvas to blob (with dataURL fallback for browsers where toBlob is flaky).
      canvas.toBlob(async (blob) => {
        if (blob) {
          console.log("✓ Canvas blob created successfully");
          resolve(blob);
          return;
        }

        console.warn("⚠ Canvas toBlob failed, using fallback");
        try {
          const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
          const fallbackBlob = await fetch(dataUrl).then((res) => res.blob());
          console.log("✓ Fallback blob created successfully");
          resolve(fallbackBlob);
        } catch (err) {
          console.error("✗ Both blob creation methods failed:", err);
          reject(new Error("Failed to create blob"));
        }
      }, "image/jpeg", 0.95);
    };

    image.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    // Set src AFTER handlers are attached to prevent race condition
    image.src = imageSrc;
  });
};

export const ImageCropper = ({
  isOpen,
  imageSrc,
  aspect,
  cropShape,
  title,
  description,
  onCrop,
  onClose,
}: ImageCropperProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageLoadError, setImageLoadError] = useState<string | null>(null);

  // Preload image before rendering Crop component
  useEffect(() => {
    if (!isOpen || !imageSrc) {
      setIsImageLoaded(false);
      setImageLoadError(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";

    const handleLoad = () => {
      console.log("✓ Image preloaded successfully");
      setIsImageLoaded(true);
      setImageLoadError(null);
    };

    const handleError = () => {
      console.error("✗ Image preload failed for:", imageSrc);
      setImageLoadError("Failed to load image. Please try again.");
      setIsImageLoaded(false);
    };

    // Attach handlers BEFORE setting src to prevent race condition
    img.onload = handleLoad;
    img.onerror = handleError;

    // Set src after handlers are attached
    img.src = imageSrc;

    // Cleanup - properly abort loading and detach handlers
    return () => {
      img.onload = null;
      img.onerror = null;
      img.src = "";
    };
  }, [isOpen, imageSrc]);

  const handleCropComplete = useCallback(
    (_: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCrop(croppedBlob);
      // Reset state after successful crop
      setTimeout(() => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setCroppedAreaPixels(null);
        setIsProcessing(false);
      }, 300);
    } catch (error) {
      console.error("Error cropping image:", error);
      setIsProcessing(false);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-[#0a0a0a] border border-[#FFAB00]/30 w-full max-w-2xl pointer-events-auto rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-widest">
                    {title}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">{description}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cropper Container */}
              <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center">
                {!isImageLoaded ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-3"
                  >
                    {imageLoadError ? (
                      <>
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                        <p className="text-sm text-red-400">{imageLoadError}</p>
                        <motion.button
                          type="button"
                          onClick={onClose}
                          className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20 font-semibold uppercase text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Close & Try Again
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 border-2 border-[#FFAB00]/30 border-t-[#FFAB00] rounded-full animate-spin mx-auto" />
                        <p className="text-sm text-gray-400">Loading image preview...</p>
                      </>
                    )}
                  </motion.div>
                ) : (
                  <Crop
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    cropShape={cropShape}
                    showGrid={true}
                    onCropChange={setCrop}
                    onCropComplete={handleCropComplete}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    rotation={rotation}
                  />
                )}
              </div>

              {/* Controls */}
              <div className="border-t border-white/10 p-6 space-y-4 bg-white/5">
                {/* Error Message */}
                {imageLoadError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{imageLoadError}</span>
                  </motion.div>
                )}

                {/* Zoom Control */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300 uppercase">
                    Zoom
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.1"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FFAB00]"
                    />
                    <span className="text-sm text-gray-400 min-w-[50px]">
                      {Math.round(zoom * 100)}%
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 justify-between pt-2">
                  <button
                    onClick={handleRotate}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span className="text-sm font-semibold uppercase">Rotate 90°</span>
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20 font-semibold uppercase text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={isProcessing || !isImageLoaded}
                      className="flex items-center gap-2 px-6 py-2 bg-[#FFAB00] hover:bg-white text-black rounded-lg transition-colors font-semibold uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Check className="w-4 h-4" />
                      {isProcessing ? "Processing..." : "Confirm"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
