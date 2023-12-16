import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Toast from 'react-native-toast-message';
import {useWallet} from '../../context/walletContext';
import styles from './styles';

const {width} = Dimensions.get('window');

const EOAScreen = ({navigation}: any) => {
  const {
    handleWalletGeneration,
    wallet,
    tokenBalances,
    handleFundsTransferToAvocado,
    loading,
    creationLoading
  } = useWallet();

  const handleCopy = (value: string | undefined) => {
    Clipboard.setString(value || '');

    Toast.show({
      type: 'success',
      text1: 'Copied to clipboard',
      text2: value || ''
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Externally Owned Account(EOA)</Text>
      <View style={styles.middleContainer}>
        <TouchableOpacity
          style={styles.copyContainer}
          onPress={() => handleCopy(wallet?.privateKey)}>
          <Text style={[styles.text, styles.addressText]}>
            Address: {wallet?.address}
          </Text>
          <Icon name="copy" size={width * 0.04} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.copyContainer}
          onPress={() => handleCopy(wallet?.privateKey)}>
          <Text style={[styles.text, styles.addressText]}>
            Private Key: {wallet?.privateKey}
          </Text>
          <Icon name="copy" size={width * 0.04} color="black" />
        </TouchableOpacity>

        <View style={styles.middleText}>
          {Object.keys(tokenBalances).map(key => {
            const value = key.split('-');

            return (
              <Text style={styles.text} key={value[0]}>
                {value[0]}: {parseFloat(tokenBalances[key]).toFixed(2)}{' '}
                {value[1]}
              </Text>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.customButton}
          onPress={handleFundsTransferToAvocado}>
          <Text style={[styles.customButtonText, styles.marginText]}>
            {loading ? 'Sending Funds...' : 'Transfer All To Avocado'}
          </Text>
          {loading ? <ActivityIndicator size="small" color="white" /> : null}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => handleWalletGeneration()}>
          <Text style={[styles.customButtonText, styles.marginText]}>
            {creationLoading ? 'Creating Wallet...' : 'Generate New Wallet'}
          </Text>
          {creationLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : null}
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
