import {HDNodeWallet, ethers, formatEther} from 'ethers';
import {avocadoProvider, forwarder, supportedChains} from './constants';

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

export const fetchAvoBalances = async (walletAddress: string): Promise<any> => {
  const balance = await avocadoProvider.getBalance(walletAddress);
  const polyBalance = formatEther(balance);

  return polyBalance;
};

export const fetchAccountErc20Balances = async (
  walletAddress: string
): Promise<{[tokenName: string]: string}> => {
  const balances: {[tokenName: string]: string} = {};

  for (const chain of supportedChains) {
    const provider = new ethers.JsonRpcProvider(chain.rpc);

    const tokens = chain.tokens;

    for (const tokenName of Object.keys(tokens)) {
      const tokenContract = new ethers.Contract(
        tokens[tokenName],
        ['function balanceOf(address account) view returns (uint256)'],
        provider
      );

      const senderBalance = await tokenContract.balanceOf(walletAddress);
      const formattedBalance = formatEther(senderBalance);

      console.log(
        `Balance for ${tokenName} on ${chain.name}: ${formattedBalance}`
      );

      balances[`${chain.name}-${tokenName}`] = formattedBalance;
    }
  }

  return balances;
};
