import {HDNodeWallet, ethers} from 'ethers';

const avoProvider = new ethers.JsonRpcProvider(
  'https://rpc.avocado.instadapp.io'
);

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

export const generateNewWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  return wallet;
};

export const createAvocadoWallet = async (
  eoaWallet: HDNodeWallet
): Promise<string> => {
  const forwarderContractAddress = '0x46978CD477A496028A18c02F07ab7F35EDBa5A54'; // Replace with the actual address

  const provider = new ethers.JsonRpcProvider('https://polygon.llamarpc.com');

  const forwarderContract = new ethers.Contract(
    forwarderContractAddress,
    forwarderABI,
    provider
  );

  const avocadoAddress = await forwarderContract.computeAvocado(
    eoaWallet.address,
    0
  );

  return avocadoAddress;
};

export const fetchTokenBalances = async (
  walletAddress: string
): Promise<any> => {
  const ploygonProvider = new ethers.JsonRpcProvider(
    'https://polygon.llamarpc.com'
  );
  const daiProvider = new ethers.JsonRpcProvider('https://rpc.gnosischain.com');

  const optProvider = new ethers.JsonRpcProvider(
    'https://optimism.llamarpc.com	'
  );

  const polygonBalance = await ploygonProvider.getBalance(walletAddress);
  const daiBalance = await daiProvider.getBalance(walletAddress);
  const optBalance = await optProvider.getBalance(walletAddress);

  // const avoBalance = await avoProvider.getBalance(walletAddress);
  // console.log('🚀 ~ file: wallet.util.ts:77 ~ avoBalance:', avoBalance);
  return {
    polygon: polygonBalance?.toString(),
    dai: daiBalance?.toString(),
    opt: optBalance?.toString()
  };
};
