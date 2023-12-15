import {HDNodeWallet, ethers} from 'ethers';
import {forwarder} from './constants';

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
  const daiProvider = new ethers.JsonRpcProvider('https://rpc.gnosischain.com');

  const optProvider = new ethers.JsonRpcProvider(
    'https://optimism.llamarpc.com	'
  );

  const polygonBalance = await ploygonProvider.getBalance(walletAddress);
  const daiBalance = await daiProvider.getBalance(walletAddress);
  const optBalance = await optProvider.getBalance(walletAddress);

  // console.log('🚀 ~ file: wallet.util.ts:77 ~ avoBalance:', avoBalance);
  return {
    polygon: polygonBalance?.toString(),
    dai: daiBalance?.toString(),
    opt: optBalance?.toString()
  };
};
