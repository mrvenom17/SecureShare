import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(
      `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`
    )
  }
});