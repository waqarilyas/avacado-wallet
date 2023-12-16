import {ethers} from 'ethers';

const forwarderABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner_',
        type: 'address'
      },
      {
        internalType: 'uint32',
        name: 'index_',
        type: 'uint32'
      }
    ],
    name: 'computeAvocado',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

const supportedChains = [
  {
    rpc: 'https://polygon.llamarpc.com',
    chainId: 137,
    name: 'Polygon',
    tokens: {
      USDC: '0x625E7708f30cA75bfd92586e17077590C60eb4cD'
    }
  },
  {
    rpc: 'https://ethereum.publicnode.com',
    chainId: 1,
    name: 'Ethereum',
    tokens: {
      USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    }
  },
  {
    name: 'Optimism',
    rpc: 'https://mainnet.optimism.io',
    chainId: 10,
    tokens: {
      USDT: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58'
    }
  },
  {
    name: 'Arbitrum',
    rpc: 'https://arb1.arbitrum.io/rpc',
    chainId: 42161,
    tokens: {
      USDT: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9'
    }
  }
];

const contractAddresses = {
  ethereum: {
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  },
  polygon: {
    USDC: '0x625E7708f30cA75bfd92586e17077590C60eb4cD'
  }
};

const avocadoProvider = new ethers.JsonRpcProvider(
  'https://rpc.avocado.instadapp.io'
);
const polygonProvider = new ethers.JsonRpcProvider(
  'https://polygon.llamarpc.com'
);

const avoForwarderAddress = '0x46978CD477A496028A18c02F07ab7F35EDBa5A54';

const forwarder = new ethers.Contract(
  avoForwarderAddress,
  forwarderABI,
  polygonProvider
);

export {
  avocadoProvider,
  contractAddresses,
  forwarder,
  polygonProvider,
  supportedChains
};
