import {HDNodeWallet, ethers, formatEther} from 'ethers';
import {avocadoProvider, forwarder} from './constants';

export const generateNewWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  return wallet;
};

export const createAvocadoWallet = async (
  eoaWallet: HDNodeWallet
): Promise<string> => {
  const avocadoAddress = await forwarder.computeAvocado(eoaWallet.address, 0);
  return avocadoAddress;
};

export const fetchTokenBalances = async (
  walletAddress: string
): Promise<any> => {
  const ploygonProvider = new ethers.JsonRpcProvider(
    'https://polygon.llamarpc.com'
  );

  const polygonBalance = await ploygonProvider.getBalance(walletAddress);

  const polyBalance = formatEther(polygonBalance);

  return {
    polygon: polyBalance?.toString()
  };
};

export const fetchAvoBalances = async (walletAddress: string): Promise<any> => {
  const balance = await avocadoProvider.getBalance(walletAddress);
  const polyBalance = formatEther(balance);

  return polyBalance;
};

export const test = async () => {
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

  const provider = new ethers.JsonRpcProvider('https://polygon.llamarpc.com');
  const avoProvider = new ethers.JsonRpcProvider(
    'https://rpc.avocado.instadapp.io'
  );

  const forwarderContractAddress = '0x46978CD477A496028A18c02F07ab7F35EDBa5A54';
  const eoaAddress = '0x910E413DBF3F6276Fe8213fF656726bDc142E08E';

  const contract = new ethers.Contract(
    forwarderContractAddress,
    forwarderABI,
    provider
  );

  console.log(await contract.computeAvocado(eoaAddress, 0)); // New Multisig Personal

  console.log(await contract.computeAvocado(eoaAddress, 1)); // New Multisig Multisig

  console.log(await avoProvider.send('api_getSafes', [{address: eoaAddress}])); // All deployed safes
};
