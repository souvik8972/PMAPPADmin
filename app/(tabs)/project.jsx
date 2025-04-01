import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { DatePickerModal } from "react-native-paper-dates";
import Collapsible from "react-native-collapsible";
import Animated, { SlideInDown, SlideOutUp } from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function ProjectList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState({ startDate: new Date(), endDate: null });
  const [activeIndex, setActiveIndex] = useState(null);
  const [projectData, setProjectData] = useState([
    { id: 1, projectName: "E-commerce App", clientName: "ABC Corp", outsourceValue: "5000", totalPD: "150" },
    { id: 2, projectName: "Healthcare Portal", clientName: "XYZ Ltd", outsourceValue: "8000", totalPD: "200" },
  ]);

  const handleConfirmDate = (params) => {
    setDatePickerOpen(false);
    if (params.startDate) {
      setSelectedRange({ startDate: params.startDate, endDate: params.endDate || null });
    }
  };

  const filteredProjects = projectData.filter((project) =>
    project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 p-4 pt-0 bg-gray-100">
      {/* Search Bar */}
      <View className="flex-row items-center border border-gray-300 shadow rounded-[12px] h-[60px] p-2 my-4 bg-white">
        <TextInput
          placeholder="Search project"
          className="flex-1 text-black"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FontAwesome name="search" size={20} color="gray" className="mr-2" />
      </View>

   
    

      {/* Project List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredProjects.map((project, index) => (
          <Animated.View key={project.id} entering={SlideInDown.duration(300)} exiting={SlideOutUp.duration(300)} className=" m-2 mb-2 mt-4">
            <TouchableOpacity
              className={`p-3 h-[80px] flex-row justify-between items-center ${activeIndex === index ? "bg-white rounded-none rounded-t-lg" : "bg-[#EBEBEB] rounded-lg shadow"}`}
              onPress={() => setActiveIndex(activeIndex === index ? null : index)}
            >
              <Text className="text-black font-semibold text-[14px] truncate w-[70%]">{project.projectName}</Text>
            </TouchableOpacity>
            <Collapsible collapsed={activeIndex !== index}>
              <TouchableWithoutFeedback onPress={() => setActiveIndex(activeIndex === index ? null : index)}>
                <View className="p-4 pt-0 bg-white rounded-t-none rounded-lg">
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text><MaterialCommunityIcons name="account" size={12} color="black" /> Client Name:</Text>
                      <Text className="font-semibold pl-4">{project.clientName}</Text>
                      <Text><MaterialCommunityIcons name="cash" size={12} color="black" /> Outsource Value:</Text>
                      <Text className="font-semibold pl-4">${project.outsourceValue}</Text>
                      <Text><MaterialCommunityIcons name="chart-pie" size={12} color="black" /> Total PD:</Text>
                      <Text className="font-semibold pl-4">{project.totalPD}</Text>
                    </View>
                    <View className="flex-row space-x-2">
                      <TouchableOpacity>
                        <LinearGradient colors={["#D01313", "#6A0A0A"]} className="p-2 rounded-lg">
                          <MaterialCommunityIcons name="delete" size={20} color="white" />
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

      {/* Add Button */}
      <TouchableOpacity className="absolute bottom-4 left-4">
        <LinearGradient colors={["#D01313", "#6A0A0A"]} className="p-4 rounded-full">
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}