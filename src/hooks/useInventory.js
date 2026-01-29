"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import { toast } from "sonner";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Hook untuk fetch inventory cars dengan caching
 */
export function useInventory() {
  const { getAccessToken } = usePrivy();

  return useQuery({
    queryKey: ["inventory", "cars"],
    queryFn: async () => {
      const authToken = await getAccessToken();
      const response = await fetch(`${BACKEND_URL}/api/garage/cars`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) throw new Error("Failed to fetch inventory");

      const data = await response.json();

      // Transform data dengan metadata
      const transformedCarsPromises = data.cars.map(async (car) => {
        try {
          const metadataResponse = await fetch(`${BACKEND_URL}/metadata/cars/${car.tokenId}`);
          const metadata = await metadataResponse.json();

          // Import RARITY_CONFIG for rarityColor
          const RARITY_CONFIG = {
            common: { gradient: "from-gray-500 to-gray-600" },
            rare: { gradient: "from-blue-500 to-cyan-600" },
            epic: { gradient: "from-purple-500 to-pink-600" },
            legendary: { gradient: "from-yellow-500 to-orange-600" }
          };

          return {
            id: car.tokenId,
            tokenId: car.tokenId,
            name: car.modelName?.toUpperCase() || "UNKNOWN",
            modelName: car.modelName || "Unknown",
            series: car.series || "Unknown",
            rarity: car.rarity || "common",
            rarityColor: RARITY_CONFIG[car.rarity]?.gradient || "from-gray-500 to-gray-600",
            image: metadata.image || `/assets/car/${car.modelName}.png`,
            mintTxHash: car.mintTxHash,
            isRedeemed: car.isRedeemed,
          };
        } catch (error) {
          console.error(`Failed to fetch metadata for token ${car.tokenId}:`, error);

          const RARITY_CONFIG = {
            common: { gradient: "from-gray-500 to-gray-600" },
            rare: { gradient: "from-blue-500 to-cyan-600" },
            epic: { gradient: "from-purple-500 to-pink-600" },
            legendary: { gradient: "from-yellow-500 to-orange-600" }
          };

          return {
            id: car.tokenId,
            tokenId: car.tokenId,
            name: car.modelName?.toUpperCase() || "UNKNOWN",
            modelName: car.modelName || "Unknown",
            series: car.series || "Unknown",
            rarity: car.rarity || "common",
            rarityColor: RARITY_CONFIG[car.rarity]?.gradient || "from-gray-500 to-gray-600",
            image: `/assets/car/${car.modelName}.png`,
            mintTxHash: car.mintTxHash,
            isRedeemed: car.isRedeemed,
          };
        }
      });

      return Promise.all(transformedCarsPromises);
    },
    staleTime: 5 * 60 * 1000, // Cache selama 5 menit
    retry: 2,
  });
}

/**
 * Hook untuk fetch fragments
 */
export function useFragments() {
  const { getAccessToken } = usePrivy();

  return useQuery({
    queryKey: ["inventory", "fragments"],
    queryFn: async () => {
      const authToken = await getAccessToken();
      const response = await fetch(`${BACKEND_URL}/api/garage/fragments`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) throw new Error("Failed to fetch fragments");

      const data = await response.json();
      return data.inventory || [];
    },
    staleTime: 3 * 60 * 1000, // Cache selama 3 menit
  });
}

/**
 * Hook untuk fetch garage overview (balance, user info, etc)
 */
export function useGarageOverview() {
  const { getAccessToken } = usePrivy();

  return useQuery({
    queryKey: ["garage", "overview"],
    queryFn: async () => {
      const authToken = await getAccessToken();
      const response = await fetch(`${BACKEND_URL}/api/garage/overview`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) throw new Error("Failed to fetch overview");

      return response.json();
    },
    staleTime: 2 * 60 * 1000, // Cache selama 2 menit
  });
}

/**
 * Hook untuk sell car to admin
 */
export function useSellCar() {
  const queryClient = useQueryClient();
  const { getAccessToken } = usePrivy();

  return useMutation({
    mutationFn: async ({ tokenId }) => {
      const authToken = await getAccessToken();
      const response = await fetch(`${BACKEND_URL}/api/admin/buyback`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokenId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to sell car");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate queries untuk refresh data
      queryClient.invalidateQueries({ queryKey: ["inventory", "cars"] });
      queryClient.invalidateQueries({ queryKey: ["garage", "overview"] });

      toast.success(`Car sold for ${data.price?.toLocaleString()} IDRX!`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook untuk claim physical car
 */
export function useClaimPhysical() {
  const queryClient = useQueryClient();
  const { getAccessToken } = usePrivy();

  return useMutation({
    mutationFn: async ({ tokenId, shippingInfo }) => {
      const authToken = await getAccessToken();
      const response = await fetch(`${BACKEND_URL}/api/redeem/physical`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokenId, ...shippingInfo }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to claim physical car");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries untuk refresh data
      queryClient.invalidateQueries({ queryKey: ["inventory", "cars"] });

      toast.success("Physical car claimed successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
