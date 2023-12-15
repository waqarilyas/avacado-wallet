import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import {Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useWallet} from '../../context/walletContext';
import styles from './styles';

const AvocadoScreen = ({navigation}: any) => {
  const {avocadoWallet} = useWallet();

  const handleCopy = () => {
    Clipboard.setString(avocadoWallet || '');
    ToastAndroid.show('Copied to clipboard', 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.middleContainer}>
        <Text style={styles.heading}>Avocado</Text>
        <TouchableOpacity style={styles.copyContainer} onPress={handleCopy}>
          <Text style={[styles.text, styles.addressText]}>{avocadoWallet}</Text>
          <Icon name="copy" size={16} color="black" />
        </TouchableOpacity>

        <View style={styles.middleText}>
          <Text style={styles.text}>USDC (Polygon): 0</Text>
          <Text style={styles.text}>DAI (Arb): 0</Text>
          <Text style={styles.text}>USDT (Opt): 0</Text>
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
