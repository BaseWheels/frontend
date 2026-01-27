"use client";

import { formatAddress } from "@/utils";

/**
 * Reusable user info display badge
 * @param {Object} props
 * @param {Object} props.userInfo - User information
 * @param {string} props.walletAddress - Wallet address
 * @param {Function} props.onClick - Click handler
 */
export function UserInfoBadge({ userInfo, walletAddress, onClick }) {
  const displayName = userInfo?.username || userInfo?.email || formatAddress(walletAddress);

  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:bg-white/20 transition-all"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
        <span className="text-white font-bold text-sm">
          {displayName?.[0]?.toUpperCase() || "?"}
        </span>
      </div>
      <span className="text-white font-medium">{displayName}</span>
    </button>
  );
}
