import {HDNodeWallet} from 'ethers';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {ToastAndroid} from 'react-native';
import {sendSdkTransaction} from '../utils/wallet-sdk-setup';
import {
  createAvocadoWallet,
  fetchTokenBalances,
  generateNewWallet
} from '../utils/wallet.util';

interface WalletContextProps {
  wallet: HDNodeWallet | undefined;
  tokenBalances: {
    polygon: string;
    opt: string;
    dai: string;

    aPolygon: string;
    aOpt: string;
    aDai: string;
  };
  handleWalletGeneration: () => Promise<void>;
  handleFundsTransferToAvocado: () => Promise<void>;
  avocadoWallet: string;
  loading: boolean;
  creationLoading: boolean;
}

const WalletContext = createContext<WalletContextProps>({
  wallet: undefined,
  tokenBalances: {
    polygon: '0',
    opt: '0',
    dai: '0',

    aPolygon: '0',
    aOpt: '0',
    aDai: '0'
  },
  handleWalletGeneration: async () => {},
  avocadoWallet: '',
  handleFundsTransferToAvocado: async () => {},
  loading: false,
  creationLoading: false
});

const WalletProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [wallet, setWallet] = useState<HDNodeWallet | undefined>(undefined);
  const [avocadoWallet, setAvocadoWallet] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [creationLoading, setCreationLoading] = useState(false);
  const [tokenBalances, setTokenBalances] = useState({
    polygon: '0',
    opt: '0',
    dai: '0',
    aPolygon: '0',
    aOpt: '0',
    aDai: '0'
  });

  const handleWalletGeneration = async () => {
    try {
      setCreationLoading(true);
      const newWallet = generateNewWallet();
      setWallet(newWallet);
      const balances = await fetchTokenBalances(newWallet.address);
      setTokenBalances(balances);

      const aWallet = await createAvocadoWallet(newWallet);
      setAvocadoWallet(aWallet);
      ToastAndroid.show(
        'New Wallet Generated Successfully!',
        ToastAndroid.SHORT
      );
    } catch (error) {
      console.log(
        '🚀 ~ file: walletContext.tsx:76 ~ handleWalletGeneration ~ error:',
        error
      );
      ToastAndroid.show('Failed to generate new wallet', ToastAndroid.SHORT);
    } finally {
      setCreationLoading(false);
    }
  };

  const handleFundsTransferToAvocado = async () => {
    try {
      setLoading(true);
      await sendSdkTransaction({
        privateKey: wallet?.privateKey || '',
        erc20ContractAddresses: ['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48']
      });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!wallet) handleWalletGeneration();
  }, [wallet]);

  const value: WalletContextProps = {
    handleWalletGeneration,
    wallet,
    tokenBalances,
    avocadoWallet: avocadoWallet || '',
    handleFundsTransferToAvocado,
    loading,
    creationLoading
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

const useWallet = () => {
  return useContext(WalletContext);
};

export {WalletProvider, useWallet};
