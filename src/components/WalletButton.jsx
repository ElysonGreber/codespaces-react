import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';

export default function WalletButton() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="flex items-center space-x-2">
      {connected && publicKey && (
        <div className="hidden md:flex items-center space-x-2 text-sm text-purple-300">
          <Wallet className="h-4 w-4" />
          <span>
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </span>
        </div>
      )}
      
      <WalletMultiButton 
        style={{
          backgroundColor: connected ? '#10B981' : '#9333EA',
          borderRadius: '0.5rem',
          height: '2.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          border: 'none',
          transition: 'all 0.2s',
        }}
      />
    </div>
  );
}

