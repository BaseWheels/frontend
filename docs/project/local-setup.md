# ⚙️ Local Setup (Developer Guide)

Complete guide to running MiniGarage locally for development.

---

## 📋 Requirements

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **Node.js** | 18.0+ | 20.0+ LTS |
| **npm** | 9.0+ | 10.0+ |
| **RAM** | 4GB | 8GB+ |
| **Disk Space** | 2GB | 5GB+ |
| **OS** | Windows 10/macOS/Linux | Any modern OS |

### Required Accounts

- [ ] **GitHub** - Clone repositories
- [ ] **Privy** - Get App ID from [dashboard.privy.io](https://dashboard.privy.io)
- [ ] **Coinbase** - For Base Sepolia testnet ETH

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
# Clone frontend
git clone https://github.com/yourusername/minigarage-frontend.git
cd minigarage-frontend

# Clone contracts (optional)
git clone https://github.com/yourusername/minigarage-contracts.git
```

---

### 2. Install Dependencies

```bash
# Frontend
cd minigarage-frontend
npm install

# Contracts (if cloned)
cd ../minigarage-contracts
npm install
```

---

### 3. Environment Variables

#### Frontend `.env.local`

Create `.env.local` in frontend root:

```bash
# Copy example
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Base URL
NEXT_PUBLIC_URL=http://localhost:3000

# Privy (Get from https://dashboard.privy.io)
NEXT_PUBLIC_PRIVY_APP_ID=clxxx-your-privy-app-id-here

# Backend API (if separate)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# Smart Contract Addresses (Base Sepolia)
NEXT_PUBLIC_MOCKIDRX_CONTRACT_ADDRESS=0x998f8B20397445C10c1B60DCa1EebFbda4cA7847
NEXT_PUBLIC_CAR_CONTRACT_ADDRESS=0x_your_car_contract_here
NEXT_PUBLIC_FRAGMENT_CONTRACT_ADDRESS=0x_your_fragment_contract_here
NEXT_PUBLIC_GACHA_CONTRACT_ADDRESS=0x_your_gacha_contract_here
NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS=0x_your_marketplace_contract_here

# Backend Wallet (for approvals)
NEXT_PUBLIC_BACKEND_WALLET_ADDRESS=0xAb4cBeFaeb226BC23F6399E0327F40e362cdDC3B

# Chain Configuration
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_CHAIN_NAME=Base Sepolia
```

#### Contracts `.env`

Create `.env` in contracts root:

```env
# Base Sepolia RPC
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Deployer Private Key (DO NOT COMMIT!)
PRIVATE_KEY=your_private_key_here

# BaseScan API Key (for verification)
BASESCAN_API_KEY=your_basescan_api_key_here

# Optional: Alchemy/Infura for backup RPC
ALCHEMY_API_KEY=
```

{% hint style="danger" %}
**Never commit private keys!** Add `.env` to `.gitignore`.
{% endhint %}

---

### 4. Run Development Server

#### Frontend

```bash
cd minigarage-frontend
npm run dev
```

**Access:** [http://localhost:3000](http://localhost:3000)

**Hot Reload:** Changes auto-refresh

---

#### Backend (if separate)

```bash
cd minigarage-backend
npm run dev
```

**Access:** [http://localhost:3001](http://localhost:3001)

---

## 📜 Deploy Smart Contracts

### Hardhat Setup

#### 1. Install Hardhat

```bash
cd minigarage-contracts
npm install --save-dev hardhat
```

#### 2. Configure `hardhat.config.js`

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 84532,
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: process.env.BASESCAN_API_KEY,
    },
    customChains: [
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
};
```

---

### Deploy Contracts

#### 1. Compile Contracts

```bash
npx hardhat compile
```

**Output:** `artifacts/` and `cache/` folders

---

#### 2. Deploy to Base Sepolia

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

**Example `scripts/deploy.js`:**

```javascript
const hre = require("hardhat");

async function main() {
  console.log("Deploying to Base Sepolia...");

  // Deploy MockIDRX
  const MockIDRX = await hre.ethers.getContractFactory("MockIDRX");
  const mockIDRX = await MockIDRX.deploy();
  await mockIDRX.waitForDeployment();
  console.log("MockIDRX deployed to:", await mockIDRX.getAddress());

  // Deploy CarNFT
  const CarNFT = await hre.ethers.getContractFactory("CarNFT");
  const carNFT = await CarNFT.deploy();
  await carNFT.waitForDeployment();
  console.log("CarNFT deployed to:", await carNFT.getAddress());

  // Deploy FragmentNFT
  const FragmentNFT = await hre.ethers.getContractFactory("FragmentNFT");
  const fragmentNFT = await FragmentNFT.deploy();
  await fragmentNFT.waitForDeployment();
  console.log("FragmentNFT deployed to:", await fragmentNFT.getAddress());

  // Deploy GachaVault
  const GachaVault = await hre.ethers.getContractFactory("GachaVault");
  const gachaVault = await GachaVault.deploy(
    await mockIDRX.getAddress(),
    await carNFT.getAddress(),
    await fragmentNFT.getAddress()
  );
  await gachaVault.waitForDeployment();
  console.log("GachaVault deployed to:", await gachaVault.getAddress());

  // Grant minter roles
  await carNFT.grantRole(await carNFT.MINTER_ROLE(), await gachaVault.getAddress());
  await fragmentNFT.grantRole(await fragmentNFT.MINTER_ROLE(), await gachaVault.getAddress());
  console.log("Minter roles granted ✅");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

#### 3. Verify Contracts

```bash
npx hardhat verify --network baseSepolia DEPLOYED_CONTRACT_ADDRESS
```

**Example:**

```bash
npx hardhat verify --network baseSepolia 0x998f8B20397445C10c1B60DCa1EebFbda4cA7847
```

---

### Test Contracts

#### Run Tests

```bash
npx hardhat test
```

**Example Test:**

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MockIDRX", function () {
  let mockIDRX;
  let owner;
  let user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const MockIDRX = await ethers.getContractFactory("MockIDRX");
    mockIDRX = await MockIDRX.deploy();
    await mockIDRX.waitForDeployment();
  });

  it("Should mint tokens to user", async function () {
    const amount = ethers.parseUnits("1000000", 18);
    await mockIDRX.mint(user.address, amount);
    expect(await mockIDRX.balanceOf(user.address)).to.equal(amount);
  });

  it("Should burn tokens", async function () {
    const amount = ethers.parseUnits("1000000", 18);
    await mockIDRX.mint(user.address, amount);
    await mockIDRX.connect(user).burn(ethers.parseUnits("500000", 18));
    expect(await mockIDRX.balanceOf(user.address)).to.equal(ethers.parseUnits("500000", 18));
  });
});
```

#### Run Coverage

```bash
npx hardhat coverage
```

---

## 🗄️ Database Setup

### PostgreSQL (if using separate backend)

#### 1. Install PostgreSQL

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/)

