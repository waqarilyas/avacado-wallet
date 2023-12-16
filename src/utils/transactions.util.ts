import {ethers, formatEther} from 'ethers';
import Toast from 'react-native-toast-message';
import {supportedChains} from './constants';
import erc20Abi from './erc20Abi.json';

const sendAllFundsERC20Transaction = async (
  provider: ethers.JsonRpcProvider,
  privateKey: string,
  tokenAddress: string,
  toAddress: string
): Promise<string | undefined> => {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);

    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, wallet);

    const senderBalance = await tokenContract.balanceOf(wallet.address);
    const formattedBalance = formatEther(senderBalance);

    if (Number(formattedBalance) <= 0) {
      console.log('No funds available to send.');

      Toast.show({
        type: 'error',
        text1: 'No funds available to send',
        text2: 'Looks like you have insufficient funds. Please try again'
      });

      return '';
    }

    const transaction = await tokenContract.transfer(toAddress, senderBalance);

    await transaction.wait();

    console.log(`Transaction successful. Hash: ${transaction.hash}`);
    return transaction.hash;
  } catch (error) {
    console.log('Error sending ERC-20 transaction:', error);
    Toast.show({
      type: 'error',
      text1: 'Something went wrong',
      text2: 'Looks like you have insufficient funds. Please try again'
    });
  }
};

const sendAllTokens = async (privateKey: string, toAddress: string) => {
  const transactionPromises: Promise<any>[] = [];

  supportedChains.forEach(async chain => {
    const provider = new ethers.JsonRpcProvider(chain.rpc);

    const tokens = chain.tokens;

    for (const token in tokens) {
      transactionPromises.push(
        sendAllFundsERC20Transaction(
          provider,
          privateKey,
          tokens[token],
          toAddress
        )
      );
    }
  });

  const transactionHashes = await Promise.all(transactionPromises);

  transactionHashes.forEach((transactionHash, index) => {
    const chain = supportedChains[index];
    const token = Object.keys(chain.tokens)[index];

    console.log(
      `Transaction hash for ${token} on ${chain.name}: ${transactionHash}`
    );
  });
};

export {sendAllFundsERC20Transaction, sendAllTokens};
