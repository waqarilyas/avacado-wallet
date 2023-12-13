import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import '@ethersproject/shims';

import {} from '@instadapp/avocado';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme
} from 'react-native';

import AppNavigator from './src/routes';
import {WalletProvider} from './src/context/walletContext';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <WalletProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </WalletProvider>
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
