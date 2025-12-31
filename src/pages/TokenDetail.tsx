import { useParams, Link } from 'react-router-dom';
import { useTokenStore } from '../store/tokenStore';

export default function TokenDetail() {
  const { address } = useParams<{ address: string }>();
  const { deployedTokens, updateTokenVerification } = useTokenStore();

  const token = deployedTokens.find((t) => t.address === address);

  if (!token) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">❓</div>
        <h2 className="text-xl font-semibold text-white mb-2">Token Not Found</h2>
        <p className="text-gray-400 mb-6">
          This token doesn't exist in your deployed tokens list
        </p>
        <Link to="/my-tokens" className="btn-primary">
          View My Tokens
        </Link>
      </div>
    );
  }

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleVerify = async () => {
    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 2000));
    updateTokenVerification(token.address, true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/my-tokens" className="text-gray-400 hover:text-white">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-white">{token.name}</h1>
          <span className="badge badge-purple">{token.standard}</span>
          {token.verified && <span className="badge badge-green">Verified</span>}
        </div>
        <a
          href={`https://explorer.novacoin.io/token/${token.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          View on Explorer →
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contract Address */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Contract Address</h2>
            <div className="flex items-center gap-3 bg-gray-700/50 rounded-lg p-3">
              <code className="flex-1 text-purple-400 font-mono break-all">
                {token.address}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(token.address)}
                className="btn-secondary text-sm"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Token Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Name" value={token.name} />
              <DetailRow label="Symbol" value={token.symbol} />
              <DetailRow label="Standard" value={token.standard} />
              {token.decimals !== undefined && (
                <DetailRow label="Decimals" value={String(token.decimals)} />
              )}
              <DetailRow label="Network" value={token.network} />
              <DetailRow label="Deployed" value={formatDate(token.deployedAt)} />
            </div>
          </div>

          {/* Features */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Features</h2>
            {token.features.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {token.features.map((feature) => (
                  <span key={feature} className="badge badge-purple">
                    {feature}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No special features enabled</p>
            )}
          </div>

          {/* Transaction */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Deployment Transaction</h2>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-1">Transaction Hash</div>
              <code className="text-purple-400 font-mono text-sm break-all">
                {token.txHash}
              </code>
            </div>
            <div className="mt-3 text-sm text-gray-400">
              Deployed by: <code className="text-purple-400">{token.deployer}</code>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Verification */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Contract Verification</h2>
            {token.verified ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">✅</div>
                <div className="text-green-400 font-medium">Contract Verified</div>
                <p className="text-sm text-gray-400 mt-2">
                  Source code is verified on the explorer
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">📝</div>
                <div className="text-yellow-400 font-medium mb-2">Not Verified</div>
                <p className="text-sm text-gray-400 mb-4">
                  Verify your contract to show source code on the explorer
                </p>
                <button onClick={handleVerify} className="btn-primary w-full">
                  Verify Contract
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <a
                href={`https://explorer.novacoin.io/token/${token.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full btn-secondary text-center"
              >
                View on Explorer
              </a>
              <a
                href={`https://explorer.novacoin.io/token/${token.address}#code`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full btn-secondary text-center"
              >
                View Contract Code
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(token.address)}
                className="w-full btn-secondary"
              >
                Copy Address
              </button>
            </div>
          </div>

          {/* Add to Wallet */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Add to Wallet</h2>
            <p className="text-sm text-gray-400 mb-4">
              Add this token to your wallet to track your balance
            </p>
            <button className="w-full btn-primary">
              Add to MetaMask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-white font-medium">{value}</div>
    </div>
  );
}
