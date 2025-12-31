import { Link } from 'react-router-dom';

export default function Home() {
  const tokenTypes = [
    {
      standard: 'ERC20',
      name: 'Fungible Token',
      description: 'Create currencies, utility tokens, or governance tokens',
      icon: '🪙',
      features: ['Mintable', 'Burnable', 'Pausable', 'Permit', 'Votes', 'Snapshots'],
      useCase: 'Currencies, DeFi, Governance',
    },
    {
      standard: 'ERC721',
      name: 'NFT Collection',
      description: 'Create unique, non-fungible tokens for collectibles or assets',
      icon: '🎨',
      features: ['Mintable', 'Burnable', 'Pausable', 'URI Storage', 'Enumerable'],
      useCase: 'Art, Collectibles, Gaming Items',
    },
    {
      standard: 'ERC1155',
      name: 'Multi-Token',
      description: 'Create both fungible and non-fungible tokens in one contract',
      icon: '📦',
      features: ['Mintable', 'Burnable', 'Pausable', 'Batch Operations', 'Supply Tracking'],
      useCase: 'Gaming, Mixed Assets, Editions',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Create Tokens on <span className="text-gradient">NovaCoin</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Deploy ERC-20, ERC-721, and ERC-1155 tokens with customizable features.
          No coding required.
        </p>
      </div>

      {/* Token Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tokenTypes.map((type) => (
          <div key={type.standard} className="card p-6 hover:border-purple-500/50 transition-colors">
            <div className="text-4xl mb-4">{type.icon}</div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-semibold text-white">{type.name}</h2>
              <span className="badge badge-purple">{type.standard}</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">{type.description}</p>

            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">Available Features</div>
              <div className="flex flex-wrap gap-1">
                {type.features.map((feature) => (
                  <span key={feature} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-4">
              <span className="font-medium">Use cases:</span> {type.useCase}
            </div>

            <Link
              to={`/create?standard=${type.standard}`}
              className="block w-full btn-primary text-center"
            >
              Create {type.standard}
            </Link>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="card p-8">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Why Use NovaCoin Token Factory?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Feature
            icon="⚡"
            title="Fast & Cheap"
            description="Deploy tokens in seconds with minimal gas fees on NovaCoin"
          />
          <Feature
            icon="🔒"
            title="Secure"
            description="OpenZeppelin-based contracts with battle-tested security"
          />
          <Feature
            icon="🎛️"
            title="Customizable"
            description="Toggle features like minting, burning, pausing, and more"
          />
          <Feature
            icon="✅"
            title="Verified"
            description="Automatic source code verification on the explorer"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Tokens Created" value="1,234" />
        <Stat label="Total Value Locked" value="$12.5M" />
        <Stat label="Active Users" value="567" />
        <Stat label="Gas Saved" value="89%" />
      </div>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-2xl font-bold text-purple-400">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}
