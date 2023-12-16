import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useWallet} from '../../context/walletContext';
import styles from './styles';

const AvocadoScreen = ({navigation}: any) => {
  const {avocadoWallet, avocadoBalance} = useWallet();

  const handleCopy = () => {
    Clipboard.setString(avocadoWallet || '');
    Toast.show({
      type: 'success',
      text1: 'Copied to clipboard',
      text2: avocadoWallet || ''
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Avocado Account</Text>
      <View style={styles.middleContainer}>
        <TouchableOpacity style={styles.copyContainer} onPress={handleCopy}>
          <Text style={[styles.text, styles.addressText]}>{avocadoWallet}</Text>
          <Icon name="copy" size={16} color="black" />
        </TouchableOpacity>

        <View style={styles.middleText}>
          <Text style={styles.text}>
            USDC (Polygon): {avocadoBalance?.polygon}
          </Text>
        </View>
      </View>

      <View style={styles.bottomView}>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate('EOA')}>
          <Text style={styles.customButtonText}>EOA Address</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.customButton, styles.disabledButton]}
          onPress={() => navigation.navigate('Avocado')}
          disabled>
          <Text style={styles.customButtonText}>Avocado Address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AvocadoScreen;
