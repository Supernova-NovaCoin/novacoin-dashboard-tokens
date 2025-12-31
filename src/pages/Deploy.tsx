import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTokenStore } from '../store/tokenStore';
import { generateContract } from '../templates/contracts';
import type { DeploymentStep, DeployedToken } from '../types/token';

export default function Deploy() {
  const navigate = useNavigate();
  const { currentConfig, wallet, addDeployedToken, connectWallet } = useTokenStore();

  const [steps, setSteps] = useState<DeploymentStep[]>([
    { id: 'compile', title: 'Compiling Contract', status: 'pending' },
    { id: 'estimate', title: 'Estimating Gas', status: 'pending' },
    { id: 'confirm', title: 'Confirm Transaction', status: 'pending' },
    { id: 'deploy', title: 'Deploying Contract', status: 'pending' },
    { id: 'verify', title: 'Verifying Contract', status: 'pending' },
  ]);

  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gasEstimate, setGasEstimate] = useState<string>('0.05');

  useEffect(() => {
    if (!currentConfig) {
      navigate('/create');
    }
  }, [currentConfig, navigate]);

  if (!currentConfig) {
    return null;
  }

  const generatedCode = generateContract(currentConfig);

  const updateStep = (id: string, status: DeploymentStep['status'], error?: string, txHash?: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, status, error, txHash } : step
      )
    );
  };

  const simulateDeploy = async () => {
    if (!wallet.connected) {
      await connectWallet();
      if (!useTokenStore.getState().wallet.connected) {
        setError('Please connect your wallet to deploy');
        return;
      }
    }

    setError(null);

    // Simulate compilation
    updateStep('compile', 'in_progress');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    updateStep('compile', 'completed');

    // Simulate gas estimation
    updateStep('estimate', 'in_progress');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setGasEstimate((Math.random() * 0.05 + 0.02).toFixed(4));
    updateStep('estimate', 'completed');

    // Simulate user confirmation
    updateStep('confirm', 'in_progress');
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateStep('confirm', 'completed');

    // Simulate deployment
    updateStep('deploy', 'in_progress');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const mockAddress = `0x${Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;
    const mockTxHash = `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;
    updateStep('deploy', 'completed', undefined, mockTxHash);
    setDeployedAddress(mockAddress);

    // Simulate verification
    updateStep('verify', 'in_progress');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    updateStep('verify', 'completed');

    // Add to deployed tokens
    const features: string[] = [];
    if (currentConfig.mintable) features.push('Mintable');
    if (currentConfig.burnable) features.push('Burnable');
    if (currentConfig.pausable) features.push('Pausable');
    if (currentConfig.permit) features.push('Permit');
    if (currentConfig.votes) features.push('Votes');

    const newToken: DeployedToken = {
      id: Date.now().toString(),
      address: mockAddress,
      standard: currentConfig.standard,
      name: currentConfig.name,
      symbol: currentConfig.symbol,
      decimals: currentConfig.decimals,
      deployedAt: Date.now(),
      deployer: wallet.address || '',
      txHash: mockTxHash,
      network: wallet.chainId === 1 ? 'mainnet' : 'testnet',
      verified: true,
      features,
    };

    addDeployedToken(newToken);
  };

  const currentStep = steps.find((s) => s.status === 'in_progress');
  const isComplete = steps.every((s) => s.status === 'completed');
  const hasError = steps.some((s) => s.status === 'error');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Deploy Token</h1>

      {/* Token Summary */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Token Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400">Name</div>
            <div className="text-white font-medium">{currentConfig.name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Symbol</div>
            <div className="text-white font-medium">{currentConfig.symbol}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Standard</div>
            <div className="text-white font-medium">{currentConfig.standard}</div>
          </div>
          {currentConfig.standard === 'ERC20' && (
            <div>
              <div className="text-sm text-gray-400">Initial Supply</div>
              <div className="text-white font-medium">{currentConfig.initialSupply}</div>
            </div>
          )}
        </div>
      </div>

      {/* Deployment Steps */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Deployment Progress</h2>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                  step.status === 'completed'
                    ? 'bg-green-600 text-white'
                    : step.status === 'in_progress'
                    ? 'bg-purple-600 text-white animate-pulse'
                    : step.status === 'error'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {step.status === 'completed' ? '✓' : step.status === 'error' ? '✗' : index + 1}
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">{step.title}</div>
                {step.status === 'in_progress' && (
                  <div className="text-sm text-purple-400">Processing...</div>
                )}
                {step.status === 'error' && (
                  <div className="text-sm text-red-400">{step.error}</div>
                )}
                {step.txHash && (
                  <div className="text-xs text-gray-400 font-mono">
                    TX: {step.txHash.slice(0, 20)}...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gas Estimate */}
      {steps[1].status === 'completed' && (
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Estimated Gas Cost</div>
              <div className="text-xl font-bold text-white">{gasEstimate} NOVA</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Network</div>
              <div className="text-white">{wallet.chainId === 1 ? 'Mainnet' : 'Testnet'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Success */}
      {isComplete && deployedAddress && (
        <div className="card p-6 border-green-500/50">
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-xl font-semibold text-white mb-2">Token Deployed Successfully!</h2>
            <p className="text-gray-400 mb-4">Your token is now live on the NovaCoin network</p>
            <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
              <div className="text-sm text-gray-400 mb-1">Contract Address</div>
              <code className="text-purple-400 font-mono break-all">{deployedAddress}</code>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate(`/token/${deployedAddress}`)}
                className="btn-primary"
              >
                View Token
              </button>
              <a
                href={`https://explorer.novacoin.io/token/${deployedAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                View on Explorer →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {!isComplete && !hasError && (
        <div className="flex gap-4">
          <button onClick={() => navigate('/create')} className="flex-1 btn-secondary">
            ← Back to Edit
          </button>
          <button
            onClick={simulateDeploy}
            disabled={!!currentStep}
            className="flex-1 btn-primary"
          >
            {currentStep ? 'Deploying...' : 'Deploy Token'}
          </button>
        </div>
      )}

      {/* Contract Code Preview */}
      <details className="card">
        <summary className="p-4 cursor-pointer text-gray-400 hover:text-white">
          View Generated Contract Code
        </summary>
        <div className="p-4 pt-0">
          <pre className="code-block text-green-400 text-xs max-h-96 overflow-y-auto">
            {generatedCode}
          </pre>
        </div>
      </details>
    </div>
  );
}
