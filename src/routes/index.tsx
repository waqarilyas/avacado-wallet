import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import EOAScreen from '../screens/Eoa';
import AvocadoScreen from '../screens/Avocado';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS
      }}>
      <Stack.Screen name="EOA" component={EOAScreen} />
      <Stack.Screen name="Avocado" component={AvocadoScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
