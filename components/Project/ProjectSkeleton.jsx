import { View } from "react-native";
import { exp } from "react-native-reanimated";

const ProjectSkeleton = () => {
  return (
    <View className="bg-white rounded-xl shadow-xl border border-gray-100 mb-4 overflow-hidden">
      {/* Header skeleton */}
      <View className="flex-row items-center px-5 py-4 min-h-[80px]">
        <View className="flex-1">
          <View className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
          <View className="h-4 w-1/2 bg-gray-200 rounded" />
        </View>
        <View className="w-6 h-6 bg-gray-200 rounded" />
      </View>
      
      {/* Content skeleton */}
      <View className="px-5 pb-5 border-t border-gray-100">
        {/* Date row */}
        <View className="flex-row justify-between items-center mt-4 mb-5">
          <View className="h-4 w-2/5 bg-gray-200 rounded" />
          <View className="h-8 w-1/3 bg-gray-200 rounded" />
        </View>
        
        {/* Client and Region */}
        <View className="space-y-3 mb-4">
          <View>
            <View className="h-3 w-1/4 bg-gray-200 rounded mb-2" />
            <View className="h-5 w-3/4 bg-gray-200 rounded" />
          </View>
        </View>
        
        {/* Value Cards */}
        <View className="flex-row space-x-3 gap-2 mb-5">
          <View className="flex-1 h-20 bg-gray-100 rounded-lg" />
          <View className="flex-1 h-20 bg-gray-100 rounded-lg" />
        </View>
        
        {/* Footer */}
        <View className="flex-row justify-between items-center">
          <View className="h-3 w-2/5 bg-gray-200 rounded" />
          <View className="h-6 w-1/5 bg-gray-200 rounded-full" />
        </View>
      </View>
    </View>
  );
};


export default ProjectSkeleton;