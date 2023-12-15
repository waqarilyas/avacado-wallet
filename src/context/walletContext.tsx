import {HDNodeWallet} from 'ethers';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {ToastAndroid} from 'react-native';
import {sendSdkTransaction} from '../utils/wallet-sdk-setup';
import {
  createAvocadoWallet,
  fetchAvoBalances,
  fetchTokenBalances,
  generateNewWallet
} from '../utils/wallet.util';

interface TokenBalances {
  polygon: string;
}

interface AvocadoBalances {
  polygon: string;
}

interface WalletContextProps {
  wallet: HDNodeWallet | undefined;
  tokenBalances: TokenBalances;
  avocadoBalance: AvocadoBalances;
  handleWalletGeneration: () => Promise<void>;
  handleFundsTransferToAvocado: () => Promise<void>;
  avocadoWallet: string;
  loading: boolean;
  creationLoading: boolean;
}

const DEFAULT_TOKEN_BALANCES: TokenBalances = {polygon: '0'};
const DEFAULT_AVOCADO_BALANCE: AvocadoBalances = {polygon: '0'};

const WalletContext = createContext<WalletContextProps>({
  wallet: undefined,
  tokenBalances: DEFAULT_TOKEN_BALANCES,
  avocadoBalance: DEFAULT_AVOCADO_BALANCE,
  handleWalletGeneration: async () => {},
  avocadoWallet: '',
  handleFundsTransferToAvocado: async () => {},
  loading: false,
  creationLoading: false
});

const WalletProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [wallet, setWallet] = useState<HDNodeWallet | undefined>();
  const [avocadoWallet, setAvocadoWallet] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [creationLoading, setCreationLoading] = useState(false);
  const [tokenBalances, setTokenBalances] = useState(DEFAULT_TOKEN_BALANCES);
  const [avocadoBalance, setAvocadoBalance] = useState(DEFAULT_AVOCADO_BALANCE);

  const handleWalletGeneration = async () => {
    setCreationLoading(true);

    setTimeout(async () => {
      try {
        const newWallet = generateNewWallet();
        setWallet(newWallet);

        const balances = await fetchTokenBalances(newWallet.address);
        setTokenBalances(balances);

        const aWallet = await createAvocadoWallet(newWallet);
        setAvocadoWallet(aWallet);

        const avocadoBalances = await fetchAvoBalances(newWallet.address);
        setAvocadoBalance({
          polygon: avocadoBalances ?? DEFAULT_AVOCADO_BALANCE.polygon
        });
        ToastAndroid.show(
          'New Wallet Generated Successfully!',
          ToastAndroid.SHORT
        );
      } catch (error) {
        console.error('Error during wallet generation:', error);
        ToastAndroid.show('Failed to generate new wallet', ToastAndroid.SHORT);
      } finally {
        setCreationLoading(false);
      }
    }, 500);
  };

  const handleFundsTransferToAvocado = async () => {
    try {
      setLoading(true);

      await sendSdkTransaction({
        privateKey: wallet?.privateKey || '',
        erc20ContractAddresses: ['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48']
      });
    } catch (err) {
      // Handle the error if needed
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
    creationLoading,
    avocadoBalance
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

const useWallet = () => {
  return useContext(WalletContext);
};

export {WalletProvider, useWallet};
