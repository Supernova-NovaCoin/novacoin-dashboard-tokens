/**
 * Solidity Contract Templates for Token Creation
 */

import type { TokenConfig } from '../types/token';

export function generateERC20Contract(config: TokenConfig): string {
  const imports: string[] = [
    'import "@openzeppelin/contracts/token/ERC20/ERC20.sol";',
  ];

  const inheritance: string[] = ['ERC20'];
  const constructorParams: string[] = [];
  const constructorBody: string[] = [];

  if (config.burnable) {
    imports.push('import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";');
    inheritance.push('ERC20Burnable');
  }

  if (config.pausable) {
    imports.push('import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";');
    imports.push('import "@openzeppelin/contracts/security/Pausable.sol";');
    inheritance.push('ERC20Pausable');
  }

  if (config.permit) {
    imports.push('import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";');
    inheritance.push('ERC20Permit');
  }

  if (config.votes) {
    imports.push('import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";');
    inheritance.push('ERC20Votes');
  }

  if (config.flashMint) {
    imports.push('import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";');
    inheritance.push('ERC20FlashMint');
  }

  if (config.snapshots) {
    imports.push('import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";');
    inheritance.push('ERC20Snapshot');
  }

  if (config.ownable && !config.roles) {
    imports.push('import "@openzeppelin/contracts/access/Ownable.sol";');
    inheritance.push('Ownable');
  }

  if (config.roles) {
    imports.push('import "@openzeppelin/contracts/access/AccessControl.sol";');
    inheritance.push('AccessControl');
  }

  // Build constructor
  if (config.permit) {
    constructorBody.push(`ERC20Permit("${config.name}")`);
  }

  if (config.initialSupply) {
    constructorBody.push(`_mint(msg.sender, ${config.initialSupply} * 10 ** decimals())`);
  }

  if (config.roles) {
    constructorBody.push('_grantRole(DEFAULT_ADMIN_ROLE, msg.sender)');
    if (config.mintable) {
      constructorBody.push('_grantRole(MINTER_ROLE, msg.sender)');
    }
    if (config.pausable) {
      constructorBody.push('_grantRole(PAUSER_ROLE, msg.sender)');
    }
  }

  // Generate functions
  const functions: string[] = [];

  if (config.mintable) {
    const modifier = config.roles ? 'onlyRole(MINTER_ROLE)' : 'onlyOwner';
    functions.push(`
    function mint(address to, uint256 amount) public ${modifier} {
        _mint(to, amount);
    }`);
  }

  if (config.pausable) {
    const modifier = config.roles ? 'onlyRole(PAUSER_ROLE)' : 'onlyOwner';
    functions.push(`
    function pause() public ${modifier} {
        _pause();
    }

    function unpause() public ${modifier} {
        _unpause();
    }`);
  }

  if (config.snapshots) {
    functions.push(`
    function snapshot() public onlyOwner {
        _snapshot();
    }`);
  }

  // Handle overrides
  const overrides: string[] = [];

  if (config.pausable || config.snapshots || config.votes) {
    overrides.push(`
    function _update(address from, address to, uint256 value)
        internal
        override(${['ERC20', config.pausable ? 'ERC20Pausable' : '', config.snapshots ? 'ERC20Snapshot' : '', config.votes ? 'ERC20Votes' : ''].filter(Boolean).join(', ')})
    {
        super._update(from, to, value);
    }`);
  }

  if (config.votes) {
    overrides.push(`
    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }`);
  }

  // Role constants
  const roleConstants = config.roles ? `
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");` : '';

  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

${imports.join('\n')}

contract ${config.symbol}Token is ${inheritance.join(', ')} {${roleConstants}
    constructor()
        ERC20("${config.name}", "${config.symbol}")${config.ownable && !config.roles ? '\n        Ownable(msg.sender)' : ''}
    {${constructorBody.length > 0 ? '\n        ' + constructorBody.join(';\n        ') + ';' : ''}
    }
${functions.join('\n')}
${overrides.join('\n')}
}
`;
}

export function generateERC721Contract(config: TokenConfig): string {
  const imports: string[] = [
    'import "@openzeppelin/contracts/token/ERC721/ERC721.sol";',
  ];

  const inheritance: string[] = ['ERC721'];
  const stateVars: string[] = ['uint256 private _nextTokenId;'];

  if (config.burnable) {
    imports.push('import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";');
    inheritance.push('ERC721Burnable');
  }

  if (config.pausable) {
    imports.push('import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";');
    inheritance.push('ERC721Pausable');
  }

  if (config.baseUri) {
    imports.push('import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";');
    inheritance.push('ERC721URIStorage');
  }

  if (config.ownable && !config.roles) {
    imports.push('import "@openzeppelin/contracts/access/Ownable.sol";');
    inheritance.push('Ownable');
  }

  if (config.roles) {
    imports.push('import "@openzeppelin/contracts/access/AccessControl.sol";');
    inheritance.push('AccessControl');
  }

  const functions: string[] = [];

  if (config.mintable) {
    const modifier = config.roles ? 'onlyRole(MINTER_ROLE)' : 'onlyOwner';
    functions.push(`
    function safeMint(address to, string memory uri) public ${modifier} {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }`);
  }

  if (config.pausable) {
    const modifier = config.roles ? 'onlyRole(PAUSER_ROLE)' : 'onlyOwner';
    functions.push(`
    function pause() public ${modifier} {
        _pause();
    }

    function unpause() public ${modifier} {
        _unpause();
    }`);
  }

  const roleConstants = config.roles ? `
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");` : '';

  const constructorBody: string[] = [];
  if (config.roles) {
    constructorBody.push('_grantRole(DEFAULT_ADMIN_ROLE, msg.sender)');
    if (config.mintable) constructorBody.push('_grantRole(MINTER_ROLE, msg.sender)');
    if (config.pausable) constructorBody.push('_grantRole(PAUSER_ROLE, msg.sender)');
  }

  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

${imports.join('\n')}

contract ${config.symbol}NFT is ${inheritance.join(', ')} {${roleConstants}
    ${stateVars.join('\n    ')}

    constructor()
        ERC721("${config.name}", "${config.symbol}")${config.ownable && !config.roles ? '\n        Ownable(msg.sender)' : ''}
    {${constructorBody.length > 0 ? '\n        ' + constructorBody.join(';\n        ') + ';' : ''}
    }

    function _baseURI() internal pure override returns (string memory) {
        return "${config.baseUri || ''}";
    }
${functions.join('\n')}

    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721${config.baseUri ? ', ERC721URIStorage' : ''})
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721${config.baseUri ? ', ERC721URIStorage' : ''}${config.roles ? ', AccessControl' : ''})
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
`;
}

export function generateERC1155Contract(config: TokenConfig): string {
  const imports: string[] = [
    'import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";',
  ];

  const inheritance: string[] = ['ERC1155'];

  if (config.burnable) {
    imports.push('import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";');
    inheritance.push('ERC1155Burnable');
  }

  if (config.pausable) {
    imports.push('import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";');
    inheritance.push('ERC1155Pausable');
  }

  imports.push('import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";');
  inheritance.push('ERC1155Supply');

  if (config.ownable && !config.roles) {
    imports.push('import "@openzeppelin/contracts/access/Ownable.sol";');
    inheritance.push('Ownable');
  }

  if (config.roles) {
    imports.push('import "@openzeppelin/contracts/access/AccessControl.sol";');
    inheritance.push('AccessControl');
  }

  const functions: string[] = [];

  if (config.mintable) {
    const modifier = config.roles ? 'onlyRole(MINTER_ROLE)' : 'onlyOwner';
    functions.push(`
    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        ${modifier}
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        ${modifier}
    {
        _mintBatch(to, ids, amounts, data);
    }`);
  }

  if (config.pausable) {
    const modifier = config.roles ? 'onlyRole(PAUSER_ROLE)' : 'onlyOwner';
    functions.push(`
    function pause() public ${modifier} {
        _pause();
    }

    function unpause() public ${modifier} {
        _unpause();
    }`);
  }

  const roleConstants = config.roles ? `
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");` : '';

  const constructorBody: string[] = [];
  if (config.roles) {
    constructorBody.push('_grantRole(DEFAULT_ADMIN_ROLE, msg.sender)');
    constructorBody.push('_grantRole(URI_SETTER_ROLE, msg.sender)');
    if (config.mintable) constructorBody.push('_grantRole(MINTER_ROLE, msg.sender)');
    if (config.pausable) constructorBody.push('_grantRole(PAUSER_ROLE, msg.sender)');
  }

  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

${imports.join('\n')}

contract ${config.symbol}MultiToken is ${inheritance.join(', ')} {${roleConstants}

    constructor() ERC1155("${config.baseUri || ''}")${config.ownable && !config.roles ? ' Ownable(msg.sender)' : ''} {${constructorBody.length > 0 ? '\n        ' + constructorBody.join(';\n        ') + ';' : ''}
    }

    function setURI(string memory newuri) public ${config.roles ? 'onlyRole(URI_SETTER_ROLE)' : 'onlyOwner'} {
        _setURI(newuri);
    }
${functions.join('\n')}

    // Required overrides
    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155${config.pausable ? ', ERC1155Pausable' : ''}, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155${config.roles ? ', AccessControl' : ''})
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
`;
}

export function generateContract(config: TokenConfig): string {
  switch (config.standard) {
    case 'ERC20':
      return generateERC20Contract(config);
    case 'ERC721':
      return generateERC721Contract(config);
    case 'ERC1155':
      return generateERC1155Contract(config);
    default:
      throw new Error(`Unknown token standard: ${config.standard}`);
  }
}
