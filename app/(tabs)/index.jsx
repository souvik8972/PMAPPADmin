import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { DatePickerModal } from "react-native-paper-dates";
import Collapsible from "react-native-collapsible";
import Animated, { SlideInDown, SlideOutUp } from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import Feather from '@expo/vector-icons/Feather';

export default function TaskScreen() {
  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

  const [searchQuery, setSearchQuery] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState({ startDate: new Date(), endDate: null });
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [taskData, setTaskData] = useState([
    { id: 1, title: "Learning and Upskilling - Frontend Team - Tech", taskId: "10586", owner: "Shijin Pulikkotil", planned: "06", actual: "06" },
    { id: 2, title: "Backend Development - API Integration", taskId: "20345", owner: "Rahul Sharma", planned: "04", actual: "03" },
    { id: 3, title: "UI Design - Mobile App", taskId: "30876", owner: "Priya Verma", planned: "05", actual: "0" },
  ]);

  const handleConfirmDate = (params) => {
    setDatePickerOpen(false);
    if (params.startDate) {
      setSelectedRange({ startDate: params.startDate, endDate: params.endDate || null });
    }
  };

  const handleActualHoursChange = (text, taskId) => {
    setTaskData((prevTasks) =>
      prevTasks.map((task) => (task.taskId === taskId ? { ...task, actual: text } : task))
    );
  };

  const filteredTasks = taskData.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 p-4 pt-0 bg-gray-100">
      {/* Search Bar */}
      <View className="flex-row items-center border border-gray-300 shadow rounded-[12px] h-[60px] p-2 my-4 bg-white">
        <TextInput
          placeholder="Search your task"
          className="flex-1 text-black"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FontAwesome name="search" size={20} color="gray" className="mr-2" />
      </View>

      {/* Date Picker Button */}
      <TouchableOpacity onPress={() => setDatePickerOpen(true)} className="p-4 bg-red-800 rounded-lg shadow mb-4 flex-row items-center justify-between border border-gray-300">
        <Text className="text-white  text-lg font-semibold">
          {selectedRange.endDate ? `${selectedRange.startDate.toDateString()} - ${selectedRange.endDate.toDateString()}` : selectedRange.startDate.toDateString()}
        </Text>
        <FontAwesome name="calendar" size={20} color="white" />
      </TouchableOpacity>

      {/* Date Picker Modal */}
      <DatePickerModal
        locale="en-GB"
        mode="range"
        visible={datePickerOpen}
        onDismiss={() => setDatePickerOpen(false)}
        startDate={selectedRange.startDate}
        endDate={selectedRange.endDate}
        onConfirm={handleConfirmDate}
      />

      {/* Task List */}
      <View><Text className="underline font-bold text-xl">Task List</Text></View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredTasks.map((task, index) => (
          <Animated.View key={task.id} entering={SlideInDown.duration(300)} exiting={SlideOutUp.duration(300)} className="m-1 mb-4  mt-4">
            <TouchableOpacity
              className={`p-3 h-[80px] flex-row justify-between items-center ${activeIndex === index ? "bg-white rounded-none rounded-t-lg" : "bg-[#EBEBEB] rounded-lg shadow"}`}
              onPress={() => setActiveIndex(activeIndex === index ? null : index)}
            >
              <Text className="text-black font-semibold text-[14px] truncate w-[85%]">{task.title}</Text>
              <FontAwesome name={activeIndex === index ? "angle-up" : "angle-down"} size={28} color="black" />
            </TouchableOpacity>
            <Collapsible collapsed={activeIndex !== index}>
              <TouchableWithoutFeedback onPress={() => setActiveIndex(activeIndex === index ? null : index)}>
                <View className="p-4 pt-0  bg-white rounded-t-none rounded-lg">
                  <Text><MaterialCommunityIcons name="star-three-points-outline" size={12} color="black" /> Task Title:</Text>
                  <Text className="font-semibold mb-2 pl-4">{task.title}</Text>
                  <Text><MaterialCommunityIcons name="star-three-points-outline" size={12} color="black" /> Task Id:</Text>
                  <Text className="font-semibold mb-2 pl-4">{task.taskId}</Text>
                  <View className="flex-row justify-between items-center mb-2">
                    <View>
                      <Text><MaterialCommunityIcons name="star-three-points-outline" size={12} color="black" /> Task Owner:</Text>
                      <Text className="font-semibold pl-4">{task.owner}</Text>
                    </View>
                    <View className="flex-row space-x-2 gap-2">
                      <TouchableOpacity className="rounded-lg">
                        <LinearGradient colors={["#D01313", "#6A0A0A"]} style={{borderRadius:50 ,padding:6}}  className="">
                          <MaterialCommunityIcons name="plus" size={24} color="white" />
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <LinearGradient colors={["#D01313", "#6A0A0A"]} style={{borderRadius:50 ,padding:6}}  className="p-2 rounded-lg">
                        <Feather name="edit" size={24} color="white" />
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <LinearGradient colors={["#D01313", "#6A0A0A"]} style={{borderRadius:50 ,padding:6}}  className="p-2 rounded-lg">
                          <MaterialCommunityIcons name="delete"  size={24} color="white" />
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
}
