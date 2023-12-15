import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import {
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {useWallet} from '../../context/walletContext';
import styles from './styles';

const {width, height} = Dimensions.get('window');

const EOAScreen = ({navigation}: any) => {
  const {
    handleWalletGeneration,
    wallet,
    tokenBalances,
    handleFundsTransferToAvocado,
    loading,
    creationLoading
  } = useWallet();

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
          <Icon name="copy" size={width * 0.04} color="black" />
        </TouchableOpacity>

        <View style={styles.middleText}>
          <Text style={styles.text}>
            USDC (Polygon): {parseFloat(tokenBalances.polygon).toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.customButton}
          onPress={handleFundsTransferToAvocado}>
          <Text style={styles.customButtonText}>
            {loading ? 'Sending Funds...' : 'Transfer All To Avocado'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => handleWalletGeneration()}>
          <Text style={styles.customButtonText}>
            {creationLoading ? 'Creating Wallet...' : 'Generate New Wallet'}
          </Text>
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
