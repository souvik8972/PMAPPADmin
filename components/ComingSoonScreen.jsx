import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const ComingSoonScreen = () => {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dotAnim1 = useRef(new Animated.Value(0)).current;
  const dotAnim2 = useRef(new Animated.Value(0)).current;
  const dotAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Pulsing animation for the container
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Sequential dot animations
    const animateDot = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    animateDot(dotAnim1, 0).start();
    animateDot(dotAnim2, 300).start();
    animateDot(dotAnim3, 600).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: pulseAnim }]
          }
        ]}
      >
        <Text style={styles.heading}>Coming Soon</Text>
        <Text style={styles.subtitle}>We're crafting something special for you</Text>
        
        <View style={styles.dotsContainer}>
          <Animated.Text 
            style={[
              styles.dot,
              { 
                opacity: dotAnim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1]
                }) 
              }
            ]}
          >
            •
          </Animated.Text>
          <Animated.Text 
            style={[
              styles.dot,
              { 
                opacity: dotAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1]
                }) 
              }
            ]}
          >
            •
          </Animated.Text>
          <Animated.Text 
            style={[
              styles.dot,
              { 
                opacity: dotAnim3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1]
                }) 
              }
            ]}
          >
            •
          </Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  content: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 8,
    
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    // elevation: 3,
  },
  heading: {
    fontSize: 32,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  dot: {
    fontSize: 32,
    color: '#3498db',
    marginHorizontal: 8,
  },
});

export default ComingSoonScreen;