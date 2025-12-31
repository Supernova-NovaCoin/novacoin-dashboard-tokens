import { Link } from 'react-router-dom';
import { useTokenStore } from '../store/tokenStore';

export default function MyTokens() {
  const { deployedTokens, wallet } = useTokenStore();

  const formatAddress = (addr: string): string => {
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!wallet.connected) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">🔗</div>
        <h2 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-gray-400 mb-6">
          Connect your wallet to view your deployed tokens
        </p>
      </div>
    );
  }

  if (deployedTokens.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">🪙</div>
        <h2 className="text-xl font-semibold text-white mb-2">No Tokens Yet</h2>
        <p className="text-gray-400 mb-6">
          You haven't deployed any tokens yet. Create your first token!
        </p>
        <Link to="/create" className="btn-primary">
          Create Token
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">My Tokens</h1>
        <Link to="/create" className="btn-primary">
          Create New Token
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-2xl font-bold text-purple-400">{deployedTokens.length}</div>
          <div className="text-sm text-gray-400">Total Tokens</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-green-400">
            {deployedTokens.filter((t) => t.verified).length}
          </div>
          <div className="text-sm text-gray-400">Verified</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-blue-400">
            {deployedTokens.filter((t) => t.network === 'mainnet').length}
          </div>
          <div className="text-sm text-gray-400">On Mainnet</div>
        </div>
      </div>

      {/* Token List */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Token</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Standard</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Address</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Network</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Deployed</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {deployedTokens.map((token) => (
              <tr key={token.id} className="hover:bg-gray-800/50">
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium text-white">{token.name}</div>
                    <div className="text-sm text-gray-400">{token.symbol}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="badge badge-purple">{token.standard}</span>
                </td>
                <td className="px-4 py-3">
                  <code className="text-sm text-purple-400 font-mono">
                    {formatAddress(token.address)}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${token.network === 'mainnet' ? 'badge-green' : 'badge-yellow'}`}>
                    {token.network}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">
                  {formatDate(token.deployedAt)}
                </td>
                <td className="px-4 py-3">
                  {token.verified ? (
                    <span className="badge badge-green">Verified</span>
                  ) : (
                    <span className="badge badge-yellow">Unverified</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      to={`/token/${token.address}`}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      View
                    </Link>
                    <a
                      href={`https://explorer.novacoin.io/token/${token.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Explorer →
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
