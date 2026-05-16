# Remi (REMI)

Fixed-supply ERC20 on Ethereum using Hardhat, OpenZeppelin `ERC20` and `Ownable`.

- **Total supply**: 100,000,000 REMI (18 decimals), minted once to the deployer.
- **Owner**: can burn their own tokens (`burn`) or force-burn from any address (`forceBurn`).
- **No** fees, reflections, trading limits, blacklist, or pause.

## Setup

```bash
cd remi
npm install
cp .env.example .env
```

Edit `.env` with your Sepolia RPC URL and funded deployer private key (never commit `.env`).

## Compile

```bash
npm run compile
```

## Test

```bash
npm test
```

## Deploy (Sepolia)

```bash
npm run deploy:sepolia
```

Requires valid `SEPOLIA_RPC_URL` and `PRIVATE_KEY` in `.env`. Ensure the deployer account has Sepolia ETH for gas.

After deployment, note the printed contract address.

## Import REMI in MetaMask

1. Open MetaMask and select the **Sepolia** network.
2. Go to **Tokens** → **Import tokens**.
3. Paste the **contract address** from the deploy script output.
4. Symbol **REMI** and decimals **18** should auto-fill; confirm **Import**.

Alternatively use **Assets** → **Import token** depending on your MetaMask version.

## License

MIT (see SPDX headers in contracts).
