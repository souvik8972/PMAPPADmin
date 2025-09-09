import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const Shimmer = ({ style }) => {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1, // infinite
      true // reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[style, animatedStyle]} />;
};

const ProjectSkeleton = () => {
  return (
    <View className="bg-white rounded-xl shadow-xl border border-gray-100 mb-4 overflow-hidden">
      {/* Header skeleton */}
      <View className="flex-row items-center px-5 py-4 min-h-[80px]">
        <View className="flex-1">
          <Shimmer style={styles.skeletonBlock(20, "75%")} />
          <Shimmer style={[styles.skeletonBlock(16, "50%"), { marginTop: 8 }]} />
        </View>
        <Shimmer style={styles.skeletonCircle(24)} />
      </View>

      {/* Content skeleton */}
      <View className="px-5 pb-5 border-t border-gray-100">
        {/* Date row */}
        <View className="flex-row justify-between items-center mt-4 mb-5">
          <Shimmer style={styles.skeletonBlock(16, "40%")} />
          <Shimmer style={styles.skeletonBlock(32, "33%")} />
        </View>

        {/* Client */}
        <View className="mb-4">
          <Shimmer style={styles.skeletonBlock(12, "25%")} />
          <Shimmer style={[styles.skeletonBlock(20, "75%"), { marginTop: 6 }]} />
        </View>

        {/* Value Cards */}
        <View className="flex-row space-x-3 gap-2 mb-5">
          <Shimmer style={styles.skeletonCard} />
          <Shimmer style={styles.skeletonCard} />
        </View>

        {/* Footer */}
        <View className="flex-row justify-between items-center">
          <Shimmer style={styles.skeletonBlock(12, "40%")} />
          <Shimmer style={styles.skeletonPill} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonBlock: (height, width) => ({
    height,
    width,
    backgroundColor: "gray", // tailwind gray-200
    borderRadius: 6,
  }),
  skeletonCircle: (size) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: "#e5e7eb",
  }),
  skeletonCard: {
    flex: 1,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#f3f4f6", // tailwind gray-100
    marginRight: 8,
  },
  skeletonPill: {
    height: 24,
    width: "20%",
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },
});

export default ProjectSkeleton;
