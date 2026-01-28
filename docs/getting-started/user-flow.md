# 🔄 User Flow (How It Works)

## 📱 End-to-End User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                    1. ONBOARDING                             │
│  User visits app → Login (Email/Social) → Wallet created    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    2. GET TOKENS                             │
│  Dashboard → Claim Faucet → Receive 1M IDRX (24h cooldown)  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    3. COLLECT                                │
│  Gacha Page → Select Box Tier → Open → Win Car/Fragment     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    4. BUILD                                  │
│  Inventory → Fragments Tab → Collect 5/5 → Assemble Car NFT │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    5. OWN & TRADE                            │
│  Marketplace → List for Sale OR Keep in Collection          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎮 Detailed Flow Breakdown

### 1️⃣ Login & Wallet Creation

| Step | What Happens | Technical |
|------|--------------|-----------|
| **User clicks "Login"** | Privy modal opens | Frontend triggers Privy auth |
| **User enters email** | Magic link sent | Privy handles email verification |
| **User verifies** | Embedded wallet created | Privy creates wallet, stores encrypted keys |
| **Wallet assigned** | User gets Base address | Wallet address shown in UI |

{% hint style="success" %}
**No seed phrases needed** - Privy manages wallet recovery through email/social accounts
{% endhint %}

---

### 2️⃣ Claiming IDRX Tokens

| Step | What Happens | Technical |
|------|--------------|-----------|
| **User clicks "Claim IDRX"** | Balance check + cooldown check | Frontend calls backend API |
| **Backend validates** | Checks last claim timestamp | PostgreSQL query for user |
| **Transaction sent** | 1M IDRX minted to user | Smart contract `mint()` called |
| **Confirmation** | Balance updated in UI | Frontend polls blockchain |

**Cooldown:** 24 hours between claims

---

### 3️⃣ Opening Gacha Boxes

| Step | What Happens | Technical |
|------|--------------|-----------|
| **User selects box** | Shows cost & odds | Frontend displays from constants |
| **User confirms** | IDRX approval requested | `approve()` for backend wallet |
| **Payment processed** | IDRX transferred | Backend calls `transferFrom()` |
| **RNG generated** | Random reward selected | Backend uses VRF (future) or secure random |
| **NFT minted** | Car or Fragment NFT created | `mint()` on NFT contracts |
| **Reveal animation** | User sees reward | Frontend displays result |

**Box Tiers:**
- Standard: 25K IDRX
- Rare: 30K IDRX
- Premium: 35K IDRX
- Legendary: 50K IDRX

---

### 4️⃣ Fragment Assembly

| Step | What Happens | Technical |
|------|--------------|-----------|
| **User has 5 fragments** | "READY!" badge shown | Frontend checks inventory |
| **User clicks "Assemble"** | Fragments approval requested | `setApprovalForAll()` on Fragment NFT |
| **Backend validates** | Checks user owns all 5 | Database + blockchain verify |
| **Fragments burned** | 5 Fragment NFTs destroyed | `burn()` on each fragment |
| **Car minted** | Complete Car NFT created | `mint()` on Car NFT contract |
| **Inventory updated** | New car shown | Frontend refreshes data |

---

### 5️⃣ Marketplace Trading

#### Listing a Car:
| Step | What Happens | Technical |
|------|--------------|-----------|
| **User selects car** | Opens sell modal | Frontend shows car details |
| **User sets price** | Enter IDRX amount | Frontend validates input |
| **User confirms** | NFT approval requested | `approve()` marketplace contract |
| **Listing created** | Car listed on marketplace | Database stores listing |

#### Buying a Car:
| Step | What Happens | Technical |
|------|--------------|-----------|
| **User finds listing** | Browses marketplace | Frontend queries backend API |
| **User clicks "Buy"** | Shows confirmation | Frontend checks buyer balance |
| **IDRX approved** | Buyer approves payment | `approve()` for seller amount |
| **Transaction executed** | NFT + IDRX swapped | Backend coordinates atomic swap |
| **Ownership transferred** | NFT goes to buyer | `transferFrom()` on NFT |
| **Seller paid** | IDRX sent to seller (minus fee) | `transfer()` IDRX |

**Marketplace Fee:** 2.5% of sale price

---

## ⛓️ On-Chain vs Off-Chain

### ✅ On-Chain (Base Sepolia)

All asset ownership and transactions are fully on-chain:

| Action | Contract | Method |
|--------|----------|--------|
| **Mint IDRX** | MockIDRX | `mint(address, uint256)` |
| **Transfer IDRX** | MockIDRX | `transfer(address, uint256)` |
| **Mint Car NFT** | CarNFT | `mint(address, uint256, string)` |
| **Mint Fragment NFT** | FragmentNFT | `mint(address, uint256, uint8, string)` |
| **Burn Fragment** | FragmentNFT | `burn(uint256)` |
| **Approve NFT** | CarNFT / FragmentNFT | `approve(address, uint256)` |
| **Transfer NFT** | CarNFT / FragmentNFT | `transferFrom(address, address, uint256)` |

### 🗄️ Off-Chain (Backend DB)

Performance and UX features stored in PostgreSQL:

| Data | Purpose |
|------|---------|
| **User profiles** | Username, email, shipping info |
| **Faucet cooldowns** | Track last claim timestamp |
| **Marketplace listings** | Active sales, prices, timestamps |
| **Transaction history** | Activity feed for users |
| **Session tokens** | Authentication state |

{% hint style="info" %}
**Why Hybrid?** On-chain ensures ownership, off-chain enables fast queries and rich metadata.
{% endhint %}

---

## ⛽ Gas Strategy

### Testnet Funding

**Problem:** New users need ETH for gas but don't have any.

**Solution:**
1. **Privy Embedded Wallet** - Users get wallet without upfront ETH
2. **Backend Gas Sponsorship** - Backend pays gas for:
   - First transaction (IDRX claim)
   - NFT minting (gacha rewards)
   - Assembly operations
3. **Base Sepolia Faucets** - Users can get free testnet ETH:
   - [Coinbase Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
   - [Base Discord Faucet](https://discord.gg/base)

### Gas Costs (Base Sepolia)

| Action | Estimated Gas | USD Equivalent (Testnet) |
|--------|---------------|--------------------------|
| IDRX Mint | ~50,000 | Free (testnet) |
| NFT Mint | ~80,000 | Free (testnet) |
| NFT Transfer | ~50,000 | Free (testnet) |
| Approve | ~45,000 | Free (testnet) |

{% hint style="warning" %}
**Mainnet Plan:** For mainnet launch, we'll implement:
- Gasless meta-transactions via ERC-2771
- Or: IDRX → ETH swap in backend for gas
- Or: Privy's built-in gas sponsorship
{% endhint %}

---

## 🔐 Security Notes

| Layer | Protection |
|-------|------------|
| **Authentication** | Privy JWT tokens, server-side validation |
| **Transactions** | All require user signature, backend can't move assets |
| **Approvals** | Limited amounts, contract-specific approvals |
| **Rate Limiting** | Faucet cooldown, API rate limits |
| **Input Validation** | Backend validates all parameters |

---

## 📊 User Flow Metrics

Current test data (Base Sepolia):

| Metric | Value |
|--------|-------|
| **Avg. Onboarding Time** | 30 seconds |
| **First Gacha to Completion** | ~2 minutes |
| **Transaction Confirmation** | 2-3 seconds |
| **Marketplace List to Sale** | Instant on acceptance |
