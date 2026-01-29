"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function GlobalLoadingIndicator() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    // Listen for route changes
    window.addEventListener("beforeunload", handleStart);

    return () => {
      window.removeEventListener("beforeunload", handleStart);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999]">
      {/* Progress bar */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 animate-shimmer-loading">
        <div className="h-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse" />
      </div>

      <style jsx>{`
        @keyframes shimmer-loading {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .animate-shimmer-loading {
          background-size: 200% 100%;
          animation: shimmer-loading 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
