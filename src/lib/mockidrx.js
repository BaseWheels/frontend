/**
 * MockIDRX Faucet Utility
 * Direct interaction dengan MockIDRX smart contract
 */

const MOCKIDRX_ADDRESS = "0x2F5e6f1acbd3a6D754385407880b60B382814020";
const BACKEND_WALLET_ADDRESS = "0x92F9778c18D43b9721E58A7a634cb65eeA80661d";

export { BACKEND_WALLET_ADDRESS };

const MOCKIDRX_ABI = [
  {
    "inputs": [],
    "name": "claimFaucet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "timeUntilNextClaim",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

/**
 * Claim faucet - User mendapat 1 juta IDRX
 * @param {Object} embeddedWallet - Privy embedded wallet
 * @returns {Promise<{success: boolean, txHash?: string, error?: string}>}
 */
export async function claimFaucet(embeddedWallet) {
  try {
    if (!embeddedWallet) {
      throw new Error("Wallet not connected");
    }

    // Import ethers dynamically
    const { BrowserProvider, Contract } = await import("ethers");

    // Get Ethereum provider dari Privy (bukan getEthersProvider!)
    const ethereumProvider = await embeddedWallet.getEthereumProvider();

    // Wrap dengan ethers.js BrowserProvider
    const provider = new BrowserProvider(ethereumProvider);
    const signer = await provider.getSigner();

    // Create contract instance
    const contract = new Contract(MOCKIDRX_ADDRESS, MOCKIDRX_ABI, signer);

    // Call claimFaucet function
    const tx = await contract.claimFaucet();

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.hash
    };
  } catch (error) {
    console.error("Claim faucet error:", error);

    // Parse error message
    let errorMessage = "Failed to claim faucet";
    if (error.message?.includes("Faucet cooldown active")) {
      errorMessage = "Cooldown aktif! Coba lagi setelah 24 jam.";
    } else if (error.message?.includes("user rejected")) {
      errorMessage = "Transaksi dibatalkan";
    }

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Cek berapa lama lagi bisa claim faucet
 * @param {Object} embeddedWallet - Privy embedded wallet
 * @param {string} userAddress - User wallet address
 * @returns {Promise<number>} Seconds until next claim (0 jika bisa claim)
 */
export async function checkFaucetCooldown(embeddedWallet, userAddress) {
  try {
    if (!embeddedWallet || !userAddress) {
      return 0;
    }

    const { BrowserProvider, Contract } = await import("ethers");
    const ethereumProvider = await embeddedWallet.getEthereumProvider();
    const provider = new BrowserProvider(ethereumProvider);

    const contract = new Contract(MOCKIDRX_ADDRESS, MOCKIDRX_ABI, provider);
    const secondsUntilNext = await contract.timeUntilNextClaim(userAddress);

    return Number(secondsUntilNext);
  } catch (error) {
    console.error("Check cooldown error:", error);
    return 0; // Return 0 jika error, biarkan user coba claim
  }
}

/**
 * Get MockIDRX balance from blockchain
 * @param {Object} embeddedWallet - Privy embedded wallet
 * @param {string} userAddress - User wallet address
 * @returns {Promise<number>} Balance in IDRX (formatted)
 */
export async function getMockIDRXBalance(embeddedWallet, userAddress) {
  try {
    if (!embeddedWallet || !userAddress) {
      return 0;
    }

    const { BrowserProvider, Contract, formatUnits } = await import("ethers");
    const ethereumProvider = await embeddedWallet.getEthereumProvider();
    const provider = new BrowserProvider(ethereumProvider);

    const contract = new Contract(MOCKIDRX_ADDRESS, MOCKIDRX_ABI, provider);
    const balance = await contract.balanceOf(userAddress);
    const decimals = await contract.decimals();

    // Convert dari wei ke IDRX (18 decimals)
    return parseFloat(formatUnits(balance, decimals));
  } catch (error) {
    console.error("Get balance error:", error);
    return 0;
  }
}

/**
 * Burn MockIDRX tokens (user burns their own tokens)
 * @param {Object} embeddedWallet - Privy embedded wallet
 * @param {number} amount - Amount to burn (in IDRX units)
 * @returns {Promise<{success: boolean, txHash?: string, error?: string}>}
 */
export async function burnMockIDRX(embeddedWallet, amount) {
  try {
    if (!embeddedWallet) {
      throw new Error("Wallet not connected");
    }

    const { BrowserProvider, Contract, parseUnits } = await import("ethers");
    const ethereumProvider = await embeddedWallet.getEthereumProvider();
    const provider = new BrowserProvider(ethereumProvider);
    const signer = await provider.getSigner();

    const contract = new Contract(MOCKIDRX_ADDRESS, MOCKIDRX_ABI, signer);
    const decimals = await contract.decimals();
    const amountInWei = parseUnits(amount.toString(), decimals);

    // User burns their own tokens - no approval needed!
    const tx = await contract.burn(amountInWei);
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.hash
    };
  } catch (error) {
    console.error("Burn MockIDRX error:", error);

    let errorMessage = "Failed to burn tokens";
    if (error.message?.includes("insufficient balance")) {
      errorMessage = "Insufficient MockIDRX balance";
    } else if (error.message?.includes("user rejected")) {
      errorMessage = "Transaction cancelled";
    }

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Approve backend wallet to spend MockIDRX tokens
 * @param {Object} embeddedWallet - Privy embedded wallet
 * @param {string} spenderAddress - Backend wallet address
 * @param {number} amount - Amount to approve (in IDRX units)
 * @returns {Promise<{success: boolean, txHash?: string, error?: string}>}
 */
export async function approveMockIDRX(embeddedWallet, spenderAddress, amount) {
  try {
    if (!embeddedWallet || !spenderAddress) {
      throw new Error("Wallet or spender address missing");
    }

    const { BrowserProvider, Contract, parseUnits } = await import("ethers");
    const ethereumProvider = await embeddedWallet.getEthereumProvider();
    const provider = new BrowserProvider(ethereumProvider);
    const signer = await provider.getSigner();

    const contract = new Contract(MOCKIDRX_ADDRESS, MOCKIDRX_ABI, signer);
    const decimals = await contract.decimals();
    const amountInWei = parseUnits(amount.toString(), decimals);

    // Approve spender to spend tokens
    const tx = await contract.approve(spenderAddress, amountInWei);
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.hash
    };
  } catch (error) {
    console.error("Approve MockIDRX error:", error);
    return {
      success: false,
      error: error.message || "Failed to approve tokens"
    };
  }
}

/**
 * Check allowance for spender
 * @param {Object} embeddedWallet - Privy embedded wallet
 * @param {string} ownerAddress - Token owner address
 * @param {string} spenderAddress - Spender address to check
 * @returns {Promise<number>} Allowance in IDRX units
 */
export async function checkAllowance(embeddedWallet, ownerAddress, spenderAddress) {
  try {
    if (!embeddedWallet || !ownerAddress || !spenderAddress) {
      return 0;
    }

    const { BrowserProvider, Contract, formatUnits } = await import("ethers");
    const ethereumProvider = await embeddedWallet.getEthereumProvider();
    const provider = new BrowserProvider(ethereumProvider);

    const contract = new Contract(MOCKIDRX_ADDRESS, MOCKIDRX_ABI, provider);
    const allowance = await contract.allowance(ownerAddress, spenderAddress);
    const decimals = await contract.decimals();

    return parseFloat(formatUnits(allowance, decimals));
  } catch (error) {
    console.error("Check allowance error:", error);
    return 0;
  }
}

/**
 * Format seconds menjadi human readable time
 * @param {number} seconds - Seconds
 * @returns {string} Formatted time (e.g., "5h 30m" atau "23h 15m")
 */
export function formatCooldownTime(seconds) {
  if (seconds <= 0) return "Ready!";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
