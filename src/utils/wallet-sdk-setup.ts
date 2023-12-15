import {createSafe, setRpcUrls} from '@instadapp/avocado';
import {Wallet, ethers} from 'ethers';
import {avocadoProvider} from './constants';
import {ToastAndroid} from 'react-native';

setRpcUrls({
  137: 'https://polygon-rpc.com'
});

export const sendSdkTransaction = async ({
  privateKey,
  erc20ContractAddresses
}: {
  privateKey: string;
  erc20ContractAddresses: string[];
}) => {
  try {
    const wallet = new Wallet(privateKey, avocadoProvider);
    //@ts-ignore
    const safe = createSafe(wallet);
    console.log('🚀 ~ file: wallet-sdk-setup.ts:20 ~ safe:', safe);
    const balance = await avocadoProvider.getBalance(wallet.address);
    console.log('🚀 ~ file: wallet-sdk-setup.ts:22 ~ balance:', balance);

    const avocadoWalletAddress = await safe.getSafeAddress();

    for (const erc20ContractAddress of erc20ContractAddresses) {
      const erc20 = new ethers.Contract(
        erc20ContractAddress,
        ['function transfer(address to, uint256 amount) returns (bool)'],
        wallet
      );

      const erc20Balance = await erc20.balanceOf(wallet.address);
      console.log(
        `ERC20 balance for ${erc20ContractAddress}: ${erc20Balance.toString()}`
      );

      if (erc20Balance.gt(0)) {
        const tx = await erc20.transfer(avocadoWalletAddress, erc20Balance);
        await tx.wait();
        console.log(
          `Transferred ${erc20Balance.toString()} ${erc20ContractAddress} to Avocado wallet. Transaction hash: ${
            tx.hash
          }`
        );
      } else {
        console.log(`No balance to transfer for ${erc20ContractAddress}`);
      }
    }

    console.log('All ERC20 transactions successful');
  } catch (error) {
    console.log('Error sending ERC20 transactions:', error);
    ToastAndroid.show(
      'Something went wrong while sending funds. Please check your wallet funds and try again',
      500
    );
  }
};
