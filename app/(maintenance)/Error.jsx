import { View, Text, StyleSheet,Image, Dimensions, SafeAreaView, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const Error = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }] 
          }
        ]}
      >
        <View style={styles.animationContainer}>
          <LottieView
            source={require('../../assets/animation/error.json')}
            autoPlay
            loop={true}
            style={styles.lottie}
          />
        </View>
        
        <Text style={styles.title}>App Under Maintenance</Text>
        
        <Text style={styles.message}>
          We're performing scheduled maintenance to improve your experience.
          Please check back shortly.
        </Text>
        
        <View style={styles.divider} />
        
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Image 
              source={require('../../assets/images/mmIcon.png')} 
              style={{ width: 100, height: 40, resizeMode: 'contain' }} 
            />
            {/* <View style={[styles.infoIcon, styles.clockIcon]}>
              <Text style={styles.icon}>⏱</Text>
            </View>
            <Text style={styles.infoLabel}>Estimated Time</Text> */}
            {/* <Text style={styles.infoValue}>30-60 min</Text> */}
          </View>
          
          {/* <View style={styles.infoItem}>
            <View style={[styles.infoIcon, styles.toolsIcon]}>
              <Text style={styles.icon}>🔧</Text>
            </View>
            <Text style={styles.infoLabel}>Maintenance</Text>
            <Text style={styles.infoValue}>Server Updates</Text>
          </View> */}
          
          {/* <View style={styles.infoItem}>
            <View style={[styles.infoIcon, styles.contactIcon]}>
              <Text style={styles.icon}>📧</Text>
            </View>
            <Text style={styles.infoLabel}>Contact</Text>
            <Text style={styles.infoValue}>info@medtrixhealthcare.com</Text>
          </View> */}
        </View>
      </Animated.View>
      
      <Animated.Text 
        style={[
          styles.footer,
          { opacity: fadeAnim }
        ]}
      >
        Thank you for your patience
      </Animated.Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 30,
    width: width * 0.9,
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  animationContainer: {
    width: 180,
    height: 180,
    marginBottom: 10,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#eee',
    marginBottom: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  clockIcon: {
    backgroundColor: 'rgba(255, 196, 0, 0.15)',
  },
  toolsIcon: {
    backgroundColor: 'rgba(101, 80, 255, 0.15)',
  },
  contactIcon: {
    backgroundColor: 'rgba(0, 184, 148, 0.15)',
  },
  icon: {
    fontSize: 24,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    marginTop: 24,
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Error;