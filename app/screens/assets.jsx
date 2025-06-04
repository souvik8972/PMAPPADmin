import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import AssetManagement from "../../components/Assets/AssetManagement";
import MyRequest from "../../components/Assets/MyRequest";
import { AuthContext } from '@/context/AuthContext';
import AllRequest from "../../components/Assets/AllRequest";

const AssetsScreen = () => {
  const { user } = useContext(AuthContext);
  const isSystemAdmin = user?.userType == 5;
  const [activeTab, setActiveTab] = useState(0);
  const [indicatorPosition] = useState(new Animated.Value(0));

  const tabs = [
    { name: "Asset Management", component: AssetManagement },
    { name: isSystemAdmin ? "AllRequest" : "My Request", component: isSystemAdmin ? AllRequest : MyRequest }
  ];

  const handleTabPress = (index) => {
    setActiveTab(index);
    Animated.spring(indicatorPosition, {
      toValue: index,
      useNativeDriver: true,
    }).start();
  };

  const translateX = indicatorPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100], // Adjust based on your tab width
  });

  const ActiveComponent = tabs[activeTab].component;

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            className={` ${activeTab === index?'bg-[#6a040f]':'bg-gray-50'}`}
            onPress={() => handleTabPress(index)}
          >
            <Text 
            
            style={[
              styles.tabText,
              activeTab === index ? styles.activeTabText : styles.inactiveTabText
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Indicator */}
      <Animated.View
        style={[
          styles.indicator,
          { transform: [{ translateX }] }
        ]}
      />
      
      {/* Content */}
      <View style={styles.content}>
        <ActiveComponent />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 0,
    shadowOpacity: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'none',
    fontFamily: 'System',
  },
  activeTabText: {
  color: 'white',
  // textDecorationLine: 'underline',
 
  textDecorationColor: 'red', // Ensures the underline is red
},

  inactiveTabText: {
    color: 'black',
  },
  indicator: {
    position: 'absolute',
    top: 56, // Adjust based on your tab height
    height: 3,
    width: '50%', // Adjust based on number of tabs
   
    borderRadius: 1.5,
  },
  content: {
    flex: 1,
  },
});

export default AssetsScreen;