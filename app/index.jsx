import { View, Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import Loading from './loading';
// import { useNotificationPermission } from '../ReactQuery/hooks/useNotificationPermission';
// import { scheduleDailyNotification } from '../utils/notifications';
import { initNotificationListeners, registerForPushNotificationsAsync, removeNotificationListeners } from '@/services/notifications';
import Landing from './Landing';


const { width, height } = Dimensions.get('window');

const Index = () => {

  const [loading ,setLoading]=useState(true)
  return (
    loading? (<Loading setLoading={setLoading}/>):<Landing/>)
 
}

export default Index;