import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTokenStore, defaultConfig } from '../store/tokenStore';
import { generateContract } from '../templates/contracts';
import type { TokenConfig, TokenStandard } from '../types/token';

export default function CreateToken() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setCurrentConfig, wallet } = useTokenStore();

  const [config, setConfig] = useState<TokenConfig>({
    ...defaultConfig,
    standard: (searchParams.get('standard') as TokenStandard) || 'ERC20',
  });

  const [generatedCode, setGeneratedCode] = useState('');
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    try {
      const code = generateContract(config);
      setGeneratedCode(code);
    } catch (err) {
      setGeneratedCode('// Error generating contract');
    }
  }, [config]);

  const updateConfig = (updates: Partial<TokenConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleDeploy = () => {
    if (!config.name || !config.symbol) {
      alert('Please enter token name and symbol');
      return;
    }
    setCurrentConfig(config);
    navigate('/deploy');
  };

  const isERC20 = config.standard === 'ERC20';
  const isNFT = config.standard === 'ERC721' || config.standard === 'ERC1155';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Create Token</h1>
        <div className="flex gap-2">
          {(['ERC20', 'ERC721', 'ERC1155'] as TokenStandard[]).map((std) => (
            <button
              key={std}
              onClick={() => updateConfig({ standard: std })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                config.standard === std
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {std}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Token Name *</label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => updateConfig({ name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., My Token"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Symbol *</label>
                <input
                  type="text"
                  value={config.symbol}
                  onChange={(e) => updateConfig({ symbol: e.target.value.toUpperCase() })}
                  className="input-field"
                  placeholder="e.g., MTK"
                  maxLength={10}
                />
              </div>

              {isERC20 && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Decimals</label>
                    <input
                      type="number"
                      value={config.decimals}
                      onChange={(e) => updateConfig({ decimals: parseInt(e.target.value) || 18 })}
                      className="input-field"
                      min={0}
                      max={18}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Initial Supply</label>
                    <input
                      type="text"
                      value={config.initialSupply}
                      onChange={(e) => updateConfig({ initialSupply: e.target.value })}
                      className="input-field"
                      placeholder="e.g., 1000000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tokens will be minted to your wallet on deployment
                    </p>
                  </div>
                </>
              )}

              {isNFT && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Base URI</label>
                  <input
                    type="text"
                    value={config.baseUri}
                    onChange={(e) => updateConfig({ baseUri: e.target.value })}
                    className="input-field"
                    placeholder="https://api.example.com/metadata/"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Base URL for token metadata (IPFS or HTTP)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Features</h2>
            <div className="space-y-3">
              <FeatureToggle
                label="Mintable"
                description="Allow creating new tokens after deployment"
                checked={config.mintable}
                onChange={(checked) => updateConfig({ mintable: checked })}
              />
              <FeatureToggle
                label="Burnable"
                description="Allow holders to destroy their tokens"
                checked={config.burnable}
                onChange={(checked) => updateConfig({ burnable: checked })}
              />
              <FeatureToggle
                label="Pausable"
                description="Allow pausing all token transfers"
                checked={config.pausable}
                onChange={(checked) => updateConfig({ pausable: checked })}
              />

              {isERC20 && (
                <>
                  <FeatureToggle
                    label="Permit (EIP-2612)"
                    description="Gasless approvals via signatures"
                    checked={config.permit}
                    onChange={(checked) => updateConfig({ permit: checked })}
                  />
                  <FeatureToggle
                    label="Votes"
                    description="Enable governance voting power"
                    checked={config.votes}
                    onChange={(checked) => updateConfig({ votes: checked })}
                  />
                  <FeatureToggle
                    label="Flash Mint"
                    description="Allow flash loans of tokens"
                    checked={config.flashMint}
                    onChange={(checked) => updateConfig({ flashMint: checked })}
                  />
                  <FeatureToggle
                    label="Snapshots"
                    description="Enable balance snapshots for governance"
                    checked={config.snapshots}
                    onChange={(checked) => updateConfig({ snapshots: checked })}
                  />
                </>
              )}
            </div>
          </div>

          {/* Access Control */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Access Control</h2>
            <div className="space-y-3">
              <FeatureToggle
                label="Ownable"
                description="Single owner with admin privileges"
                checked={config.ownable && !config.roles}
                onChange={(checked) => updateConfig({ ownable: checked, roles: false })}
              />
              <FeatureToggle
                label="Role-Based (AccessControl)"
                description="Multiple roles with fine-grained permissions"
                checked={config.roles}
                onChange={(checked) => updateConfig({ roles: checked, ownable: !checked })}
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Summary</h2>
            <div className="space-y-3">
              <SummaryRow label="Standard" value={config.standard} />
              <SummaryRow label="Name" value={config.name || '-'} />
              <SummaryRow label="Symbol" value={config.symbol || '-'} />
              {isERC20 && (
                <>
                  <SummaryRow label="Decimals" value={String(config.decimals)} />
                  <SummaryRow label="Initial Supply" value={config.initialSupply || '0'} />
                </>
              )}
              <div className="pt-3 border-t border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Enabled Features</div>
                <div className="flex flex-wrap gap-1">
                  {config.mintable && <span className="badge badge-purple">Mintable</span>}
                  {config.burnable && <span className="badge badge-purple">Burnable</span>}
                  {config.pausable && <span className="badge badge-purple">Pausable</span>}
                  {config.permit && <span className="badge badge-purple">Permit</span>}
                  {config.votes && <span className="badge badge-purple">Votes</span>}
                  {config.flashMint && <span className="badge badge-purple">Flash Mint</span>}
                  {config.snapshots && <span className="badge badge-purple">Snapshots</span>}
                  {config.ownable && !config.roles && <span className="badge badge-blue">Ownable</span>}
                  {config.roles && <span className="badge badge-blue">AccessControl</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Generated Code */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Contract Code</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="btn-secondary text-sm"
                >
                  {showCode ? 'Hide' : 'Show'} Code
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(generatedCode)}
                  className="btn-secondary text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
            {showCode && (
              <pre className="code-block text-green-400 max-h-96 overflow-y-auto">
                {generatedCode}
              </pre>
            )}
            {!showCode && (
              <p className="text-gray-400 text-sm">
                Click "Show Code" to view the generated Solidity contract
              </p>
            )}
          </div>

          {/* Deploy Button */}
          <button
            onClick={handleDeploy}
            disabled={!config.name || !config.symbol}
            className="w-full btn-primary py-3 text-lg"
          >
            Continue to Deploy
          </button>

          {!wallet.connected && (
            <p className="text-center text-yellow-400 text-sm">
              Connect your wallet to deploy
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function FeatureToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={`feature-toggle ${checked ? 'feature-toggle-active' : ''}`}>
      <div>
        <div className="font-medium text-white">{label}</div>
        <div className="text-xs text-gray-400">{description}</div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
      />
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}
