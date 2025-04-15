import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AssetManagement from '../../components/Assets/AssetManagement';
import MyRequest from '../../components/Assets/MyRequest';

const AssetsScreen = () => {
  const [activeTab, setActiveTab] = useState('assetManagement');

  return (
    <View style={styles.container}>
      {/* Tab Buttons with Parallelogram Shape */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'assetManagement' ? styles.activeTab : styles.inactiveTab,
            { transform: [{ skewX: '-15deg' }] }
          ]}
          onPress={() => setActiveTab('assetManagement')}
        >
          <View style={{ transform: [{ skewX: '15deg' }] }}>
            <Text style={[
              styles.tabText,
              activeTab === 'assetManagement' ? styles.activeText : styles.inactiveText
            ]}>
              Asset Management
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'myRequest' ? styles.activeTab : styles.inactiveTab,
            { transform: [{ skewX: '-15deg' }] }
          ]}
          onPress={() => setActiveTab('myRequest')}
        >
          <View style={{ transform: [{ skewX: '15deg' }] }}>
            <Text style={[
              styles.tabText,
              activeTab === 'myRequest' ? styles.activeText : styles.inactiveText
            ]}>
              My Request
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.contentContainer}>
        {activeTab === 'assetManagement' && <AssetManagement />}
        {activeTab === 'myRequest' && <MyRequest />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
  paddingBottom: 8,
  

  
  },
  tabButton: {
    width: '50%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#991b1b',
  },
  inactiveTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  activeText: {
    color: 'white',
  },
  inactiveText: {
    color: 'black',
  },
  contentContainer: {
    flex: 1,
  },
});

export default AssetsScreen;