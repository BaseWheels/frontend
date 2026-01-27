/**
 * UI Constants
 * Rarity configurations, fragment types, filters, and UI-related constants
 */

import { Car, CircleDot, Settings, Paintbrush, Armchair, Wrench } from "lucide-react";

// Rarity Configuration - complete styling for all UI components
export const RARITY_CONFIG = {
  common: {
    gradient: "from-gray-600 to-gray-700",
    bgGradient: "from-gray-600 to-gray-700",
    textColor: "text-gray-400",
    borderColor: "border-gray-500",
    badgeBg: "bg-gray-600",
    label: "COMMON",
    icon: "📦",
  },
  rare: {
    gradient: "from-blue-600 to-indigo-700",
    bgGradient: "from-blue-600 to-indigo-700",
    textColor: "text-blue-400",
    borderColor: "border-blue-500",
    badgeBg: "bg-blue-600",
    label: "RARE",
    icon: "🔷",
  },
  epic: {
    gradient: "from-purple-600 to-violet-700",
    bgGradient: "from-purple-600 to-violet-700",
    textColor: "text-purple-400",
    borderColor: "border-purple-500",
    badgeBg: "bg-purple-600",
    label: "EPIC",
    icon: "💎",
  },
  legendary: {
    gradient: "from-yellow-500 to-amber-600",
    bgGradient: "from-yellow-500 to-amber-600",
    textColor: "text-yellow-400",
    borderColor: "border-yellow-400",
    badgeBg: "bg-yellow-500",
    label: "LEGENDARY",
    icon: "⭐",
  },
};

// Fragment Type IDs (matches smart contract)
export const FRAGMENT_TYPES = {
  CHASSIS: 0,
  WHEELS: 1,
  ENGINE: 2,
  BODY: 3,
  INTERIOR: 4,
};

// Fragment Icons with Lucide components - indexed by typeId
export const FRAGMENT_ICONS = {
  [FRAGMENT_TYPES.CHASSIS]: { Icon: CircleDot, label: "Chassis" },
  [FRAGMENT_TYPES.WHEELS]: { Icon: Settings, label: "Wheels" },
  [FRAGMENT_TYPES.ENGINE]: { Icon: Wrench, label: "Engine" },
  [FRAGMENT_TYPES.BODY]: { Icon: Paintbrush, label: "Body" },
  [FRAGMENT_TYPES.INTERIOR]: { Icon: Armchair, label: "Interior" },
};

// Inventory filter options
export const INVENTORY_FILTERS = ["All", "Common", "Rare", "Epic", "Legendary"];

// Cooldown period in seconds (24 hours)
export const COOLDOWN_PERIOD = 86400;
