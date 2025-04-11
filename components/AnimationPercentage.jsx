import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { runOnJS } from "react-native-reanimated";
 
import Animated, {
  useSharedValue,
  withTiming,
  useDerivedValue,
  useAnimatedReaction,
} from "react-native-reanimated";
 
const AnimationPercentage = ({ value, color }) => {
  const animatedValue = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState("0.00%");
 
  useEffect(() => {
    animatedValue.value = withTiming(value, { duration: 1500 });
  }, [value]);
 
  const derivedText = useDerivedValue(() => {
    return `${animatedValue.value.toFixed(2)}%`;
  });
 
  // Push derived value into React state
  useAnimatedReaction(
    () => derivedText.value,
    (result) => {
      // Only update if changed
      if (result !== displayValue) {
        runOnJS(setDisplayValue)(result);
      }
    },
    [displayValue]
  );
 
  return (
    <Text className={`text-xl font-bold ${color}`}>
      {displayValue}
    </Text>
  );
};
 
export default AnimationPercentage;
 