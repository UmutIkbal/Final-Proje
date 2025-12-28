import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import Ionicons from 'react-native-vector-icons/Ionicons';

import DashboardScreen from './src/screens/DashboardScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import MarketScreen from './src/screens/MarketScreen';
import ChartsScreen from './src/screens/ChartsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import COLORS from './src/theme/colors';

const options = {
  headerShown: false,
  tabBarShowLabel: false,
};
const Tab = createBottomTabNavigator(options)

enableScreens(false);


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.secondary,
        }}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen}
          options={{
            tabBarIcon: ({ focused, size = 19 }) => (
              <Ionicons
                name="home"
                size={size}
                color={focused ? COLORS.primary : COLORS.secondary}
              />
            ),
            tabBarLabel: "Ana Sayfa"
          }} />
        <Tab.Screen name="İşlemler" component={TransactionsScreen} options={{
          tabBarIcon: ({ focused, size = 20 }) => (
            <Ionicons
              name="list"
              size={size}
              color={focused ? COLORS.primary : COLORS.secondary}
            />
          ),
          tabBarLabel: "İşlemler"
        }} />
        <Tab.Screen name="Piyasa" component={MarketScreen} options={{
          tabBarIcon: ({ focused, size = 20 }) => (
            <Ionicons
              name="trending-up"
              size={size}
              color={focused ? COLORS.primary : COLORS.secondary}
            />
          ),
          tabBarLabel: "Ana Sayfa"
        }} />
        <Tab.Screen name="Grafikler" component={ChartsScreen} options={{
          tabBarIcon: ({ focused, size = 20 }) => (
            <Ionicons
              name="bar-chart"
              size={size}
              color={focused ? COLORS.primary : COLORS.secondary}
            />
          ),
          tabBarLabel: "Grafikler"
        }} />
        <Tab.Screen name="Ayarlar" component={SettingsScreen} options={{
          tabBarIcon: ({ focused, size = 20 }) => (
            <Ionicons
              name="settings"
              size={size}
              color={focused ? COLORS.primary : COLORS.secondary}
            />
          ),
          tabBarLabel: "Ayarlar"
        }} />


      </Tab.Navigator>
    </NavigationContainer>
  );
}
