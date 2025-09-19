# 🚀 Guia de Configuração Completo - TokenPo

## 📋 Pré-requisitos

### 1. Ambiente de Desenvolvimento

- **Node.js 18+**: [Download aqui](https://nodejs.org/)
- **pnpm** (recomendado): `npm install -g pnpm`
- **Git**: Para controle de versão
- **Editor de código**: VS Code recomendado

### 2. Carteira Solana

- **Phantom**: [Instalar extensão](https://phantom.app/)
- **Solflare**: [Instalar extensão](https://solflare.com/)
- Ou qualquer carteira compatível com Wallet Adapter

### 3. Contrato Solana

- Contrato deployado na devnet ou mainnet
- Program ID do contrato
- Chave pública da conta de tesouraria

## 🛠️ Configuração Inicial

### Passo 1: Preparar o Projeto

```bash
# Se você recebeu um arquivo ZIP
unzip tokenpo-game.zip
cd tokenpo-game

# Ou se clonou de um repositório
git clone <repository-url>
cd tokenpo-game
```

### Passo 2: Instalar Dependências

```bash
# Usando pnpm (recomendado)
pnpm install

# Ou usando npm
npm install

# Ou usando yarn
yarn install
```

### Passo 3: Configurar Variáveis do Contrato

Edite o arquivo `src/components/GameComponent.jsx`:

```javascript
// Linha ~15-16
const PROGRAM_ID = new PublicKey("Fg1PynP5JPrFhvfQ18RmPkfGM4YHTGpmV5pW547uR2Bq");
const TREASURY_PUBKEY = new PublicKey("TREASURY_PUBLIC_KEY_AQUI");
```

**Substitua:**
- `Fg1PynP5JPrFhvfQ18RmPkfGM4YHTGpmV5pW547uR2Bq` pelo seu Program ID
- `TREASURY_PUBLIC_KEY_AQUI` pela chave pública da sua conta de tesouraria

### Passo 4: Configurar RPC (Opcional)

Se você tem um RPC personalizado (como QuikNode), edite `src/App.jsx`:

```javascript
// Linha ~13-17
const endpoint = useMemo(() => {
  // Descomente e substitua pela sua URL RPC
  // return "https://sua-url-rpc-personalizada/";
  
  // Ou use o RPC padrão da Solana
  return clusterApiUrl(network);
}, [network]);
```

### Passo 5: Configurar Rede

Para alterar entre devnet e mainnet, edite `src/App.jsx`:

```javascript
// Linha ~11
const network = WalletAdapterNetwork.Devnet; // ou Mainnet
```

## 🧪 Testando Localmente

### Iniciar Servidor de Desenvolvimento

```bash
# Servidor local (apenas localhost)
pnpm run dev

# Servidor acessível na rede local
pnpm run dev --host
```

### Acessar a Aplicação

- **Local**: http://localhost:5173
- **Rede local**: http://[seu-ip]:5173

### Testar Funcionalidades

1. **Conectar Carteira**:
   - Clique em "Select Wallet"
   - Escolha sua carteira
   - Aprove a conexão

2. **Verificar Saldo**:
   - O saldo deve aparecer no card superior esquerdo
   - Certifique-se de ter SOL para as taxas

3. **Testar Pagamento**:
   - Clique em "Pagar 0.01 SOL por 5 Jogadas"
   - Confirme na carteira
   - Verifique se as jogadas foram creditadas

4. **Fazer Jogadas**:
   - Escolha Pedra, Papel ou Tesoura
   - Confirme a transação
   - Veja o resultado

## 🔧 Configurações Avançadas

### Adicionar Mais Carteiras

Edite `src/App.jsx` para suportar mais carteiras:

```javascript
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  Coin98WalletAdapter,
  SlopeWalletAdapter,
} from '@solana/wallet-adapter-wallets';

const wallets = useMemo(
  () => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TorusWalletAdapter(),
    new LedgerWalletAdapter(),
    new MathWalletAdapter(),
    new Coin98WalletAdapter(),
    new SlopeWalletAdapter(),
  ],
  []
);
```

### Personalizar Estilos

Os estilos estão em `src/App.css`. Você pode:

- Alterar cores do tema
- Modificar animações
- Customizar componentes da wallet

### Configurar Commitment Level

Para transações mais rápidas ou mais seguras, edite `src/components/GameComponent.jsx`:

```javascript
const provider = new AnchorProvider(
  connection,
  wallet,
  { 
    commitment: 'confirmed' // ou 'processed', 'finalized'
  }
);
```

## 🚀 Deploy em Produção

### Preparar Build

```bash
# Gerar build de produção
pnpm run build

# Testar build localmente
pnpm run preview
```

### Deploy na Vercel

1. **Instalar Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Fazer Deploy**:
   ```bash
   vercel --prod
   ```

3. **Configurar Domínio** (opcional):
   - Acesse o dashboard da Vercel
   - Configure seu domínio personalizado

### Deploy na Netlify

1. **Instalar Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Fazer Deploy**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

### Deploy Manual

1. **Gerar Build**:
   ```bash
   pnpm run build
   ```

2. **Upload da pasta `dist/`**:
   - FTP/SFTP para seu servidor
   - Ou use qualquer serviço de hospedagem estática

## 🔍 Troubleshooting Detalhado

### Problema: Carteira não conecta

**Possíveis causas:**
- Extensão não instalada
- Rede incorreta na carteira
- Bloqueador de popup ativo

**Soluções:**
1. Instale a extensão da carteira
2. Configure a carteira para devnet/mainnet
3. Desabilite bloqueadores de popup
4. Recarregue a página

### Problema: Transação falha

**Possíveis causas:**
- SOL insuficiente para taxas
- Program ID incorreto
- Contrato não deployado
- Rede incorreta

**Soluções:**
1. Adicione SOL à carteira
2. Verifique o Program ID
3. Confirme se o contrato está deployado
4. Verifique se está na rede correta

### Problema: Build falha

**Possíveis causas:**
- Dependências desatualizadas
- Cache corrompido
- Versão do Node.js incompatível

**Soluções:**
1. Limpe o cache:
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```
2. Atualize o Node.js para 18+
3. Verifique se todas as dependências estão instaladas

### Problema: Erro de CORS

**Possíveis causas:**
- RPC não permite CORS
- Configuração de rede incorreta

**Soluções:**
1. Use um RPC que suporte CORS
2. Configure proxy no Vite se necessário
3. Use o RPC padrão da Solana

## 📊 Monitoramento e Analytics

### Logs de Desenvolvimento

Durante o desenvolvimento, monitore:
- Console do navegador para erros
- Network tab para requisições
- Solana Explorer para transações

### Logs de Produção

Para produção, considere:
- Sentry para error tracking
- Google Analytics para usage
- Custom logging para transações

## 🔐 Segurança

### Boas Práticas

1. **Nunca exponha chaves privadas**
2. **Use HTTPS em produção**
3. **Valide todas as entradas**
4. **Mantenha dependências atualizadas**

### Auditoria

Antes do deploy em mainnet:
1. Audite o contrato Solana
2. Teste extensivamente na devnet
3. Faça code review do frontend
4. Teste com diferentes carteiras

## 📈 Otimização

### Performance

- Use `useMemo` para cálculos pesados
- Implemente lazy loading se necessário
- Otimize imagens e assets
- Configure cache adequadamente

### Bundle Size

```bash
# Analisar bundle size
pnpm run build
npx vite-bundle-analyzer dist
```

### SEO

- Configure meta tags apropriadas
- Use títulos descritivos
- Adicione structured data se relevante

## 🆘 Suporte

### Recursos Úteis

- [Documentação Solana](https://docs.solana.com/)
- [Documentação Anchor](https://www.anchor-lang.com/)
- [Wallet Adapter Docs](https://github.com/solana-labs/wallet-adapter)
- [React Docs](https://react.dev/)

### Comunidade

- [Solana Discord](https://discord.gg/solana)
- [Anchor Discord](https://discord.gg/anchor)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/solana)

---

**🎉 Parabéns! Seu TokenPo está pronto para o mundo!**

