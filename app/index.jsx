import { View, Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { useNotificationPermission } from '../ReactQuery/hooks/useNotificationPermission';
import { scheduleDailyNotification } from '../utils/notifications';



const { width, height } = Dimensions.get('window');

const Index = () => {
  useNotificationPermission();
 
  // useEffect(() => {
  //   // Automatically schedule daily 9AM notification when the app is loaded
  //   const handleSchedule = () => {
  //     scheduleDailyNotification(12, 11); // e.g., schedule for 9:00 AM daily
  //     console.log('✅ Daily 9AM notification scheduled');
  //   };

  //   handleSchedule();  // Schedule the notification
  // }, []); 

const {user}=useContext(AuthContext)


  
const handleClick = () => {
  console.log("Userrrr",user?.checkTokenExpiration)
  
  if (!user|| user?.checkTokenExpiration) {
    router.replace('/(auth)/login');
    return;
  }
  
  if (user.userType == 3) {
    router.replace('(tabs)');
  } else {
    router.replace('(admin)');
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../assets/images/manage.png')} 
          style={styles.image} 
          resizeMode="contain" 
        />
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to Medtrix PM Tool</Text>
          <Text style={styles.subtitle}>
            Streamline your project management with ease and efficiency.
          </Text>
        </View>
        
        <Pressable 
          onPress={handleClick} 
          style={styles.buttonContainer}
          android_ripple={{ color: 'rgba(255,255,255,0.3)', borderless: false }}
        >
          <LinearGradient
            colors={['#D01313', '#6A0A0A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </LinearGradient>
        </Pressable>
      </View>
      
      {/* Wave background at the bottom */}
      <View style={styles.waveContainer}>
        <Image 
          source={require('../assets/images/svg.png')} 
          style={styles.waveImage} 
          resizeMode="stretch"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 2, // Ensure content stays above wave
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 32,
  },
  textContainer: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#D01313',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 34, 
    fontFamily: 'PlayFair',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '80%',
    fontFamily: 'Inter-Regular',
  },
  buttonContainer: {
    width: 180,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#D01313',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 20,
  },
  gradientButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
    fontFamily: 'Inter-SemiBold',
  },
  waveContainer: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    height: height * 0.15,
    zIndex: 1,
  },
  waveImage: {
    width: '100%',
    height: '100%',
  },
});

export default Index;