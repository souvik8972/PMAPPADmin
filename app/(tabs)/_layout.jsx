import { Redirect, Stack, Tabs, useSegments } from 'expo-router';
import React, { useContext } from 'react';
import { ActivityIndicator, SafeAreaView, View } from 'react-native';
import Header from '../../components/Header';
import { MaterialIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Octicons from '@expo/vector-icons/Octicons';
import MyTabBar from '../../components/MyTabBar'; // import the custom TabBar component
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from "../../context/AuthContext";

export default function TabLayout() {
  const segments = useSegments();
  const {user}=useContext(AuthContext)



  

  return (
    <SafeAreaView style={{ flex: 1 }}>
    
      <Header />
      <Tabs 
        tabBar={(props) => <MyTabBar {...props} />} 
        
          lazy={true} 
        screenOptions={{
         
          headerShown: false,
          
        }}
        
        lazyplaceholder={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#D01313" />
          </View>
        }
      >
        <Tabs.Screen 
          name="resource" 
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => <Feather name="users" size={26} color={color} />,
            tabBarLabel: () => null, 
          }} 
        />
        <Tabs.Screen 
          name="index" 
          options={{
            tabBarIcon: ({ color }) => <FontAwesome5 name="calendar-alt" size={26} color={color} />,
            tabBarLabel: () => null, 
          }} 
        />
        <Tabs.Screen 
          name="ticket" 
          options={{
            tabBarIcon: ({ color }) => <MaterialIcons name="receipt-long" size={30} color={color} />,
            tabBarLabel: () => null, 
          }} 
        />
        <Tabs.Screen 
          name="assets" 
          options={{
            tabBarIcon: ({ color }) => <FontAwesome5 name="mobile" size={26} color={color} />,
            tabBarLabel: () => null, 
          }} 
        />
        <Tabs.Screen 
          name="food" 
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="fast-food" size={26} color={color}  />,
            tabBarLabel: () => null, 
          }} 
        />
      </Tabs>
    </SafeAreaView>
  );
}
