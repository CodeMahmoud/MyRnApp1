import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "./components/LoginScreen.js";
import { HomeScreen } from "./components/HomeScreen";

export type RootStackParams = {
  Login: undefined;
  Home: { name: string };
};

const Stack = createStackNavigator<RootStackParams>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000' }
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
