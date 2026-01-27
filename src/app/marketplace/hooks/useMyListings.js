"use client";

import { useState, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";

export function useMyListings() {
  const [myListings, setMyListings] = useState({ active: [], sold: [], cancelled: [], all: [] });
  const [loadingMyListings, setLoadingMyListings] = useState(false);
  const [myListingsFilter, setMyListingsFilter] = useState("all");
  const { getAccessToken } = usePrivy();

  const fetchMyListings = useCallback(async () => {
    try {
      setLoadingMyListings(true);
      const authToken = await getAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/marketplace/my-listings`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch my listings");
      }

      const data = await response.json();
      setMyListings({
        active: data.listings?.filter((l) => l.status === "active") || [],
        sold: data.listings?.filter((l) => l.status === "sold") || [],
        cancelled: data.listings?.filter((l) => l.status === "cancelled") || [],
        all: data.listings || [],
      });
    } catch (error) {
      console.error("Failed to fetch my listings:", error);
      setMyListings({ active: [], sold: [], cancelled: [], all: [] });
    } finally {
      setLoadingMyListings(false);
    }
  }, [getAccessToken]);

  const displayedListings =
    myListingsFilter === "all" ? myListings.all : myListings[myListingsFilter] || [];

  return {
    myListings: displayedListings,
    loadingMyListings,
    myListingsFilter,
    setMyListingsFilter,
    fetchMyListings,
  };
}
