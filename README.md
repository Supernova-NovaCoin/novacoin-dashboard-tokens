# NovaCoin Token Dashboard

Create and manage tokens on the NovaCoin blockchain.

## Features

- **Token Creation**: ERC-20, ERC-721, ERC-1155 templates
- **Feature Toggles**: Mintable, Burnable, Pausable, Permit, Votes, Snapshots
- **Access Control**: Ownable or Role-Based (AccessControl)
- **Deployment Wizard**: Step-by-step deployment with progress tracking
- **Token Management**: View deployed tokens, verify contracts

## Tech Stack

- React 18 + TypeScript
- Vite build tool
- Tailwind CSS
- Zustand state management
- @novacoin/sdk for blockchain interaction

## Development

### Prerequisites

- Node.js >= 18
- pnpm (recommended) or npm

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Project Structure

```
src/
├── components/
│   └── Layout.tsx          # App layout with wallet connect
├── pages/
│   ├── Home.tsx            # Token type selection
│   ├── CreateToken.tsx     # Token configuration
│   ├── MyTokens.tsx        # Deployed tokens list
│   ├── TokenDetail.tsx     # Token details
│   └── Deploy.tsx          # Deployment wizard
├── templates/
│   └── contracts.ts        # Solidity generators
├── store/
│   └── tokenStore.ts       # Zustand state
└── types/
    └── token.ts            # TypeScript types
```

## Token Types

### ERC-20 (Fungible Token)
Standard fungible token with optional features:
- Initial supply configuration
- Mintable (create new tokens)
- Burnable (destroy tokens)
- Pausable (emergency stop)
- Permit (gasless approvals)
- Votes (governance)
- Snapshots (balance history)

### ERC-721 (NFT)
Non-fungible tokens with optional features:
- Base URI for metadata
- Mintable
- Burnable
- Pausable
- Enumerable (token listing)
- URI Storage (per-token metadata)

### ERC-1155 (Multi-Token)
Multi-token standard supporting both fungible and non-fungible:
- Single contract for multiple token types
- Batch operations
- Supply tracking

## Deployment Flow

1. **Select Token Type** - Choose ERC-20/721/1155
2. **Configure Token** - Name, symbol, features
3. **Review Contract** - Generated Solidity code
4. **Deploy** - Sign transaction and deploy
5. **Verify** - Verify source on explorer

## Related Repositories

- [novacoin](https://github.com/Supernova-NovaCoin/novacoin) - Core Blockchain
- [novacoin-sdk-ts](https://github.com/Supernova-NovaCoin/novacoin-sdk-ts) - TypeScript SDK
- [novacoin-explorer](https://github.com/Supernova-NovaCoin/novacoin-explorer) - Block Explorer

## License

MIT License
