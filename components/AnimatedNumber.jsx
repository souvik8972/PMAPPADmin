import Animated, { useSharedValue, withTiming, useAnimatedProps } from "react-native-reanimated";
import { View, Text, TouchableOpacity, StatusBar, TextInput } from "react-native";
import { useEffect } from "react";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
  
  const AnimatedNumber = ({ value, color }) => {
    const animatedValue = useSharedValue(0);
  
    useEffect(() => {
      animatedValue.value = withTiming(value, { duration: 1500 }); // Smooth animation to target value
    }, [value]);
  
    const animatedProps = useAnimatedProps(() => {
      return {
        text: `$${animatedValue.value.toFixed(2)}`, // Format with 2 decimal places
      };
    });
  
    return (
      <AnimatedTextInput
        editable={false}
        className={` font-bold text-base ${color}`}
        value="0"
        animatedProps={animatedProps}
      />
    );
  };
  
  export default AnimatedNumber