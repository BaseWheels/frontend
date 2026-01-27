/**
 * NFT Blockchain Interactions
 * NFT approval and transfer operations
 */

import { BrowserProvider, Contract } from "ethers";

const NFT_CONTRACT_ADDRESS = "0x1ED1d8AC243f07164FBA9562d6b2e80483816c3C";

const NFT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];

/**
 * Approve marketplace to transfer NFT
 * @param {Object} embeddedWallet - Privy embedded wallet
 * @param {number} tokenId - NFT token ID
 * @param {string} spenderAddress - Address to approve (marketplace contract)
 * @returns {Promise<{success: boolean, txHash?: string, error?: string}>}
 */
export async function approveNFT(embeddedWallet, tokenId, spenderAddress) {
  try {
    if (!embeddedWallet) {
      throw new Error("Wallet not connected");
    }

    const ethereumProvider = await embeddedWallet.getEthereumProvider();
    const provider = new BrowserProvider(ethereumProvider);
    const signer = await provider.getSigner();

    const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
    const tx = await nftContract.approve(spenderAddress, tokenId);
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.hash,
    };
  } catch (error) {
    console.error("Approve NFT error:", error);
    return {
      success: false,
      error: error.message || "Failed to approve NFT",
    };
  }
}

/**
 * Check if NFT is approved for address
 * @param {Object} embeddedWallet - Privy embedded wallet
 * @param {number} tokenId - NFT token ID
 * @returns {Promise<string>} Approved address
 */
export async function getApprovedAddress(embeddedWallet, tokenId) {
  try {
    if (!embeddedWallet) {
      return null;
    }

    const ethereumProvider = await embeddedWallet.getEthereumProvider();
    const provider = new BrowserProvider(ethereumProvider);

    const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);
    const approvedAddress = await nftContract.getApproved(tokenId);

    return approvedAddress;
  } catch (error) {
    console.error("Get approved address error:", error);
    return null;
  }
}
