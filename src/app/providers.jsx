"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { base, baseSepolia, mainnet } from "viem/chains";
import { Toaster } from "sonner";
import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/queryClient";
import ErrorBoundary from "@/components/ErrorBoundary";
import GlobalLoadingIndicator from "@/components/shared/GlobalLoadingIndicator";

// Suppress React warning for isActive prop from Privy's styled-components
// This is a known issue in @privy-io/react-auth library
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes?.("isActive")) return;
    originalError.apply(console, args);
  };
}

export default function Providers({ children }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmjxyscmx03pulf0cadbpdmvq";

  // Initialize MiniApp SDK
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GlobalLoadingIndicator />
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: {
              background: "linear-gradient(to bottom, #1f1f1f, #0a0a0a)",
              border: "1px solid #f97316",
              color: "#fff",
            },
          }}
        />
        <PrivyProvider
          appId={appId}
          config={{
            loginMethods: ["email", "wallet", "google", "twitter", "discord"],
            appearance: {
              theme: "light",
              accentColor: "#ff7a59",
            },
            embeddedWallets: {
              createOnLogin: "all-users", // Auto-create wallet for all users
              requireUserPasswordOnCreate: false, // No password needed
              noPromptOnSignature: true, // No popup for signing (smooth UX)
            },
            defaultChain: baseSepolia, // Base Sepolia testnet
            supportedChains: [base, baseSepolia, mainnet], // Support Base mainnet, testnet, and Ethereum
          }}
        >
          {children}
        </PrivyProvider>

        {/* React Query Devtools - only in development */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
