# 📜 Smart Contracts

MiniGarage smart contract suite deployed on Base Sepolia.

---

## 🎯 Contract Suite Overview

MiniGarage uses **5 main smart contracts** to power the full gaming experience:

| Contract | Type | Purpose | Lines of Code |
|----------|------|---------|---------------|
| **MockIDRX** | ERC-20 | In-game currency | ~200 |
| **CarNFT** | ERC-721 | Complete car ownership | ~300 |
| **FragmentNFT** | ERC-721 | Car parts for assembly | ~350 |
| **GachaVault** | Custom | Box opening + RNG | ~400 |
| **Marketplace** | Custom | P2P trading | ~350 |

**Total:** ~1,600 lines of Solidity

---

## 📋 Token Standards Used

### ERC-721 (NFTs)

**Used for:** Cars & Fragments

**Why ERC-721?**
- Each car/fragment is unique with distinct metadata
- Full ownership transfer capability
- Compatible with all NFT marketplaces
- Established, audited standard

**Contracts:**
- `CarNFT.sol` - Complete assembled cars
- `FragmentNFT.sol` - 5 fragment types per car brand

---

### ERC-1155 (Multi-Token) ❌ Not Used

**Why not ERC-1155?**
- Each car is unique (not fungible)
- Fragments are unique per brand + type
- ERC-721 provides better marketplace compatibility
- Users expect ERC-721 for collectibles

**Future consideration:** Batch minting for gas savings on mainnet

---

### ERC-20 (Fungible Token)

**Used for:** MockIDRX currency

**Why ERC-20?**
- Universal wallet/DEX support
- Simple transfer logic
- Low gas costs
- Standard approval patterns

**Contract:** `MockIDRX.sol`

---

## 📜 Contract Details

### 1️⃣ MockIDRX (ERC-20)

**Address:** `0x998f8B20397445C10c1B60DCa1EebFbda4cA7847`

#### Key Functions

**`mint(address to, uint256 amount)`**
- Mints IDRX tokens to user wallet
- **Access:** Only owner (backend wallet)
- **Usage:** Faucet claims, rewards
- **Example:** Faucet mints 1M IDRX every 24h

**`burn(uint256 amount)`**
- Burns IDRX from caller's balance
- **Access:** Any token holder
- **Usage:** Opening gacha boxes, pay-to-burn mechanics
- **Example:** User opens 50K IDRX box → 50K burned

**`transfer(address to, uint256 amount)`**
- Standard ERC-20 transfer
- **Usage:** User-to-user transfers, marketplace payments

**`approve(address spender, uint256 amount)`**
- Allows contracts to spend user's IDRX
- **Usage:** Marketplace, GachaVault allowances

**`balanceOf(address account)`**
- View function to check balance
- **Usage:** Frontend displays, validation

**`decimals()`**
- Returns: `18`
- **Usage:** Formatting amounts in UI

---

### 2️⃣ CarNFT (ERC-721)

**Address:** `TBD`

#### Key Functions

**`mint(address to, uint256 tokenId, string memory tokenURI)`**
- Mints complete car NFT
- **Access:** Only minter role (GachaVault, AssemblyContract)
- **Parameters:**
  - `to` - User wallet address
  - `tokenId` - Unique NFT ID
  - `tokenURI` - Metadata URI (IPFS/Backend)

**`burn(uint256 tokenId)`**
- Burns car NFT (irreversible)
- **Access:** Token owner only
- **Usage:** Physical redemption, special events

**`transferFrom(address from, address to, uint256 tokenId)`**
- Standard NFT transfer
- **Usage:** Marketplace sales, gifts

**`approve(address to, uint256 tokenId)`**
- Approves marketplace to transfer NFT
- **Usage:** Listing cars for sale

**`tokenURI(uint256 tokenId)`**
- Returns metadata JSON URL
- **Usage:** Frontend fetches car details

**`ownerOf(uint256 tokenId)`**
- Returns current owner address
- **Usage:** Ownership verification

---

### 3️⃣ FragmentNFT (ERC-721)

**Address:** `TBD`

#### Key Functions

**`mint(address to, uint256 tokenId, uint8 fragmentType, string memory tokenURI)`**
- Mints fragment NFT with type
- **Access:** Only minter role (GachaVault)
- **Fragment Types:**
  - `0` - Chassis
  - `1` - Wheels
  - `2` - Engine
  - `3` - Body
  - `4` - Interior

**`burn(uint256 tokenId)`**
- Burns fragment (used in assembly)
- **Access:** Token owner or approved
- **Usage:** Assembly contract burns 5 fragments

**`getFragmentType(uint256 tokenId)`**
- Returns fragment type (0-4)
- **Usage:** Assembly validation

**`getFragmentsByOwner(address owner)`**
- Returns array of tokenIds owned
- **Usage:** Inventory display

---

### 4️⃣ GachaVault (Custom)

**Address:** `TBD`

#### Key Functions

**`openBox(uint8 boxType)`**
- Opens gacha box and mints reward
- **Parameters:**
  - `0` - Standard (25K IDRX)
  - `1` - Rare (30K IDRX)
  - `2` - Premium (35K IDRX)
  - `3` - Legendary (50K IDRX)
