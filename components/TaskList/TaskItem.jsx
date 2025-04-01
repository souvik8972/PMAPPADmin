import React from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import Collapsible from "react-native-collapsible";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const TaskItem = ({ filteredTasks, activeIndex, setActiveIndex, handleActualHoursChange }) => {
  // Function to handle submit
  const handleSubmit = (taskId, actual) => {
    console.log("Task ID:", taskId);
    console.log("Actual Hours:", actual);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="h-100">
      {filteredTasks.map((task, index) => (
        <View key={task.id} className="mb-2">
          <TouchableOpacity
            className="p-3 h-[80px] bg-[#EBEBEB] rounded-lg flex-row justify-between mb-4 items-center"
            onPress={() => setActiveIndex(activeIndex === index ? null : index)}
          >
            <Text className="text-black font-semibold text-[14px]">{task.title}</Text>
            <FontAwesome name={activeIndex === index ? "angle-up" : "angle-down"} size={20} color="black" />
          </TouchableOpacity>

          <Collapsible collapsed={activeIndex !== index}>
            <View className="mt-2 p-4 bg-white rounded">
              <Text className="font-bold">Task Title</Text>
              <Text>{task.title}{"\n"}#Task: {task.taskId}</Text>

              <Text className="font-bold mt-2">Task Owner</Text>
              <Text>{task.owner}</Text>

              <View className="flex-row justify-between mt-4">
                <View className="items-center">
                  <Text className="font-bold">Planned Hours</Text>
                  <TextInput className="border border-gray-300 p-2 w-16 text-center" value={task.planned} editable={false} />
                </View>
                <View className="items-center">
                  <Text className="font-bold">Actual Hours</Text>
                  <TextInput
                    className="border border-gray-300 p-2 w-16 text-center"
                    keyboardType="numeric"
                    placeholder="00"
                    maxLength={10}
                    onChangeText={(text) => handleActualHoursChange(text, task.taskId)}
                    value={task.actual}
                  />
                </View>
              </View>

              <TouchableOpacity className="w-40 p-3 rounded-lg mt-4" onPress={() => handleSubmit(task.taskId, task.actual)}>
                <LinearGradient style={{ borderRadius: 12 }} colors={["#D01313", "#6A0A0A"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="w-40 p-3 mt-4">
                  <Text className="text-white text-center p-3 rounded-lg font-bold">Submit</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Collapsible>
        </View>
      ))}
    </ScrollView>
  );
};

export default TaskItem;
