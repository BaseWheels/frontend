"use client";

import { useState, useCallback, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";

/**
 * Custom hook for fetching and managing MockIDRX balance
 * @returns {Object} Balance state and refetch function
 */
export function useMockIDRXBalance() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const { getAccessToken, authenticated } = usePrivy();

  const fetchBalance = useCallback(async () => {
    if (!authenticated) {
      setBalance(0);
      return;
    }

    try {
      setLoading(true);
      const authToken = await getAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/garage/overview`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      setBalance(data.user?.mockIDRX || 0);
    } catch (error) {
      console.error("Failed to fetch MockIDRX balance:", error);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  }, [authenticated, getAccessToken]);

  useEffect(() => {
    if (authenticated) {
      fetchBalance();
    }
  }, [authenticated, fetchBalance]);

  return { balance, loading, refetch: fetchBalance };
}
