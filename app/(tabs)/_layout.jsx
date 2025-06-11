import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Keyboard } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Header from '../../components/Header';
import MyTabBar from '../../components/MyTabBar';
import { AuthContext } from '../../context/AuthContext';

import { MaterialIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';

import Assets from '../screens/assets';
import Food from '../screens/food';
import Home from '../screens/Timesheet';
import Resource from '../screens/resource';
import Ticket from '../screens/ticket';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const { user } = useContext(AuthContext);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
      <Header />

      <Tab.Navigator
        tabBar={(props) => !isKeyboardVisible && <MyTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
        sceneContainerStyle={{
          flex: 1,
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="calendar-alt" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Resource"
          component={Resource}
          options={{
            tabBarIcon: ({ color }) => (
              <Feather name="users" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Ticket"
          component={Ticket}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="receipt-long" size={26} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Assets"
          component={Assets}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="mobile" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Food"
          component={Food}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="fast-food" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
