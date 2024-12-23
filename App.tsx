import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Home from './pages/Home';
import LoginScreen from './pages/LoginScreen';
import { View } from 'react-native';
import Tables from './pages/Tables';
import Menu from './pages/Menu';
import TableDetail from './pages/TableDetail';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'default-icon'; // Varsayılan bir değer atanıyor

          if (route.name === 'Ana Sayfa') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Masalar') {
            iconName = focused ? 'table-furniture' : 'table-furniture';
          } else if (route.name === 'Menu') {
            iconName = focused ? 'basket' : 'basket';
          } else if (route.name === 'Profilim') {
            iconName = focused ? 'account' : 'account';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Ana Sayfa" component={Home}options={{ headerShown: false }}/>
      <Tab.Screen name="Masalar" component={Tables} options={{ headerShown: false }}/>
      <Tab.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
      <Tab.Screen name="Profilim" component={Home} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="TableDetail" component={TableDetail} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

export default App;
