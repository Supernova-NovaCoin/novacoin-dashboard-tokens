import { Outlet, NavLink, Link } from 'react-router-dom';
import { useTokenStore } from '../store/tokenStore';

export default function Layout() {
  const { wallet, connectWallet, disconnectWallet } = useTokenStore();

  const formatAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🪙</span>
              <div>
                <h1 className="text-xl font-bold text-purple-400">NovaCoin</h1>
                <p className="text-xs text-gray-400">Token Factory</p>
              </div>
            </Link>

            <nav className="flex gap-1">
              <NavItem to="/" label="Home" end />
              <NavItem to="/create" label="Create Token" />
              <NavItem to="/my-tokens" label="My Tokens" />
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {wallet.connected ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-mono text-purple-400">
                    {formatAddress(wallet.address || '')}
                  </div>
                  <div className="text-xs text-gray-500">
                    Chain ID: {wallet.chainId}
                  </div>
                </div>
                <button onClick={disconnectWallet} className="btn-secondary text-sm">
                  Disconnect
                </button>
              </div>
            ) : (
              <button onClick={connectWallet} className="btn-primary">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          NovaCoin Token Factory v1.0.0 | Create and deploy tokens on NovaCoin
        </div>
      </footer>
    </div>
  );
}

function NavItem({ to, label, end }: { to: string; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-purple-600/20 text-purple-400'
            : 'text-gray-400 hover:text-white hover:bg-gray-700'
        }`
      }
    >
      {label}
    </NavLink>
  );
}
