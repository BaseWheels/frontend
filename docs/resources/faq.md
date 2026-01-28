# ❓ FAQ

Frequently Asked Questions about MiniGarage.

---

## 🌐 General Questions

### What is MiniGarage?

MiniGarage is a Web3 gaming platform where you collect, assemble, and trade NFT cars through a gacha (mystery box) system. Think of it like opening trading card packs, but with digital die-cast cars you truly own on the blockchain.

---

### Who is MiniGarage for?

- **Car enthusiasts** - Die-cast collectors going digital
- **Gamers** - Fans of gacha mechanics (Genshin, Axie)
- **NFT traders** - Looking for unique collectibles
- **Web3 beginners** - No crypto experience needed!

---

### Do I need crypto experience?

**No!** MiniGarage is designed for mainstream users:
- Login with email or social accounts (Google, Twitter)
- Wallet automatically created (no seed phrases)
- No MetaMask installation required
- No need to buy ETH for gas

---

## ⛓️ Kenapa Base?

### Why Base over other blockchains?

| Feature | Base | Ethereum L1 | Polygon | Solana |
|---------|------|-------------|---------|--------|
| **Gas Fees** | <$0.01 | $10-50 | $0.01-0.1 | $0.0001 |
| **Security** | Ethereum-settled | Native | Proof-of-Stake | Proof-of-History |
| **Speed** | 2-3 sec | 12-15 sec | 2-5 sec | 0.4 sec |
| **Ecosystem** | Coinbase | Largest | Growing | Gaming-focused |
| **EVM Compatible** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |

**Why Base wins:**
- ✅ **Low gas** enables microtransactions (gacha boxes)
- ✅ **Fast** for smooth gaming UX
- ✅ **Ethereum security** without L1 costs
- ✅ **Coinbase ecosystem** for fiat on-ramps
- ✅ **EVM compatible** - use existing tools

---

### What about Arbitrum or Optimism?

Both are great L2s! We chose Base because:
1. **Newer ecosystem** - More opportunity to stand out
2. **Coinbase backing** - Easier user onboarding
3. **Marketing** - "Built on Base" badge has strong branding
4. **Future plans** - Coinbase wallet integration

We may expand to other chains post-mainnet!

---

## 📱 Kenapa PWA?

### Why Progressive Web App instead of native mobile?

**Benefits of PWA:**

| Feature | PWA | Native App |
|---------|-----|------------|
| **Installation** | No app store approval | 2-4 weeks review |
| **Updates** | Instant | Wait for approval |
| **Cross-platform** | One codebase | iOS + Android separate |
| **Distribution** | Just share link | App store SEO |
| **Storage** | Small | 50-200MB |
| **Cost** | $0 | $99/yr (Apple) + $25 (Google) |

**PWA gives us:**
- ✅ **Fast iteration** - Deploy updates instantly
- ✅ **No gatekeepers** - No App Store approval needed
- ✅ **Universal access** - Works on all devices
- ✅ **Web3 friendly** - Easier wallet integration
- ✅ **Lower costs** - One codebase for everything

---

### Can I still install it like an app?

**Yes!** PWAs are installable:

**iOS:**
1. Open in Safari
2. Tap Share button
3. "Add to Home Screen"

**Android:**
1. Open in Chrome
2. Tap menu (3 dots)
3. "Install App"

**Desktop:**
1. Visit in Chrome/Edge
2. Click install icon in address bar

After installation, it behaves like a native app - full screen, app icon, etc.

---

## 💰 Kenapa Mock IDRX?

### Why use MockIDRX instead of real IDRX?

**Short answer:** Real IDRX stablecoin doesn't exist yet (to our knowledge).

**Detailed explanation:**

**If Official IDRX Stablecoin Launches:**
- We'll integrate immediately
- 1 IDRX = 1 Indonesian Rupiah
- Easy fiat on-ramps
- Better for Indonesian market

**Current MockIDRX Benefits:**
- ✅ **Fixed in-game value** - Not affected by ETH price
- ✅ **Familiar denominations** - "1 million IDRX" sounds cool
- ✅ **Cultural connection** - IDR-like naming for Indonesian users
- ✅ **Testnet ready** - Can deploy without real money

---

### Won't this confuse users about real IDRX?

We're transparent:
- "Mock" prefix clearly indicates it's not real currency
- Documentation explains it's a game token
- UI shows "IDRX" not "IDR"
- No real-world monetary value claimed

**Mainnet plan:**
- If real IDRX launches → Integrate
- If not → Use USDC with IDR-equivalent pricing
- Or → Keep custom token with treasury backing

---

### Can IDRX be traded?

**Testnet:** Yes, but it has no real value.

**Mainnet plans:**
- List on DEXs (Uniswap, etc.)
- IDRX/ETH liquidity pools
- Integration with Indonesian exchanges (if available)

---

## ⛽ Bagaimana Soal Gas untuk Wallet Baru?

### How do new users pay for gas?

**The Problem:**
New users get embedded wallets with 0 ETH. They can't do anything on-chain without gas.

**Our Solutions:**

#### 1. Backend Gas Sponsorship (Current)

Backend wallet pays gas for:
- ✅ First IDRX claim (faucet)
- ✅ NFT minting (gacha rewards)
- ✅ Assembly transactions

