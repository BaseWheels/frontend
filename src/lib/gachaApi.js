/**
 * Gacha API Client
 * Handles gacha-related API calls to backend
 */

import { apiGet, apiPost } from "./api";
import { RARITY_CONFIG } from "@/constants";

/**
 * Get available gacha boxes and user MockIDRX balance
 * @param {string} authToken - Privy authentication token
 * @returns {Promise<{userMockIDRX: number, boxes: Array}>}
 */
export async function getGachaBoxes(authToken) {
  try {
    const data = await apiGet("/api/gacha/boxes", authToken);
    return data;
  } catch (error) {
    console.error("Failed to fetch gacha boxes:", error);
    throw error;
  }
}

/**
 * Open a gacha box and mint NFT
 * @param {string} boxType - Type of box: "standard" | "premium" | "legendary"
 * @param {string} paymentTxHash - Transaction hash of the payment transaction (transfer to treasury or burn)
 * @param {string} authToken - Privy authentication token
 * @returns {Promise<{success: boolean, reward: Object, mockIDRX: Object}>}
 */
export async function openGachaBox(boxType, paymentTxHash, authToken) {
  try {
    const data = await apiPost(
      "/api/gacha/open",
      { boxType, paymentTxHash },
      authToken
    );
    return data;
  } catch (error) {
    console.error("Failed to open gacha box:", error);
    throw error;
  }
}

export { RARITY_CONFIG };

/**
 * Get rarity display config
 */
export function getRarityConfig(rarity) {
  return RARITY_CONFIG[rarity] || RARITY_CONFIG.common;
}