- **Process:**
  1. Check user has enough IDRX
  2. Transfer IDRX to vault (burn or treasury)
  3. Generate random number
  4. Determine reward based on probabilities
  5. Mint NFT (Car or Fragment)
  6. Emit `BoxOpened` event

**`setBoxConfig(uint8 boxType, uint256 cost, uint256[] memory probs)`**
- Updates box configuration
- **Access:** Only owner
- **Usage:** Adjust pricing, odds

**`getBoxInfo(uint8 boxType)`**
- Returns cost and probabilities
- **Usage:** Frontend displays odds

---

### 5️⃣ Marketplace (Custom)

**Address:** `TBD`

#### Key Functions

**`listItem(address nftContract, uint256 tokenId, uint256 price)`**
- Lists NFT for sale
- **Process:**
  1. Verify caller owns NFT
  2. Verify NFT approved for marketplace
  3. Create listing record
  4. Emit `ItemListed` event

**`buyItem(uint256 listingId)`**
- Purchases listed NFT
- **Process:**
  1. Check listing is active
  2. Check buyer has enough IDRX
  3. Transfer IDRX from buyer to seller (minus fee)
  4. Transfer NFT from seller to buyer
  5. Mark listing as sold
  6. Emit `ItemSold` event

**`cancelListing(uint256 listingId)`**
- Removes listing from marketplace
- **Access:** Only seller
- **Refunds:** No fees for canceling

**`setMarketplaceFee(uint256 bps)`**
- Sets marketplace fee in basis points
- **Access:** Only owner
- **Current:** 250 bps = 2.5%

**`withdrawFees()`**
- Withdraws collected fees to treasury
- **Access:** Only owner

---

## 🔐 Security Features

### Access Control

**Roles Implemented:**
- `owner` - Contract deployer, admin functions
- `minter` - Can mint NFTs (GachaVault, Assembly)
- `burner` - Can burn tokens (usually token owner)

**Libraries Used:**
- OpenZeppelin `Ownable` - Owner management
- OpenZeppelin `AccessControl` - Role-based permissions

---

### Reentrancy Protection

**Vulnerable Functions Protected:**
- `GachaVault.openBox()` - ReentrancyGuard
- `Marketplace.buyItem()` - ReentrancyGuard
- All IDRX transfers - Checks-Effects-Interactions pattern

**Library:**
- OpenZeppelin `ReentrancyGuard`

---

### Input Validation

**All public functions validate:**
- ✅ Address is not zero
- ✅ Amount is greater than zero
- ✅ Token IDs exist
- ✅ Caller is authorized
- ✅ State is valid (e.g., listing is active)

**Example:**
```solidity
function buyItem(uint256 listingId) external nonReentrant {
    require(listingId < listings.length, "Invalid listing");
    Listing storage listing = listings[listingId];
    require(listing.active, "Listing not active");
    require(msg.sender != listing.seller, "Cannot buy own item");
    // ... rest of logic
}
```

---

### Emergency Functions

**Circuit Breakers:**
- `pause()` / `unpause()` - Freeze all trading
- `emergencyWithdraw()` - Recover stuck funds (owner only)

**Upgrade Strategy:**
- Non-upgradeable for testnet (simpler, transparent)
- **Mainnet plan:** Use proxy pattern (UUPS or Transparent)

---

## 📦 Dependencies

| Library | Version | Purpose |
|---------|---------|---------|
| OpenZeppelin Contracts | 5.0.0 | ERC standards, security |
| Chainlink VRF | 2.0 | Verifiable randomness (future) |

---

## 🧪 Testing

**Test Coverage:** 85%+

**Test Files:**
- `MockIDRX.test.js` - Token minting, burning, transfers
- `CarNFT.test.js` - Minting, burning, metadata
- `FragmentNFT.test.js` - Fragment types, assembly validation
- `GachaVault.test.js` - Box opening, probabilities, RNG
- `Marketplace.test.js` - Listing, buying, canceling, fees

**Run Tests:**
```bash
cd contracts
npx hardhat test
```

---

## 🔍 Gas Optimization

| Contract | Optimization |
|----------|-------------|
| **All** | Use `calldata` for external functions |
| **All** | Pack structs to save storage slots |
| **GachaVault** | Cache storage variables in memory |
| **Marketplace** | Use events for off-chain indexing |
| **NFTs** | Batch minting for multiple users (future) |

---

## 📊 Comparison with Alternatives

### Why Not Existing Solutions?

| Alternative | Why Not Used |
|-------------|--------------|
| **Axie Infinity** | Too complex, closed ecosystem |
| **Loot Project** | Pure text-based, no gaming |
| **Opensea Storefront** | Not customized for gacha |
| **Manifold** | General NFT tools, no game logic |

**MiniGarage is custom-built** for the specific gacha + assembly + marketplace flow.

---

## 🚀 Future Improvements

**Post-Hackathon:**
- [ ] Chainlink VRF for provably fair RNG
- [ ] Batch minting to reduce gas
- [ ] EIP-2981 royalties
- [ ] Upgradeable proxies for mainnet
- [ ] Multi-sig for admin functions
