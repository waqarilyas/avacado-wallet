import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import '@ethersproject/shims';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';

import Toast from 'react-native-toast-message';
import {WalletProvider} from './src/context/walletContext';
import AppNavigator from './src/routes';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={'white'} />
      <WalletProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </WalletProvider>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'white'
  }
});

export default App;
