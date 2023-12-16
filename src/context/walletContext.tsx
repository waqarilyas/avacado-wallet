import {HDNodeWallet} from 'ethers';
import React, {createContext, useContext, useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import {sendAllTokens} from '../utils/transactions.util';
import {
  createAvocadoWallet,
  fetchAccountErc20Balances,
  generateNewWallet
} from '../utils/wallet.util';

interface TokenBalances {
  [tokenName: string]: string;
}

interface WalletContextProps {
  wallet: HDNodeWallet | undefined;
  tokenBalances: TokenBalances;
  avocadoBalance: TokenBalances;
  handleWalletGeneration: () => Promise<void>;
  handleFundsTransferToAvocado: () => Promise<void>;
  avocadoWallet: string;
  loading: boolean;
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

        const aWallet = await createAvocadoWallet(newWallet);
        setAvocadoWallet(aWallet);

        const balances = await fetchAccountErc20Balances(newWallet.address);
        setTokenBalances(balances);

        const avocadoBalances = await fetchAccountErc20Balances(aWallet);
        setAvocadoBalance(avocadoBalances);

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
    if (!wallet) handleWalletGeneration();
  }, []);

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
