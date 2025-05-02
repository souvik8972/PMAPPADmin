import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View } from 'react-native';

import AssetManagement from "../../components/Assets/AssetManagement";
import MyRequest from "../../components/Assets/MyRequest";

const Tab = createMaterialTopTabNavigator();

const AssetsScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '600',
            textTransform: 'none',
            fontFamily: 'System',
          },
          tabBarStyle: {
            backgroundColor: 'white',
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarActiveTintColor: 'red',
          tabBarInactiveTintColor: 'black',
          tabBarIndicatorStyle: {
            backgroundColor: 'red',
            height: 3,
            borderRadius: 1.5,
          },
          tabBarPressColor: 'transparent',
          lazy: true,
        }}
      >
        <Tab.Screen name="Asset Management" component={AssetManagement} />
        <Tab.Screen name="My Request" component={MyRequest} />
      </Tab.Navigator>
    </View>
  );
};

export default AssetsScreen;
