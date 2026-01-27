"use client";

import { useState, useCallback, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";

/**
 * Custom hook for fetching and managing user info
 * @returns {Object} User info state and refetch function
 */
export function useUserInfo() {
  const [userInfo, setUserInfo] = useState({
    username: null,
    email: null,
    usernameSet: false,
  });
  const [loading, setLoading] = useState(false);
  const { getAccessToken, authenticated } = usePrivy();

  const fetchUserInfo = useCallback(async () => {
    if (!authenticated) {
      setUserInfo({
        username: null,
        email: null,
        usernameSet: false,
      });
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
      setUserInfo({
        username: data.user?.username || null,
        email: data.user?.email || null,
        usernameSet: data.user?.usernameSet || false,
      });
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      setUserInfo({
        username: null,
        email: null,
        usernameSet: false,
      });
    } finally {
      setLoading(false);
    }
  }, [authenticated, getAccessToken]);

  useEffect(() => {
    if (authenticated) {
      fetchUserInfo();
    }
  }, [authenticated, fetchUserInfo]);

  return { userInfo, loading, refetch: fetchUserInfo };
}
