// components/AnimatedSplashScreen.jsx
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Image } from "react-native";

export default function AnimatedSplashScreen({ onAnimationDone }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Wait 2 seconds, then fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      delay: 2000,
      useNativeDriver: true,
    }).start(() => {
      onAnimationDone(); // hide splash screen
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Image
        source={require("../assets/images/icon.png")}
        style={{ width: 150, height: 150 }}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
});
