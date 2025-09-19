# TokenPo - Rock Paper Scissors on Solana

Um jogo de Pedra, Papel e Tesoura desenvolvido em React que interage com um contrato inteligente na blockchain Solana usando o framework Anchor.

## 🎮 Sobre o Jogo

TokenPo é um DApp (Aplicação Descentralizada) que permite aos usuários jogar Pedra, Papel e Tesoura contra um contrato inteligente na rede Solana. O sistema implementa um modelo de pagamento onde:

- **0.01 SOL = 5 jogadas**
- Todos os pagamentos vão para uma conta de tesouraria
- Apenas o administrador pode sacar os fundos da tesouraria
- Interface moderna e responsiva com Tailwind CSS e shadcn/ui

## 🚀 Tecnologias Utilizadas

- **React 19** - Framework frontend
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **@solana/web3.js** - Biblioteca Solana
- **@solana/wallet-adapter-react** - Integração com carteiras
- **@coral-xyz/anchor** - Framework para contratos Solana
- **Lucide React** - Ícones

## 📦 Estrutura do Projeto

```
tokenpo-game/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes shadcn/ui
│   │   ├── GameComponent.jsx # Componente principal do jogo
│   │   └── WalletButton.jsx  # Botão de conexão da carteira
│   ├── idl.json            # IDL do contrato Solana
│   ├── App.jsx             # Componente raiz com providers
│   ├── App.css             # Estilos globais
│   └── main.jsx            # Entry point
├── package.json
└── README.md
```

## 🛠️ Configuração e Instalação

### Pré-requisitos

- Node.js 18+ 
- pnpm (recomendado) ou npm
- Carteira Solana (Phantom, Solflare, etc.)
- Contrato Solana deployado na devnet

### Instalação

1. **Clone ou extraia o projeto:**
   ```bash
   cd tokenpo-game
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   # ou
   npm install
   ```

3. **Configure as variáveis do contrato:**
   
   Edite o arquivo `src/components/GameComponent.jsx` e atualize:
   ```javascript
   const PROGRAM_ID = new PublicKey("SEU_PROGRAM_ID_AQUI");
   const TREASURY_PUBKEY = new PublicKey("SUA_TREASURY_KEY_AQUI");
   ```

4. **Configure o RPC (opcional):**
   
   No arquivo `src/App.jsx`, você pode usar seu RPC personalizado:
   ```javascript
   const endpoint = useMemo(() => {
     return "https://sua-url-rpc-aqui/";
     // ou use o padrão: return clusterApiUrl(network);
   }, [network]);
   ```

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   pnpm run dev --host
   # ou
   npm run dev -- --host
   ```

6. **Acesse a aplicação:**
   ```
   http://localhost:5173
   ```

## 🎯 Como Usar

### 1. Conectar Carteira
- Clique no botão "Select Wallet" no canto superior direito
- Escolha sua carteira (Phantom, Solflare, etc.)
- Aprove a conexão

### 2. Pagar por Jogadas
- Clique no botão "Pagar 0.01 SOL por 5 Jogadas"
- Confirme a transação na sua carteira
- Aguarde a confirmação na blockchain

### 3. Jogar
- Escolha entre Pedra (🪨), Papel (📄) ou Tesoura (✂️)
- Confirme a transação na sua carteira
- Veja o resultado da batalha contra o contrato

### 4. Acompanhar Estatísticas
- Saldo da carteira em SOL
- Jogadas restantes
- Total de jogadas realizadas
- Taxa de vitória

## 🔧 Configurações Avançadas

### Alterar Rede

Para usar mainnet em vez de devnet, altere em `src/App.jsx`:

```javascript
const network = WalletAdapterNetwork.Mainnet;
```

### Adicionar Mais Carteiras

Para suportar mais carteiras, adicione em `src/App.jsx`:

```javascript
import { 
  PhantomWalletAdapter, 
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter
} from '@solana/wallet-adapter-wallets';

const wallets = useMemo(
  () => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TorusWalletAdapter(),
    new LedgerWalletAdapter(),
  ],
  []
);
```

## 🚀 Deploy

### Vercel (Recomendado)

1. **Build do projeto:**
   ```bash
   pnpm run build
   ```

2. **Deploy na Vercel:**
   ```bash
   npx vercel --prod
   ```

### Netlify

1. **Build do projeto:**
   ```bash
   pnpm run build
   ```

2. **Deploy na Netlify:**
   ```bash
   npx netlify deploy --prod --dir=dist
   ```

### Outros Provedores

O projeto gera arquivos estáticos na pasta `dist/` após o build, que podem ser hospedados em qualquer servidor web.

## 🔍 Troubleshooting

### Erro de Conexão com Carteira

- Verifique se a extensão da carteira está instalada
- Certifique-se de que está na rede correta (devnet/mainnet)
- Tente desconectar e reconectar a carteira

### Erro de Transação

- Verifique se tem SOL suficiente para as taxas
- Confirme se o Program ID está correto
- Verifique se o contrato está deployado na rede correta

### Erro de Build

- Limpe o cache: `pnpm run clean` ou `rm -rf node_modules && pnpm install`
- Verifique se todas as dependências estão instaladas
- Confirme se está usando Node.js 18+

## 📝 Comandos Disponíveis

```bash
# Desenvolvimento
pnpm run dev          # Inicia servidor de desenvolvimento
pnpm run dev --host   # Inicia servidor acessível externamente

# Build
pnpm run build        # Gera build de produção
pnpm run preview      # Preview do build de produção

# Linting
pnpm run lint         # Executa ESLint
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se encontrar problemas ou tiver dúvidas:

1. Verifique a seção de Troubleshooting acima
2. Consulte a documentação do [Solana](https://docs.solana.com/)
3. Consulte a documentação do [Anchor](https://www.anchor-lang.com/)
4. Abra uma issue no repositório

---

**Desenvolvido com ❤️ para a comunidade Solana**

