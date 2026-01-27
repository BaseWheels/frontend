import { BrowserProvider, Contract, parseUnits, formatUnits } from "ethers";

const MOCKIDRX_ADDRESS = "0x998f8B20397445C10c1B60DCa1EebFbda4cA7847";
const MARKETPLACE_ADDRESS = "0x2d13D164d6aBaEa446684c5d0173620886CE26c8";
const NFT_CONTRACT_ADDRESS = "0x1ED1d8AC243f07164FBA9562d6b2e80483816c3C";

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
];

export async function approveTokenForMarketplace(embeddedWallet, walletAddress, amount) {
  const ethereumProvider = await embeddedWallet.getEthereumProvider();
  const provider = new BrowserProvider(ethereumProvider);
  const signer = await provider.getSigner();

  const tokenContract = new Contract(MOCKIDRX_ADDRESS, MOCKIDRX_ABI, signer);
  const allowance = await tokenContract.allowance(walletAddress, MARKETPLACE_ADDRESS);
  const decimals = await tokenContract.decimals();
  const currentAllowance = parseFloat(formatUnits(allowance, decimals));

  if (currentAllowance >= amount) {
    return { alreadyApproved: true };
  }

  const amountInWei = parseUnits(amount.toString(), decimals);
  const tx = await tokenContract.approve(MARKETPLACE_ADDRESS, amountInWei);
  await tx.wait();

  return { alreadyApproved: false, txHash: tx.hash };
}

export async function approveNFTForMarketplace(embeddedWallet, tokenId) {
  const ethereumProvider = await embeddedWallet.getEthereumProvider();
  const provider = new BrowserProvider(ethereumProvider);
  const signer = await provider.getSigner();

  const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
  const tx = await nftContract.approve(MARKETPLACE_ADDRESS, tokenId);
  await tx.wait();

  return { txHash: tx.hash };
}
