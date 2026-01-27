/**
 * Marketplace Blockchain Interactions
 * Token approval and marketplace contract interactions
 */

import { BrowserProvider, Contract, parseUnits, formatUnits } from "ethers";
import { MOCKIDRX_ADDRESS } from "@/constants";

const MARKETPLACE_ADDRESS = "0x2d13D164d6aBaEa446684c5d0173620886CE26c8";

const MOCKIDRX_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
];

/**
 * Approve marketplace contract to spend MockIDRX tokens
 * @param {Object} embeddedWallet - Privy embedded wallet
 * @param {number} amount - Amount to approve in IDRX
 * @returns {Promise<{success: boolean, txHash?: string, error?: string}>}
 */
export async function approveMarketplace(embeddedWallet, amount) {
  try {
    if (!embeddedWallet) {
      throw new Error("Wallet not connected");
    }

    const ethereumProvider = await embeddedWallet.getEthereumProvider();
    const provider = new BrowserProvider(ethereumProvider);
    const signer = await provider.getSigner();

    const tokenContract = new Contract(MOCKIDRX_ADDRESS, MOCKIDRX_ABI, signer);
    const decimals = await tokenContract.decimals();
    const amountInWei = parseUnits(amount.toString(), decimals);

    const tx = await tokenContract.approve(MARKETPLACE_ADDRESS, amountInWei);
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.hash,
    };
  } catch (error) {
    console.error("Approve marketplace error:", error);
    return {
      success: false,
      error: error.message || "Failed to approve marketplace",
    };
  }
}

/**
 * Check marketplace allowance
 * @param {Object} embeddedWallet - Privy embedded wallet
 * @param {string} ownerAddress - Token owner address
 * @returns {Promise<number>} Allowance in IDRX
 */
export async function checkMarketplaceAllowance(embeddedWallet, ownerAddress) {
  try {
    if (!embeddedWallet || !ownerAddress) {
      return 0;
    }

    const ethereumProvider = await embeddedWallet.getEthereumProvider();
    const provider = new BrowserProvider(ethereumProvider);

    const tokenContract = new Contract(MOCKIDRX_ADDRESS, MOCKIDRX_ABI, provider);
    const allowance = await tokenContract.allowance(ownerAddress, MARKETPLACE_ADDRESS);
    const decimals = await tokenContract.decimals();

    return parseFloat(formatUnits(allowance, decimals));
  } catch (error) {
    console.error("Check allowance error:", error);
    return 0;
  }
}
