// AssetsScreen.js
import React, { lazy } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ActivityIndicator, View } from 'react-native';


const AssetManagement=lazy(()=>import("../../components/Assets/AssetManagement"))
const MyRequest=lazy(()=>import("../../components/Assets/MyRequest"))

const Tab = createMaterialTopTabNavigator();

const AssetsScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          textTransform: 'capitalize',
        },
        tabBarStyle: {
          backgroundColor: 'white', // dark slate background
          
        },
        tabBarActiveTintColor: 'red', // amber-400
        tabBarInactiveTintColor: 'black', // gray-300
        tabBarIndicatorStyle: {
          backgroundColor: 'red', // amber-400
          height: 3,
          borderRadius: 1.5,
        },
        lazy:true,
       
      }}
    >
      <Tab.Screen name="Asset Management" component={AssetManagement} />
      <Tab.Screen name="My Request" component={MyRequest} />
    </Tab.Navigator>
  );
};

export default AssetsScreen;
