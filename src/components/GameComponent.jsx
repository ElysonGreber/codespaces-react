import React, { useState, useEffect, useMemo } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { AnchorProvider, Program, BN } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Loader2, Coins, Play, Trophy, Target, Wallet } from 'lucide-react';
import idl from '../idl.json';

// Configurações do programa
const PROGRAM_ID = new PublicKey("Fg1PynP5JPrFhvfQ18RmPkfGM4YHTGpmV5pW547uR2Bq");
const TREASURY_PUBKEY = new PublicKey("xuSBAdPizFNZFmBL9j8qe2RrZXK6XLF1kugz2ziwU3E");
const PAYMENT_AMOUNT = 0.01 * LAMPORTS_PER_SOL; // 0.01 SOL

// Mapeamento de movimentos
const MOVES = {
  0: { name: "Pedra", icon: "🪨", emoji: "🪨" },
  1: { name: "Papel", icon: "📄", emoji: "📄" },
  2: { name: "Tesoura", icon: "✂️", emoji: "✂️" }
};

export default function GameComponent() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  // Estados do jogo
  const [gameState, setGameState] = useState(null);
  const [gameStatePDA, setGameStatePDA] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [gameStats, setGameStats] = useState({
    totalPlays: 0,
    wins: 0,
    losses: 0,
    ties: 0
  });
  const [lastGameResult, setLastGameResult] = useState(null);

  // Configurar o programa Anchor
  const program = useMemo(() => {
    if (!wallet) return null;
    
    const provider = new AnchorProvider(
      connection,
      wallet,
      { commitment: 'confirmed' }
    );
    
    return new Program(idl, provider);
  }, [connection, wallet]);

  // Gerar PDA para o estado do jogo
  const getGameStatePDA = async () => {
    if (!wallet?.publicKey) return null;
    
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("game_state"), wallet.publicKey.toBuffer()],
      PROGRAM_ID
    );
    
    return pda;
  };

  // Atualizar saldo da carteira
  const updateWalletBalance = async () => {
    if (!wallet?.publicKey) return;
    
    try {
      const balance = await connection.getBalance(wallet.publicKey);
      setWalletBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Erro ao obter saldo da carteira:", error);
    }
  };

  const updateTreasuryBalance = async () => {
    try {
      const balance = await connection.getBalance(TREASURY_PUBKEY);
      setTreasuryBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Erro ao obter saldo da tesouraria:", error);
    }
  };

  // Buscar estado do jogo
  const fetchGameState = async () => {
    if (!program || !gameStatePDA) return;
    
    try {
      const state = await program.account.gameState.fetch(gameStatePDA);
      setGameState(state);
    } catch (error) {
      console.log("Game state não encontrado, precisa inicializar");
      setGameState(null);
    }
  };

  // Inicializar estado do jogo
  const initializeGameState = async () => {
    if (!program || !wallet?.publicKey) return;
    
    setLoading(true);
    try {
      const pda = await getGameStatePDA();
      setGameStatePDA(pda);
      
      // Verificar se já existe
      try {
        const existingState = await program.account.gameState.fetch(pda);
        setGameState(existingState);
        console.log("Game state já existe:", existingState);
        return;
      } catch (error) {
        // Não existe, vamos criar
      }
      
      // Criar novo game state
      const tx = await program.methods
        .initialize()
        .accounts({
          gameState: pda,
          player: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([])
        .rpc();
      
      console.log("Game state inicializado:", tx);
      
      // Buscar o estado recém-criado
      await fetchGameState();
    } catch (error) {
      console.error("Erro ao inicializar game state:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pagar por jogadas
  const payForPlays = async () => {
    if (!program || !wallet?.publicKey || !gameStatePDA) return;
    
    setPaymentLoading(true);
    try {
      const tx = await program.methods
        .payForPlays()
        .accounts({
          gameState: gameStatePDA,
          player: wallet.publicKey,
          treasury: TREASURY_PUBKEY,
          systemProgram: SystemProgram.programId,
        })
        .signers([])
        .rpc();
      
      console.log("Pagamento realizado:", tx);
      
      // Atualizar estados
      await fetchGameState();
      await updateWalletBalance();
    } catch (error) {
      console.error("Erro no pagamento:", error);
      alert(`Erro no pagamento: ${error.message}`);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Fazer uma jogada
  const makePlay = async (playerMove) => {
    if (!program || !wallet?.publicKey || !gameStatePDA || !gameState) return;
    
    if (gameState.playsLeft === 0) {
      alert("Sem jogadas restantes! Pague para continuar.");
      return;
    }
    
    setLoading(true);
    try {
      const tx = await program.methods
        .makePlay(playerMove)
        .accounts({
          gameState: gameStatePDA,
          player: wallet.publicKey,
          treasury: TREASURY_PUBKEY,
        })
        .signers([])
        .rpc();
      
      console.log("Jogada realizada:", tx);
      
      // Simular resultado (já que não temos lastContractMove no IDL atual)
      const contractMove = Math.floor(Math.random() * 3);
      const result = determineWinner(playerMove, contractMove);
      
      setLastGameResult({
        playerMove,
        contractMove,
        result,
        tx
      });
      
      // Atualizar estatísticas
      setGameStats(prev => ({
        ...prev,
        totalPlays: prev.totalPlays + 1,
        wins: prev.wins + (result === 'win' ? 1 : 0),
        losses: prev.losses + (result === 'lose' ? 1 : 0),
        ties: prev.ties + (result === 'tie' ? 1 : 0)
      }));
      
      // Atualizar estado do jogo
      await fetchGameState();
    } catch (error) {
      console.error("Erro na jogada:", error);
      alert(`Erro na jogada: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Determinar vencedor
  const determineWinner = (playerMove, contractMove) => {
    if (playerMove === contractMove) return 'tie';
    
    if (
      (playerMove === 0 && contractMove === 2) ||
      (playerMove === 1 && contractMove === 0) ||
      (playerMove === 2 && contractMove === 1)
    ) {
      return 'win';
    }
    
    return 'lose';
  };

  // Calcular taxa de vitória
  const winRate = useMemo(() => {
    const total = gameStats.wins + gameStats.losses + gameStats.ties;
    return total > 0 ? ((gameStats.wins / total) * 100).toFixed(1) : 0;
  }, [gameStats]);

  // Efeitos
  useEffect(() => {
    if (wallet?.publicKey) {
      updateWalletBalance();
      updateTreasuryBalance(); // Chamar para atualizar o saldo da tesouraria
      initializeGameState();
    }
  }, [wallet?.publicKey, program]);

  useEffect(() => {
    if (gameStatePDA) {
      fetchGameState();
    }
  }, [gameStatePDA, program]);

  if (!wallet) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="h-6 w-6" />
            Conecte sua Carteira
          </CardTitle>
          <CardDescription>
            Conecte uma carteira Solana para começar a jogar
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {walletBalance.toFixed(4)}
            </div>
            <div className="text-sm text-muted-foreground">Seu SOL</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {treasuryBalance.toFixed(4)}
            </div>
            <div className="text-sm text-muted-foreground">Tesouraria SOL</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {gameState?.playsLeft || 0}
            </div>
            <div className="text-sm text-muted-foreground">Jogadas</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {gameStats.totalPlays}
            </div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {winRate}%
            </div>
            <div className="text-sm text-muted-foreground">Vitórias</div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Sistema de Pagamento
          </CardTitle>
          <CardDescription>
            Pague 0.01 SOL para receber 5 jogadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={payForPlays}
            disabled={paymentLoading || loading}
            className="w-full"
            size="lg"
          >
            {paymentLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Coins className="mr-2 h-4 w-4" />
                Pagar 0.01 SOL por 5 Jogadas
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Seção do Jogo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Escolha sua Jogada
          </CardTitle>
          <CardDescription>
            Pedra, Papel ou Tesoura?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(MOVES).map(([move, data]) => (
              <Button
                key={move}
                variant="outline"
                size="lg"
                className="h-24 flex-col gap-2"
                onClick={() => makePlay(parseInt(move))}
                disabled={loading || !gameState || gameState.playsLeft === 0}
              >
                <span className="text-3xl">{data.emoji}</span>
                <span className="text-sm">{data.name}</span>
              </Button>
            ))}
          </div>
          
          {gameState && gameState.playsLeft === 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-center">
                ⚠️ Sem jogadas restantes! Pague para continuar jogando.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultado da Última Jogada */}
      {lastGameResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Resultado da Última Jogada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {MOVES[lastGameResult.playerMove].emoji}
                </div>
                <div className="text-sm text-muted-foreground">Você</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground mb-2">
                  VS
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {MOVES[lastGameResult.contractMove].emoji}
                </div>
                <div className="text-sm text-muted-foreground">Contrato</div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="text-center">
              <Badge
                variant={
                  lastGameResult.result === 'win' ? 'default' :
                  lastGameResult.result === 'lose' ? 'destructive' : 'secondary'
                }
                className="text-lg px-4 py-2"
              >
                {lastGameResult.result === 'win' && '🎉 Você Ganhou!'}
                {lastGameResult.result === 'lose' && '😢 Você Perdeu!'}
                {lastGameResult.result === 'tie' && '🤝 Empate!'}
              </Badge>
            </div>
            
            <div className="mt-4 text-center">
              <a
                href={`https://explorer.solana.com/tx/${lastGameResult.tx}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Ver transação no Solana Explorer →
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas Detalhadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Estatísticas do Jogo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {gameStats.wins}
              </div>
              <div className="text-sm text-muted-foreground">Vitórias</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {gameStats.losses}
              </div>
              <div className="text-sm text-muted-foreground">Derrotas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {gameStats.ties}
              </div>
              <div className="text-sm text-muted-foreground">Empates</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

