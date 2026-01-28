# 💰 IDRX Integration (Testnet)

How MiniGarage uses MockIDRX token on Base Sepolia.

---

## 🇮🇩 Why Use IDRX?

### Rupiah UX for Indonesian Market

**Target Audience:** Indonesia has:
- 275 million population
- Growing Web3 adoption
- Strong car culture
- Familiarity with IDR (Rupiah)

**UX Benefits:**
- Users see prices in familiar currency-like denominations
- "1,000,000 IDRX" feels more tangible than "0.001 ETH"
- Easier mental math for pricing
- Cultural connection for Indonesian users

---

## 🧪 Scenario A: Mock IDRX on Base Sepolia

### Current Testnet Implementation

**Contract:** `MockIDRX` (ERC-20)  
**Address:** `0x998f8B20397445C10c1B60DCa1EebFbda4cA7847`  
**Network:** Base Sepolia (Chain ID: 84532)

### Token Specifications

| Property | Value |
|----------|-------|
| **Name** | MockIDRX |
| **Symbol** | IDRX |
| **Decimals** | 18 |
| **Total Supply** | Dynamic (minted on demand) |
| **Owner** | Backend Wallet (`0xAb4cBeFaeb226BC23F6399E0327F40e362cdDC3B`) |

---

## 🎯 Features Using IDRX

### Mapping: Feature → IDRX Usage

| Feature | IDRX Flow | Amount | Type |
|---------|-----------|--------|------|
| **Faucet** | Backend → User | +1,000,000 IDRX | Mint |
| **Open Standard Box** | User → Burn | -25,000 IDRX | Burn |
| **Open Rare Box** | User → Burn | -30,000 IDRX | Burn |
| **Open Premium Box** | User → Burn | -35,000 IDRX | Burn |
| **Open Legendary Box** | User → Burn | -50,000 IDRX | Burn |
| **Marketplace Buy** | Buyer → Seller | Variable | Transfer |
| **Marketplace Fee** | Seller → Treasury | 2.5% of sale | Transfer |
| **Admin Buyback** | Treasury → User | Variable | Transfer |

---

## 💸 IDRX Economy Flow

```
┌──────────────┐
│   FAUCET     │  Mint 1M IDRX (24h cooldown)
│   (Source)   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  USER WALLET │  Hold IDRX balance
└──────┬───────┘
       │
       ├────────────────────────────────┐
       │                                │
       ▼                                ▼
┌──────────────┐                ┌──────────────┐
│ GACHA BOXES  │                │ MARKETPLACE  │
│ (Burn)       │                │ (Trade)      │
└──────┬───────┘                └──────┬───────┘
       │                               │
       ▼                               ▼
  IDRX Burned                    IDRX Circulates
  (Deflationary)                 (Between Users)
```

---

## 🛠️ Technical Implementation

### Minting IDRX (Faucet)

**Backend API:**
```javascript
// User claims faucet
POST /api/faucet/claim
Authorization: Bearer <privy_token>

// Backend checks cooldown (24h)
const lastClaim = await db.getUserLastClaim(userId);
if (Date.now() - lastClaim < 86400000) {
  return { error: "Cooldown not expired" };
}

// Backend mints IDRX via contract
const contract = new ethers.Contract(MOCKIDRX_ADDRESS, ABI, backendSigner);
const tx = await contract.mint(userWallet, ethers.parseUnits("1000000", 18));
await tx.wait();

// Update DB
await db.setUserLastClaim(userId, Date.now());
```

---

### Burning IDRX (Gacha)

**User Flow:**
1. User approves IDRX spend
2. Backend calls `transferFrom()` to move IDRX to backend
3. Backend burns IDRX via `burn()`
4. Backend mints NFT reward

**Frontend:**
```javascript
// Step 1: Approve
const mockIDRX = new ethers.Contract(MOCKIDRX_ADDRESS, ABI, signer);
const boxCost = ethers.parseUnits("25000", 18); // Standard box
await mockIDRX.approve(BACKEND_WALLET, boxCost);

// Step 2: Call backend
const response = await fetch("/api/gacha/open", {
  method: "POST",
  body: JSON.stringify({ boxType: "standard" }),
});
```

**Backend:**
```javascript
// Transfer IDRX from user
const mockIDRX = new ethers.Contract(MOCKIDRX_ADDRESS, ABI, backendSigner);
await mockIDRX.transferFrom(userWallet, backendWallet, boxCost);

// Burn IDRX
await mockIDRX.burn(boxCost);

// Mint NFT reward
const nftContract = new ethers.Contract(CAR_NFT_ADDRESS, NFT_ABI, backendSigner);
await nftContract.mint(userWallet, tokenId, metadataURI);
```

---

### Transferring IDRX (Marketplace)

**Buyer Flow:**
1. Buyer approves IDRX for marketplace contract
2. Marketplace executes atomic swap:
   - Transfer IDRX from buyer to seller (minus 2.5% fee)
   - Transfer NFT from seller to buyer

