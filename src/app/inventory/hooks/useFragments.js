"use client";

import { useState, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";

/**
 * Custom hook for managing fragments state and fetching
 */
export function useFragments() {
  const [fragmentsData, setFragmentsData] = useState([]);
  const [loadingFragments, setLoadingFragments] = useState(true);
  const { getAccessToken } = usePrivy();

  const fetchFragments = useCallback(async () => {
    try {
      setLoadingFragments(true);
      const authToken = await getAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/garage/fragments`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch fragments");
      }

      const data = await response.json();
      setFragmentsData(data.fragments || []);
    } catch (error) {
      console.error("Failed to fetch fragments:", error);
      setFragmentsData([]);
    } finally {
      setLoadingFragments(false);
    }
  }, [getAccessToken]);

  return {
    fragmentsData,
    loadingFragments,
    fetchFragments,
  };
}
