import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import GameComponent from './components/GameComponent';
import WalletButton from './components/WalletButton';
import './App.css';

// Importar estilos da wallet
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  // Configurar rede (devnet para desenvolvimento)
  const network = WalletAdapterNetwork.Devnet;
  
  // Endpoint RPC - você pode usar seu RPC personalizado aqui
  const endpoint = useMemo(() => {
    // Substitua pela sua URL RPC da QuikNode se desejar
      return "https://crimson-withered-aura.solana-devnet.quiknode.pro/d77410756a6a1e3b01afdb3a3d008812c6bba779/";
    // return clusterApiUrl(network);
  }, [network]);

  // Configurar wallets suportadas
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Header */}
            <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="text-3xl">🎮</div>
                    <h1 className="text-2xl font-bold text-white">
                      TokenPo
                    </h1>
                    <span className="text-sm text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">
                      Devnet
                    </span>
                  </div>
                  <WalletButton />
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Pedra, Papel e Tesoura na Solana
                </h2>
                <p className="text-xl text-purple-200 max-w-2xl mx-auto">
                  Pague 0.01 SOL para ter 5 jogadas e teste sua sorte contra o contrato inteligente!
                </p>
              </div>
              
              <GameComponent />
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 backdrop-blur-sm bg-white/5 mt-16">
              <div className="container mx-auto px-4 py-6">
                <div className="text-center text-purple-300">
                  <p>
                    © 2025 TokenPo. Desenvolvido com{' '}
                    <a 
                      href="https://solana.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Solana
                    </a>
                    {' '}e{' '}
                    <a 
                      href="https://www.anchor-lang.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Anchor
                    </a>
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;

