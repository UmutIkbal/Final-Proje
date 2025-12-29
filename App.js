import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import Ionicons from 'react-native-vector-icons/Ionicons';

import DashboardScreen from './src/screens/DashboardScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import MarketScreen from './src/screens/MarketScreen';
import ChartsScreen from './src/screens/ChartsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { CategoriesProvider } from './src/context/CategoriesContext';
import { TransactionsProvider } from './src/context/TransactionsContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

const Tab = createBottomTabNavigator();

enableScreens(false);

function AppContent() {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.secondary,
          tabBarStyle: { backgroundColor: colors.surface },
        }}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen}
          options={{
            tabBarIcon: ({ focused, size = 19 }) => (
              <Ionicons
                name="home"
                size={size}
                color={focused ? colors.primary : colors.secondary}
              />
            ),
            tabBarLabel: "Ana Sayfa"
          }} />
        <Tab.Screen name="İşlemler" component={TransactionsScreen} options={{
          tabBarIcon: ({ focused, size = 20 }) => (
            <Ionicons
              name="list"
              size={size}
              color={focused ? colors.primary : colors.secondary}
            />
          ),
          tabBarLabel: "İşlemler"
        }} />
        <Tab.Screen name="Piyasa" component={MarketScreen} options={{
          tabBarIcon: ({ focused, size = 20 }) => (
            <Ionicons
              name="trending-up"
              size={size}
              color={focused ? colors.primary : colors.secondary}
            />
          ),
          tabBarLabel: "Ana Sayfa"
        }} />
        <Tab.Screen name="Grafikler" component={ChartsScreen} options={{
          tabBarIcon: ({ focused, size = 20 }) => (
            <Ionicons
              name="bar-chart"
              size={size}
              color={focused ? colors.primary : colors.secondary}
            />
          ),
          tabBarLabel: "Grafikler"
        }} />
        <Tab.Screen name="Ayarlar" component={SettingsScreen} options={{
          tabBarIcon: ({ focused, size = 20 }) => (
            <Ionicons
              name="settings"
              size={size}
              color={focused ? colors.primary : colors.secondary}
            />
          ),
          tabBarLabel: "Ayarlar"
        }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CategoriesProvider>
        <TransactionsProvider>
          <AppContent />
        </TransactionsProvider>
      </CategoriesProvider>
    </ThemeProvider>
  );
}