**User never needs ETH** for core gameplay!

---

#### 2. Free Testnet ETH (Base Sepolia)

**Coinbase Faucet:**
1. Visit [coinbase.com/faucets/base-ethereum-goerli-faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
2. Connect wallet
3. Get free Sepolia ETH
4. Bridge to Base Sepolia

**Base Discord Faucet:**
- Join [Base Discord](https://discord.gg/base)
- Use `/faucet` command
- Instant testnet ETH

---

#### 3. Mainnet Gas Solutions (Future)

**Option A: ERC-2771 (Meta-Transactions)**
- User signs message (free)
- Backend pays gas
- Transaction executes

**Option B: Paymaster (EIP-4337)**
- Smart account wallets
- Sponsor gas with IDRX tokens
- Users pay in IDRX, not ETH

**Option C: Privy Gas Sponsorship**
- Built-in feature from Privy
- Pay-per-transaction pricing
- No user ETH needed

---

### What if I want to use my own ETH?

**You can!** Connect external wallet:
- MetaMask
- Rainbow
- Coinbase Wallet
- WalletConnect

Then use your own ETH for gas. Privy supports both embedded + external wallets.

---

## 🎰 Gameplay Questions

### How does the gacha system work?

1. **Choose a box** - Standard (25K), Rare (30K), Premium (35K), or Legendary (50K IDRX)
2. **Open box** - Animation plays
3. **Receive reward** - Either:
   - Complete car NFT, or
   - 1 fragment (need 5 to assemble)

---

### What are fragments?

Car parts needed to build complete cars:
- **Chassis** ⚪
- **Wheels** ⚙️
- **Engine** 🔧
- **Body** 🎨
- **Interior** 🪑

Collect all 5 of the same brand → Assemble complete car!

---

### What's the difference between box tiers?

| Box | Cost | Focus | Best For |
|-----|------|-------|----------|
| **Standard** | 25K | Common/Rare | Beginners |
| **Rare** | 30K | Rare/Epic | Sport car hunters |
| **Premium** | 35K | Epic-heavy | Supercar fans |
| **Legendary** | 50K | Legendary 70% | Whale collectors |

---

### Can I trade with other players?

**Yes!** Use the Marketplace:
- List cars for sale (set your price)
- Buy from others
- 2.5% marketplace fee on sales

---

## 🔐 Security Questions

### Is my wallet safe?

**Yes!** Security layers:
- **Privy encryption** - Keys encrypted at rest
- **Social recovery** - Recover via email/OAuth
- **No seed phrases** - Can't accidentally leak
- **Smart contracts audited** - (planned for mainnet)

---

### Can the team steal my NFTs?

**No!** We can't move your assets:
- NFTs are ERC-721 standard
- Only you control your wallet
- Backend can't transfer without your signature

**We CAN:**
- Mint new NFTs (for gacha rewards)
- Burn NFTs (for assembly, with your permission)

---

### What if I lose access to my account?

**Privy Recovery:**
- Email login → Verify email to recover
- Social login → Login again with same account
- External wallet → Use your own recovery method

---

## 🚀 Future Plans

### Will MiniGarage launch on mainnet?

**Yes!** Roadmap:
- **Q1 2026:** Hackathon MVP ✅
- **Q2 2026:** Security audit + mainnet prep
- **Q3 2026:** Base Mainnet launch

---

### Will there be a token?

**IDRX already exists** as game currency.

**Governance token (future):**
- Vote on game decisions
- Propose new features
- Treasury allocation
- Staking rewards

---

### Can I redeem NFTs for physical cars?

**Yes (planned)!** Selected cars will be redeemable:
- Burn your NFT
- Receive physical die-cast model
- Certificate of authenticity
- Global shipping

**Eligible cars:**
- Legendary tier
- Special edition releases

---

## 💬 Contact & Support

### How do I report bugs?

- **Discord:** #bug-reports channel
- **GitHub:** [Open an issue](https://github.com/yourusername/minigarage/issues)
- **Email:** bugs@minigarage.app

---

### How do I request features?

- **Discord:** #feature-requests channel
- **Twitter:** Tag us @MiniGarageNFT
- **GitHub:** Discussions section

---

### Where can I get help?

- **Discord:** [Join Server](https://discord.gg/minigarage) - Fastest response
- **Twitter:** [@MiniGarageNFT](https://twitter.com/MiniGarageNFT)
- **Email:** support@minigarage.app

---

## 🏆 Hackathon Judges

### How long did it take to build?

**45 days** from concept to MVP:
- Week 1-2: Design + planning
- Week 3-4: Smart contracts + frontend
- Week 5: Integration + testing
- Week 6: Polish + documentation

---

### What's the most innovative feature?

**Fragment assembly system!** It:
- Reduces pure RNG frustration
- Adds progression mechanics
- Creates scarcity (need all 5)
- Enables fragment trading economy

---

### What's next after hackathon?

1. **Security audit** - Professional review
2. **Community building** - Discord, Twitter
3. **Partnerships** - Die-cast manufacturers
4. **Mainnet launch** - Q2 2026

---

{% hint style="success" %}
**Have more questions?** Join our [Discord](https://discord.gg/minigarage) and ask the team directly!
{% endhint %}