**Smart Contract (Solidity):**
```solidity
function buyItem(uint256 listingId) external nonReentrant {
    Listing storage listing = listings[listingId];
    require(listing.active, "Not active");
    
    uint256 fee = (listing.price * marketplaceFee) / 10000;
    uint256 sellerAmount = listing.price - fee;
    
    // Transfer IDRX
    IERC20(IDRX_ADDRESS).transferFrom(msg.sender, listing.seller, sellerAmount);
    IERC20(IDRX_ADDRESS).transferFrom(msg.sender, treasury, fee);
    
    // Transfer NFT
    IERC721(listing.nftContract).transferFrom(listing.seller, msg.sender, listing.tokenId);
    
    listing.active = false;
    emit ItemSold(listingId, msg.sender, listing.price);
}
```

---

## 📊 IDRX Statistics (Testnet)

| Metric | Value |
|--------|-------|
| **Total Minted** | 50,000,000+ IDRX |
| **Total Burned** | 15,000,000+ IDRX |
| **Circulating Supply** | ~35,000,000 IDRX |
| **Unique Holders** | 100+ wallets |
| **Avg Balance** | 500,000 IDRX |

---

## 🚀 Mainnet Plan: Official IDRX

### ⚠️ Important Note

**MockIDRX is for testnet only.** For mainnet launch, we plan to:

### Option 1: Partner with Official IDRX Stablecoin

If Indonesia launches an official IDRX stablecoin (like USDC/USDT):
- Integrate official IDRX contract
- 1 IDRX = 1 Indonesian Rupiah
- Easier fiat on-ramp via Coinbase/exchanges

### Option 2: Use Existing Stablecoin

Use USDC/USDT with IDR-equivalent pricing:
- Display prices in IDR
- Convert to USD on-chain
- Partner with fiat on-ramp providers

### Option 3: Continue Custom Token

Keep custom IDRX but add value:
- Backed by treasury reserves
- Redeemable for USDC
- Governance rights

---

## 💡 Why Not Just Use ETH?

| Issue with ETH | Solution with IDRX |
|----------------|-------------------|
| **Price Volatility** | IDRX has stable in-game value |
| **Gas Confusion** | Users never think about gas |
| **Small Amounts** | 25K IDRX clearer than 0.00001 ETH |
| **Cultural Fit** | IDRX familiar to Indonesian users |
| **Marketing** | "Claim 1 Million IDRX!" more exciting |

---

## 🔐 Security Considerations

### Minting Access Control

```solidity
contract MockIDRX is ERC20, Ownable {
    // Only owner can mint
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
```

**Backend wallet is owner:**
- Hot wallet for testnet (convenience)
- **Mainnet:** Will use multi-sig + timelock

---

### Approval Management

**Best Practice:**
- Approve exact amounts (not `type(uint256).max`)
- Revoke approvals when done
- Use `increaseAllowance()` for safety

**Example:**
```javascript
// Good: Approve exact amount
await mockIDRX.approve(marketplace, priceInWei);

// Avoid: Unlimited approval (security risk)
await mockIDRX.approve(marketplace, ethers.MaxUint256);
```

---

## 🧪 Testing IDRX Integration

### For Developers

**1. Get Test ETH:**
```bash
# Visit Coinbase faucet
https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
```

**2. Claim IDRX:**
```javascript
// Login to app
// Click "Claim IDRX" on dashboard
// Receive 1M IDRX
```

**3. Check Balance:**
```javascript
const mockIDRX = new ethers.Contract(
  "0x998f8B20397445C10c1B60DCa1EebFbda4cA7847",
  ["function balanceOf(address) view returns (uint256)"],
  provider
);
const balance = await mockIDRX.balanceOf(userAddress);
console.log("Balance:", ethers.formatUnits(balance, 18), "IDRX");
```

---

## 📈 IDRX Pricing Rationale

### Box Prices

| Box | IDRX Cost | Reasoning |
|-----|-----------|-----------|
| Standard | 25,000 | ~25 IDR (affordable) |
| Rare | 30,000 | +20% for better odds |
| Premium | 35,000 | +40% for Epic focus |
| Legendary | 50,000 | +100% for best rewards |

### Faucet Amount

**1,000,000 IDRX** allows:
- 40 Standard boxes
- 33 Rare boxes
- 28 Premium boxes
- 20 Legendary boxes

**Psychological benefit:** "I'm a millionaire!" 🎉

---

## 🔗 External Resources

- **MockIDRX Contract:** [View on BaseScan](https://sepolia.basescan.org/address/0x998f8B20397445C10c1B60DCa1EebFbda4cA7847)
- **ERC-20 Standard:** [EIP-20](https://eips.ethereum.org/EIPS/eip-20)
- **Base Documentation:** [base.org/docs](https://docs.base.org)
