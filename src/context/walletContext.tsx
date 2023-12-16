import {HDNodeWallet} from 'ethers';
import React, {createContext, useContext, useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import {sendAllTokens} from '../utils/transactions.util';
import {
  createAvocadoWallet,
  fetchAccountErc20Balances,
  generateNewWallet,
  recoverWalletFromPrivateKey
} from '../utils/wallet.util';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Wallet} from 'ethers';

interface TokenBalances {
  [tokenName: string]: string;
}

interface WalletContextProps {
  wallet: HDNodeWallet | undefined | Wallet;
  tokenBalances: TokenBalances;
  avocadoBalance: TokenBalances;
  handleWalletGeneration: () => Promise<void>;
  handleFundsTransferToAvocado: () => Promise<void>;
  handleWalletRecoveryFromPrivateKey: (key: string) => Promise<void>;
  avocadoWallet: string;
  loading: boolean;
  recoveryLoading: boolean;
  creationLoading: boolean;
}

const DEFAULT_TOKEN_BALANCES: TokenBalances = {
  'polygon-USDC': '0',
  'ethereum-USDT': '0',
  'optimism-USDT': '0',
  'arbitrum-USDT': '0'
};
const DEFAULT_AVOCADO_BALANCE: TokenBalances = {
  'polygon-USDC': '0',
  'ethereum-USDT': '0',
  'optimism-USDT': '0',
  'arbitrum-USDT': '0'
};
const WALLET_STORAGE_KEY = 'wallet';

const WalletContext = createContext<WalletContextProps>({
  wallet: undefined,
  tokenBalances: DEFAULT_TOKEN_BALANCES,
  avocadoBalance: DEFAULT_AVOCADO_BALANCE,
  handleWalletGeneration: async () => {},
  avocadoWallet: '',
  handleFundsTransferToAvocado: async () => {},
  handleWalletRecoveryFromPrivateKey: async () => {},
  loading: false,
  creationLoading: false,
  recoveryLoading: false
});

const WalletProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [wallet, setWallet] = useState<HDNodeWallet | undefined | Wallet>();
  const [avocadoWallet, setAvocadoWallet] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [creationLoading, setCreationLoading] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [tokenBalances, setTokenBalances] = useState(DEFAULT_TOKEN_BALANCES);
  const [avocadoBalance, setAvocadoBalance] = useState(DEFAULT_AVOCADO_BALANCE);

  const refreshAvocadoAndBalances = async (wall: Wallet | HDNodeWallet) => {
    const aWallet = await createAvocadoWallet(wall);
    setAvocadoWallet(aWallet);

    const balances = await fetchAccountErc20Balances(wall.address);
    setTokenBalances(balances);

    const avocadoBalances = await fetchAccountErc20Balances(aWallet);
    setAvocadoBalance(avocadoBalances);
  };

  const loadWalletFromStorage = async () => {
    try {
      const walletData = await AsyncStorage.getItem(WALLET_STORAGE_KEY);

      if (walletData) {
        const loadedWallet = JSON.parse(walletData);

        setWallet(loadedWallet);
        refreshAvocadoAndBalances(loadedWallet);
        Toast.show({
          type: 'success',
          text1: 'Wallet Loaded',
          text2: 'Your wallet has been loaded from local storage'
        });
      } else {
        handleWalletGeneration();
      }
    } catch (error) {
      console.error('Error loading wallet from storage:', error);
    }
  };

  const saveWalletToStorage = async (newWallet: any) => {
    try {
      await AsyncStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(newWallet));
    } catch (error) {
      console.error('Error saving wallet to storage:', error);
    }
  };

  const handleWalletGeneration = async () => {
    setCreationLoading(true);

    setTimeout(async () => {
      try {
        const newWallet = generateNewWallet();
        setWallet(newWallet);
        await saveWalletToStorage({
          ...newWallet,
          privateKey: newWallet.privateKey
        });

        refreshAvocadoAndBalances(newWallet);

        Toast.show({
          type: 'success',
          text1: 'Wallet Created',
          text2: 'Your wallet has been created successfully'
        });
      } catch (error) {
        console.error('Error during wallet generation:', error);

        Toast.show({
          type: 'error',
          text1: 'Wallet Creation Failed',
          text2: 'Failed to generate new wallet'
        });
      } finally {
        setCreationLoading(false);
      }
    }, 500);
  };

  const handleWalletRecoveryFromPrivateKey = async (privateKey: string) => {
    setRecoveryLoading(true);

    try {
      const newWallet = await recoverWalletFromPrivateKey(privateKey);
      setWallet(newWallet);
      saveWalletToStorage({...newWallet, privateKey: newWallet.privateKey});

      await refreshAvocadoAndBalances(newWallet);

      Toast.show({
        type: 'success',
        text1: 'Wallet Recovered',
        text2: 'Your wallet has been created successfully'
      });
    } catch (error) {
      console.log('Error during wallet generation:', error);

      Toast.show({
        type: 'error',
        text1: 'Wallet Recover Failed',
        text2: 'Please check your private key and try again'
      });
    } finally {
      setRecoveryLoading(false);
    }
  };
  const handleAccountBalances = async () => {
    if (!wallet) return;

    const balances = await fetchAccountErc20Balances(wallet.address);
    setTokenBalances(balances);

    if (!avocadoWallet) return;
    const avocadoBalances = await fetchAccountErc20Balances(avocadoWallet);
    setAvocadoBalance(avocadoBalances);

    // Toast.show({
    //   type: 'success',
    //   text1: 'Balance Updated'
    // });
  };

  const handleFundsTransferToAvocado = async () => {
    try {
      setLoading(true);

      if (!wallet || !avocadoWallet) return;
      await sendAllTokens(wallet.privateKey, avocadoWallet);
      handleAccountBalances();
    } catch (err) {
      // Handle the error if needed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWalletFromStorage();
  }, []);
  const value: WalletContextProps = {
    handleWalletGeneration,
    wallet,
    tokenBalances,
    avocadoWallet: avocadoWallet || '',
    handleFundsTransferToAvocado,
    loading,
    creationLoading,
    avocadoBalance,
    handleWalletRecoveryFromPrivateKey,
    recoveryLoading
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

const useWallet = () => {
  return useContext(WalletContext);
};

export {WalletProvider, useWallet};
