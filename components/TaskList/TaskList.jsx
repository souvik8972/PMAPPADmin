import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from "react-native";
import Collapsible from "react-native-collapsible";
import Animated, { SlideInDown, SlideOutUp } from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";

const TaskList = ({ taskData }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {taskData.map((task, index) => (
          <Animated.View key={task.id} entering={SlideInDown.duration(300)} exiting={SlideOutUp.duration(300)} className="m-1 mb-4 mt-4">
            <TouchableOpacity
              className={`p-3 h-[80px] flex-row justify-between items-center ${
                activeIndex === index ? "bg-white rounded-none rounded-t-lg" : "bg-[#EBEBEB] rounded-lg shadow"
              }`}
              onPress={() => setActiveIndex(activeIndex === index ? null : index)}
            >
              <Text className="text-black font-semibold text-[14px] truncate w-[85%]">{task.title}</Text>
              <FontAwesome name={activeIndex === index ? "angle-up" : "angle-down"} size={28} color="black" />
            </TouchableOpacity>

            <Collapsible collapsed={activeIndex !== index}>
              <TouchableWithoutFeedback onPress={() => setActiveIndex(activeIndex === index ? null : index)}>
                <View className="p-4 pt-0 bg-white rounded-t-none rounded-lg">
                  <Text>
                    <MaterialCommunityIcons name="star-three-points-outline" size={12} color="black" /> Task Title:
                  </Text>
                  <Text className="font-semibold mb-2 pl-4">{task.title}</Text>

                  <Text>
                    <MaterialCommunityIcons name="star-three-points-outline" size={12} color="black" /> Task Id:
                  </Text>
                  <Text className="font-semibold mb-2 pl-4">{task.taskId}</Text>

                  <View className="flex-row justify-between items-center mb-2">
                    <View>
                      <Text>
                        <MaterialCommunityIcons name="star-three-points-outline" size={12} color="black" /> Task Owner:
                      </Text>
                      <Text className="font-semibold pl-4">{task.owner}</Text>
                    </View>
                    <View className="flex-row space-x-2 gap-2">
                      <TouchableOpacity>
                        <LinearGradient colors={["#D01313", "#6A0A0A"]} style={{ borderRadius: 50, padding: 6 }} className="p-2 rounded-lg">
                          <Feather name="edit" size={24} color="white" />
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity>
                        <LinearGradient colors={["#D01313", "#6A0A0A"]} style={{ borderRadius: 50, padding: 6 }} className="p-2 rounded-lg">
                          <MaterialCommunityIcons name="delete" size={24} color="white" />
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Collapsible>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
};

export default TaskList;
