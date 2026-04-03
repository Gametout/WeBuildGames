import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface InfiniteScrollTriggerProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => Promise<void> | void;
  rootMargin?: string;
}

/**
 * Invisible sentinel observed near viewport bottom to trigger incremental loading.
 */
export const InfiniteScrollTrigger = ({
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = "100px",
}: InfiniteScrollTriggerProps) => {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const inFlightRef = useRef(false);

  useEffect(() => {
    const node = triggerRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        if (inFlightRef.current || isLoading || !hasMore) return;

        inFlightRef.current = true;
        Promise.resolve(onLoadMore()).finally(() => {
          inFlightRef.current = false;
        });
      },
      {
        root: null,
        rootMargin,
        threshold: 0,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore, rootMargin]);

  return (
    <div className="w-full py-6" aria-hidden="true">
      <div ref={triggerRef} className="h-px w-full opacity-0 pointer-events-none" />

      {isLoading && hasMore && (
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-wider">
          <Loader2 className="w-4 h-4 text-[#FFAB00] animate-spin" />
          Loading more operatives
        </div>
      )}
    </div>
  );
};

export default InfiniteScrollTrigger;
