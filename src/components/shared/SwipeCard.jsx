"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Eye, MoreVertical, X } from "lucide-react";

/**
 * SwipeCard Component - Click-based action menu
 * Click 3 dots to show/hide action buttons
 */

export default function SwipeCard({
  children,
  onView,
  onShare,
  className = ""
}) {
  const [showActions, setShowActions] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showActions]);

  const handleAction = (action) => {
    if (action) {
      action();
    }
    setShowActions(false);
  };

  const toggleActions = (e) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  // If no actions provided, render children directly
  if (!onView && !onShare) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Card content */}
      {children}

      {/* 3 Dots Menu Button - Top Right Corner */}
      <div className="absolute top-2 right-2 z-20" ref={menuRef}>
        <button
          onClick={toggleActions}
          className="bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white p-1.5 rounded-full shadow-lg active:scale-95 transition-all"
          aria-label="More actions"
        >
          {showActions ? <X size={14} /> : <MoreVertical size={14} />}
        </button>

        {/* Action Menu Dropdown */}
        {showActions && (
          <div className="absolute top-full right-0 mt-1 bg-gray-900/95 backdrop-blur-md rounded-lg shadow-2xl border border-white/10 overflow-hidden animate-scale-in min-w-[140px] z-30">
            {onView && (
              <button
                onClick={() => handleAction(onView)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-white hover:bg-blue-500/20 active:bg-blue-500/30 transition-colors text-sm"
              >
                <Eye size={16} className="text-blue-400" />
                <span>View Details</span>
              </button>
            )}
            {onShare && (
              <button
                onClick={() => handleAction(onShare)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-white hover:bg-green-500/20 active:bg-green-500/30 transition-colors text-sm"
              >
                <Share2 size={16} className="text-green-400" />
                <span>Share</span>
              </button>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.15s ease-out;
        }
      `}</style>
    </div>
  );
}
