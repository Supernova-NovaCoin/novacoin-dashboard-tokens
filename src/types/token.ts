/**
 * Token Dashboard Types
 */

export type TokenStandard = 'ERC20' | 'ERC721' | 'ERC1155';

export interface TokenConfig {
  standard: TokenStandard;
  name: string;
  symbol: string;
  decimals?: number; // ERC20 only
  initialSupply?: string; // ERC20 only
  maxSupply?: string; // ERC20 only
  baseUri?: string; // ERC721/1155 only

  // Features
  mintable: boolean;
  burnable: boolean;
  pausable: boolean;
  permit: boolean; // ERC20 only - EIP-2612
  votes: boolean; // ERC20 only - governance
  flashMint: boolean; // ERC20 only
  snapshots: boolean; // ERC20 only
  ownable: boolean;
  roles: boolean; // Access control with roles
}

export interface DeployedToken {
  id: string;
  address: string;
  standard: TokenStandard;
  name: string;
  symbol: string;
  decimals?: number;
  deployedAt: number;
  deployer: string;
  txHash: string;
  network: 'mainnet' | 'testnet';
  verified: boolean;
  features: string[];
}

export interface TokenBalance {
  tokenAddress: string;
  balance: string;
  tokenId?: string; // For NFTs
}

export interface DeploymentStep {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  error?: string;
  txHash?: string;
}

export interface ContractTemplate {
  standard: TokenStandard;
  name: string;
  description: string;
  features: string[];
  gasEstimate: string;
  code: string;
  abi: any[];
}

export interface WalletConnection {
  connected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string;
}

export interface VerificationRequest {
  tokenAddress: string;
  constructorArgs: any[];
  contractName: string;
  compilerVersion: string;
  optimizationRuns: number;
}
