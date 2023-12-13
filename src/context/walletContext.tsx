import React, {createContext, useContext, useEffect, useState} from 'react';
import {ToastAndroid} from 'react-native';
import {
  createAvocadoWallet,
  fetchTokenBalances,
  generateNewWallet
} from '../utils/wallet.util';
import {HDNodeWallet} from 'ethers';

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
  avocadoWallet: string;
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
  avocadoWallet: ''
});

const WalletProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [wallet, setWallet] = useState<HDNodeWallet | undefined>(undefined);
  const [avocadoWallet, setAvocadoWallet] = useState<string>();

  const [tokenBalances, setTokenBalances] = useState({
    polygon: '0',
    opt: '0',
    dai: '0',
    aPolygon: '0',
    aOpt: '0',
    aDai: '0'
  });

  const handleWalletGeneration = async () => {
    const newWallet = generateNewWallet();
    setWallet(newWallet);

    const balances = await fetchTokenBalances(newWallet.address);
    setTokenBalances(balances);

    ToastAndroid.show('New Wallet Generated Successfully!', ToastAndroid.SHORT);

    const aWallet = await createAvocadoWallet(newWallet);
    console.log(
      '🚀 ~ file: walletContext.tsx:61 ~ handleWalletGeneration ~ avocadoWallet:',
      aWallet
    );

    setAvocadoWallet(aWallet);
  };

  useEffect(() => {
    if (!wallet) handleWalletGeneration();
  }, [wallet]);

  const value: WalletContextProps = {
    handleWalletGeneration,
    wallet,
    tokenBalances,
    avocadoWallet: avocadoWallet || ''
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

const useWallet = () => {
  return useContext(WalletContext);
};

export {WalletProvider, useWallet};
