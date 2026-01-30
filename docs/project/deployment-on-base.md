# ✅ Deployment on Base

This page documents the **actual on-chain deployment** of MiniGarage on Base Sepolia.

---

## 🌐 Network Information

MiniGarage is deployed on **Base Sepolia (testnet)**:

| Property | Value |
|--------|-------|
| **Network Name** | Base Sepolia |
| **Chain ID** | 84532 |
| **RPC URL** | https://sepolia.base.org |
| **Block Explorer** | https://sepolia.basescan.org |
| **Bridge** | https://bridge.base.org |
| **Faucet** | https://www.coinbase.com/faucets/base-ethereum-goerli-faucet |

---

## 📜 Deployed Smart Contracts

### Active Contracts (Base Sepolia)

| Contract | Standard | Address | Explorer |
|--------|----------|---------|----------|
| **MockIDRX** | ERC-20 | `0x998f8B20397445C10c1B60DCa1EebFbda4cA7847` | [View](https://sepolia.basescan.org/address/0x998f8B20397445C10c1B60DCa1EebFbda4cA7847) |
| **Fragment Contract** | ERC-1155 | `0xf477FEcF885956eeCe8E84a1507D7b5Ef3Fae589` | [View](https://sepolia.basescan.org/address/0xf477FEcF885956eeCe8E84a1507D7b5Ef3Fae589) |
| **Car NFT Contract** | ERC-721 | `0x7AEE1BFE9fD152eA1f99818cB02E1bc64DBE8b7C` | [View](https://sepolia.basescan.org/address/0x7AEE1BFE9fD152eA1f99818cB02E1bc64DBE8b7C) |

{% hint style="info" %}
**Verification Status:**  
All deployed contracts are **verified on BaseScan** and publicly readable.
{% endhint %}

---

## 🧠 Architecture Clarification

MiniGarage intentionally uses a **hybrid architecture**:

### ✅ On-Chain
- Token ownership (ERC-20, ERC-721, ERC-1155)
- Minting & burning
- Permanent ownership records

### ⚙️ Off-Chain (Backend-Coordinated)
- Gacha RNG logic
- Marketplace matching & settlement
- Gas sponsorship (server wallet)
- User-friendly UX (no ETH required)

> There is **NO on-chain Marketplace.sol or GachaVault.sol** in the MVP.  
> This is a **deliberate design decision** to reduce complexity and gas costs during hackathon phase.

---

## 💰 MockIDRX (ERC-20)

**Purpose:** In-game currency  
**Decimals:** 2 (Rupiah-style UX)

**Contract Address:**  
`0x998f8B20397445C10c1B60DCa1EebFbda4cA7847`

### Key Capabilities
- Faucet minting (daily claim)
- Burn / transfer for gacha
- Server-relayed gasless payments
- Marketplace settlement currency

**Verified Functions:**
- `balanceOf`
- `transfer`
- `approve`
- `burn`
- `payForSpinOnBehalfOf` (gasless backend relay)

---

## 🧩 Fragment Contract (ERC-1155)

**Purpose:** Car parts & daily rewards  
**Standard:** ERC-1155 (multi-token)

**Contract Address:**  
`0xf477FEcF885956eeCe8E84a1507D7b5Ef3Fae589`

### Why ERC-1155?
- Efficient multi-part management
- Same fragment types reused across models
- Lower gas than minting many ERC-721s

### Fragment Types
| ID | Part |
|--|--|
| 0 | Chassis |
| 1 | Wheels |
| 2 | Engine |
| 3 | Body |
| 4 | Interior |

Fragments are **burned during assembly** to mint a full car NFT.

---

## 🚗 Car NFT Contract (ERC-721)

**Purpose:** Full assembled cars (collectible NFTs)

**Contract Address:**  
`0x7AEE1BFE9fD152eA1f99818cB02E1bc64DBE8b7C`

### Characteristics
- Unique token per car
- Minted via:
  - Gacha reward
  - Fragment assembly
- Burnable for future physical redemption (roadmap)

Metadata served via backend using `baseURI + tokenId`.

---

## 🔐 Contract Ownership

| Contract | Owner |
|-------|-------|
| MockIDRX | Backend Admin Wallet |
| Fragment ERC-1155 | Backend Admin Wallet |
| Car ERC-721 | Backend Admin Wallet |

{% hint style="warning" %}
**Security Note:**  
Owner wallet is a **hot wallet for testnet only**.  
Mainnet plan includes **multisig + timelock**.
{% endhint %}

---

## 🧪 How to Verify Deployment (Judges)

1. Open BaseScan  
2. Paste any contract address above  
3. Check:
   - ✅ Verified source code
   - ✅ Read / Write Contract tabs
   - ✅ Live transactions

Example:  
https://sepolia.basescan.org/address/0x998f8B20397445C10c1B60DCa1EebFbda4cA7847

---

## 📊 Deployment Summary

| Metric | Value |
|-----|------|
| **Total Contracts** | 3 |
| **Network** | Base Sepolia |
| **Deployment Date** | Jan 2026 |
| **Verification** | 100% Verified |
| **Architecture** | Hybrid (On-chain + Backend) |

---

## 🚀 Mainnet Readiness (Next Steps)

- [ ] Multisig admin wallet
- [ ] Timelock for sensitive functions
- [ ] Contract audit
- [ ] Gas optimization review
- [ ] Base Mainnet deployment (8453)

---

{% hint style="success" %}
**All contracts listed above are live, verifiable, and actively used by the MiniGarage application.**
{% endhint %}
