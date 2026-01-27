"use client";

import { useState, useCallback, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import { claimFaucet, checkFaucetCooldown } from "@/lib/mockidrx";

export function useFaucet() {
  const [claiming, setClaiming] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const { embeddedWallet, walletAddress } = useWallet();

  const checkCooldown = useCallback(async () => {
    if (!embeddedWallet || !walletAddress) {
      setCooldown(0);
      setCanClaim(false);
      return;
    }

    try {
      const secondsRemaining = await checkFaucetCooldown(embeddedWallet, walletAddress);
      setCooldown(secondsRemaining);
      setCanClaim(secondsRemaining === 0);
    } catch (error) {
      console.error("Failed to check cooldown:", error);
      setCooldown(0);
      setCanClaim(true);
    }
  }, [embeddedWallet, walletAddress]);

  const handleClaim = useCallback(async () => {
    if (!embeddedWallet || claiming || !canClaim) {
      return { success: false, error: "Cannot claim at this time" };
    }

    try {
      setClaiming(true);
      const result = await claimFaucet(embeddedWallet);

      if (result.success) {
        await checkCooldown();
      }

      return result;
    } catch (error) {
      console.error("Claim error:", error);
      return { success: false, error: error.message };
    } finally {
      setClaiming(false);
    }
  }, [embeddedWallet, claiming, canClaim, checkCooldown]);

  useEffect(() => {
    if (embeddedWallet && walletAddress) {
      checkCooldown();
      const interval = setInterval(checkCooldown, 60000);
      return () => clearInterval(interval);
    }
  }, [embeddedWallet, walletAddress, checkCooldown]);

  return {
    claiming,
    cooldown,
    canClaim,
    handleClaim,
    checkCooldown,
  };
}