**Linux:**
```bash
sudo apt install postgresql postgresql-contrib
```

---

#### 2. Create Database

```bash
psql postgres
CREATE DATABASE minigarage;
\q
```

---

#### 3. Database Schema

```sql
-- users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  privy_id VARCHAR(255) UNIQUE NOT NULL,
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  username VARCHAR(50),
  email VARCHAR(255),
  shipping_name VARCHAR(255),
  shipping_phone VARCHAR(50),
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- faucet_claims table
CREATE TABLE faucet_claims (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  amount BIGINT,
  tx_hash VARCHAR(66)
);

-- activities table
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  activity_type VARCHAR(50),
  description TEXT,
  reward_name VARCHAR(255),
  reward_rarity VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- marketplace_listings table
CREATE TABLE marketplace_listings (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER REFERENCES users(id),
  nft_contract VARCHAR(42),
  token_id INTEGER,
  price BIGINT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sold_at TIMESTAMP
);
```

---

#### 4. Environment Variables (Backend)

```env
DATABASE_URL=postgresql://localhost:5432/minigarage
```

---

## 🧪 Testing

### Frontend Tests

```bash
# Unit tests
npm test

# E2E tests (Playwright)
npm run test:e2e

# Component tests
npm run test:components
```

---

### Contract Tests

```bash
cd minigarage-contracts
npx hardhat test
```

---

## 📦 Build for Production

### Frontend

```bash
npm run build
npm run start
```

**Output:** `.next/` folder

---

### Docker (Optional)

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Build:**
```bash
docker build -t minigarage-frontend .
docker run -p 3000:3000 minigarage-frontend
```

---

## 🔧 Troubleshooting

### Common Issues

#### "Module not found"
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
```

#### "Privy not configured"
- Check `NEXT_PUBLIC_PRIVY_APP_ID` in `.env.local`
- Visit [dashboard.privy.io](https://dashboard.privy.io) to get App ID

#### "Contract not deployed"
- Run `npx hardhat run scripts/deploy.js --network baseSepolia`
- Update contract addresses in `.env.local`

#### "Database connection failed"
- Check PostgreSQL is running: `pg_isready`
- Verify `DATABASE_URL` in `.env`

---

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Privy Docs](https://docs.privy.io)
- [ethers.js Docs](https://docs.ethers.org)
- [Hardhat Docs](https://hardhat.org/docs)
- [Base Docs](https://docs.base.org)
