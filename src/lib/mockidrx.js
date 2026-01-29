/**
 * MockIDRX Faucet Utility
 * Direct interaction with MockIDRX smart contract
 */

import {
  MOCKIDRX_ADDRESS,
  BACKEND_WALLET_ADDRESS,
  DEFAULT_APPROVAL_AMOUNT,
  MIN_SERVER_ALLOWANCE,
} from "@/constants";

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
        "internalType": "uint256",
        "name": "spinCost",
        "type": "uint256"
      }
    ],
    "name": "payForSpin",
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
 * Claim faucet - User receives 1 million IDRX
 * @param {Object} embeddedWallet - Privy embedded wallet
 * @returns {Promise<{success: boolean, txHash?: string, error?: string}>}
 */
export async function claimFaucet(embeddedWallet) {
  try {
    if (!embeddedWallet) {
      throw new Error("Wallet not connected");
    }

    const { BrowserProvider, Contract } = await import("ethers");
    const ethereumProvider = await embeddedWallet.getEthereumProvider();
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

    let errorMessage = "Failed to claim faucet";
    if (error.message?.includes("Faucet cooldown active")) {
      errorMessage = "Cooldown active! Try again after 24 hours.";
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
 * Check how long until next faucet claim
 * @param {Object} embeddedWallet - Privy embedded wallet
 * @param {string} userAddress - User wallet address
 * @returns {Promise<number>} Seconds until next claim (0 if can claim)
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
    return 0;
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
 * Pay for spin by transferring to treasury (GASLESS!)
 * @param {Object} embeddedWallet - Privy embedded wallet
 * @param {number} amount - Amount to pay (in IDRX units)
 * @param {string} authToken - Privy access token for backend authentication
 * @returns {Promise<{success: boolean, txHash?: string, error?: string}>}
 */
export async function payForSpin(embeddedWallet, amount, authToken) {
  try {
    if (!embeddedWallet) {
      throw new Error("Wallet not connected");
    }

    if (!authToken) {
      throw new Error("Authentication token required");
    }

    console.log(`[payForSpin] Sending gasless transaction for ${amount} IDRX...`);

    // Call backend gasless endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gasless/pay-for-spin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ amount }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.details || 'Failed to pay for spin');
    }

    console.log(`[payForSpin] Success! TX Hash: ${data.txHash}`);

    return {
      success: true,
      txHash: data.txHash
    };
  } catch (error) {
    console.error("PayForSpin gasless error:", error);

    let errorMessage = "Failed to pay for spin";
    if (error.message?.includes("Insufficient balance") || error.message?.includes("Insufficient MockIDRX")) {
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

export { formatCooldown as formatCooldownTime } from "@/utils";

/**
 * Request starter ETH from backend for gas fees
 * @param {string} authToken - Auth token for backend
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function requestStarterETH(authToken) {
  try {
    console.log('[requestStarterETH] Requesting starter ETH from backend...');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gasless/request-starter-eth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to request starter ETH');
    }

    console.log('[requestStarterETH] Success:', data.message);
    return { success: true, message: data.message };
  } catch (error) {
    console.error('[requestStarterETH] Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Ensure user has approved server wallet for gasless transactions
 * User needs to approve ONCE, then all gacha spins are gasless!
 * @param {Object} embeddedWallet - Privy embedded wallet
 * @param {string} userAddress - User wallet address
 * @param {number} minAllowance - Minimum required allowance
 * @param {string} authToken - Auth token (optional, for requesting starter ETH)
 * @returns {Promise<{approved: boolean, txHash?: string, error?: string}>}
 */
export async function ensureServerWalletApproval(embeddedWallet, userAddress, minAllowance = MIN_SERVER_ALLOWANCE, authToken = null) {
  try {
    const currentAllowance = await checkAllowance(embeddedWallet, userAddress, BACKEND_WALLET_ADDRESS);

    console.log(`[ensureApproval] Current allowance: ${currentAllowance} IDRX, Required: ${minAllowance} IDRX`);

    if (currentAllowance >= minAllowance) {
      return {
        approved: true,
        message: "Already approved"
      };
    }

    console.log(`[ensureApproval] Need approval. Requesting user signature for ${DEFAULT_APPROVAL_AMOUNT} IDRX...`);

    // Request starter ETH if auth token provided
    if (authToken) {
      console.log('[ensureApproval] First, requesting starter ETH for gas...');
      await requestStarterETH(authToken);
      // Wait 2 seconds for ETH to arrive
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Direct wallet approval (user signs once)
    const approveResult = await approveMockIDRX(embeddedWallet, BACKEND_WALLET_ADDRESS, DEFAULT_APPROVAL_AMOUNT);

    if (!approveResult.success) {
      return {
        approved: false,
        error: approveResult.error
      };
    }

    return {
      approved: true,
      txHash: approveResult.txHash,
      message: "Approval successful! You can now use gasless gacha spins."
    };
  } catch (error) {
    console.error("Ensure approval error:", error);
    return {
      approved: false,
      error: error.message || "Failed to check/approve server wallet"
    };
  }
}
