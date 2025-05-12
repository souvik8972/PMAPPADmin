import { View, Text } from 'react-native'
import React from 'react'

const ShimmerLoader = () => {
  return (
    <View className="bg-white h-20 p-4 mb-3 rounded-lg shadow-sm">
      <View className="flex-row justify-between items-center">
        <View className="h-6 w-2/4 bg-gray-200 rounded" />
        <View className="h-6 w-6 bg-gray-200 rounded-full" />
      </View>
      <View className="mt-2 h-4 w-1/2 bg-gray-200 rounded" />
    </View>
  );
};

export default ShimmerLoader