# 🔐 Security & Audits

MiniGarage prioritizes user safety, asset ownership, and secure gasless infrastructure.

---

## 🏛️ Smart Contract Security

Our contracts are built upon battle-tested standards to ensure robust security.

### 1. Standardized Implementations
We use **OpenZeppelin** contracts for all core standards, minimizing the risk of custom implementation errors.

*   **ERC-721**: For Car NFTs (`BaseWheelsCars.sol`)
*   **ERC-1155**: For Fragments (`BaseWheelsFragments.sol`)
*   **ERC-20**: For In-Game Currency (`MockIDRXv2.sol`)
*   **Ownable**: For strict access control

### 2. Access Control
We employ a clear separation of privileges:

*   **Contract Chain Owner:** Has administrative rights (e.g., upgrading contracts, setting base URIs).
*   **Minter Role (Backend Relayer):** Authorized *only* to mint rewards when a gacha or crafting action is verified.
*   **User:** Has full control over their own assets (transfers, approvals). **We cannot confiscate your NFTs.**

### 3. Protection Mechanisms
*   **Reentrancy Guards:** Applied to critical functions where external calls are made.
*   **SafeMint:** Used to prevent tokens from being locked in contracts that cannot handle them.

---

## 🔒 Backend & Relayer Security

Since we pay for your gas, securing our backend is critical.

### 1. Gas Sponsorship Safety
To prevent "gas draining" attacks where malicious users spam transactions to deplete our treasury:
*   **Rate Limiting:** Users are limited to a specific number of actions per minute.
*   **Signature Verification:** The backend only relays transactions signed by authenticated users.
*   **Context Validation:** A "Craft" transaction is only relayed if the user actually holds the required 5 fragments in the database verification step *before* hitting the chain.

### 2. Private Key Management
*   **Relayer Keys:** Stored in secure, encrypted environment variables (not in code).
*   **Non-Custodial Users:** We do NOT store your wallet's private keys. Privy manages the embedded wallet infrastructure securely.

---

## 🕵️ Audit Status

### Current Status: Internal Review
As a Hackathon MVP, the contracts have undergone:
1.  **Automated Analysis:** Slither & Mythril scans for common vulnerabilities.
2.  **Internal Peer Review:** Line-by-line manual code review by the development team.
3.  **Testnet Stress Testing:** Validated with 500+ mock users and thousands of transactions.

### Future Roadmap: Professional Audit
Before mainnet launch, we are committed to:
*   **Third-Party Audit:** Engaging a firm like CertiK or similar to audit our `Gacha` and `Marketplace` logic.
*   **Bug Bounty:** Launching a program to reward community white-hat hackers.

> **⚠️ Disclaimer:** This is currently a testnet demonstration. Do not use real funds.

---

## 🛡️ User Protection Data

| Feature | Protection Layer |
| :--- | :--- |
| **Login** | Secure Authentication via **Privy** (SOC2 Compliant) |
| **Ownership** | **Non-Custodial** (You own your assets on-chain) |
| **Transactions** | **Explicit Approval** (You must sign to sell/burn) |
