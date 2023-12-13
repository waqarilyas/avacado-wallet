import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import {Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';
import {useWallet} from '../../context/walletContext';

const EOAScreen = ({navigation}: any) => {
  const {handleWalletGeneration, wallet, tokenBalances} = useWallet();

  const handleTransferPress = () => {
    // Add your logic for the "Transfer All To Avocado" button here
  };

  const handleCopy = () => {
    Clipboard.setString(wallet?.address || '');
    ToastAndroid.show('Copied to clipboard', 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.middleContainer}>
        <Text style={styles.heading}>EOA</Text>
        <TouchableOpacity style={styles.copyContainer} onPress={handleCopy}>
          <Text style={[styles.text, styles.addressText]}>
            {wallet?.address}
          </Text>
          <Icon name="copy" size={16} color="black" />
        </TouchableOpacity>

        <View style={styles.middleText}>
          <Text style={styles.text}>
            USDC (Polygon): {tokenBalances.polygon}
          </Text>
          <Text style={styles.text}>DAI (Arb): {tokenBalances.dai}</Text>
          <Text style={styles.text}>USDT (Opt): {tokenBalances.opt}</Text>
        </View>

        <TouchableOpacity
          style={styles.customButton}
          onPress={handleTransferPress}>
          <Text style={styles.customButtonText}>Transfer All To Avocado</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customButton}
          onPress={handleWalletGeneration}>
          <Text style={styles.customButtonText}>Generate New Wallet</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomView}>
        <TouchableOpacity
          style={[styles.customButton, styles.disabledButton]}
          onPress={() => navigation.navigate('EOA')}
          disabled>
          <Text style={styles.customButtonText}>EOA Address</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate('Avocado')}>
          <Text style={styles.customButtonText}>Avocado Address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EOAScreen;
