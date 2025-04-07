import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { DatePickerModal } from "react-native-paper-dates";
import Collapsible from "react-native-collapsible";
import Animated, { SlideInDown, SlideOutUp } from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Link } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';


export default function ProjectList() {
    const projectId = 123;
    
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [projectData, setProjectData] = useState([
    { id: 1, projectName: "E-commerce App", clientName: "ABC Corp", outsourceValue: "5000", totalPD: "150", startDate: "2025-01-10", endDate: "2025-01-21" },
    { id: 2, projectName: "Healthcare Portal", clientName: "XYZ Ltd", outsourceValue: "8000", totalPD: "200", startDate: "2025-02-01", endDate: "2025-02-15" },
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

  const deleteProject = (index) => {
    const updatedProjects = projectData.filter((_, i) => i !== index);
    setProjectData(updatedProjects);
  };

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
        <View className="mr-2">
          <FontAwesome name="search" size={20} color="gray" />
        </View>
      </View>
    <View className="flex flex-row justify-between items-center">
    <Text className="pl-2">Project List</Text>
    <Text className="text-[10px] text-red-400"><EvilIcons name="exclamation" size={10} color="red" /> Click on Project Name to View Tasks.</Text>
    </View>
   

      {/* Project List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredProjects.map((project, index) => (
          <Animated.View key={project.id} entering={SlideInDown.duration(300)} exiting={SlideOutUp.duration(300)} className="m-1 mb-2 mt-4">
            <TouchableOpacity
              className={`p-4 h-[80px] flex-row justify-between items-center ${activeIndex === index ? "bg-white rounded-none rounded-t-lg" : "bg-[#fdfdfd] rounded-lg shadow-[0px_14px_9px_-12px_rgba(0,_0,_0,_0.1)] -z-10"}`}
              onPress={() => setActiveIndex(activeIndex === index ? null : index)}
            >
              <Text className="text-black font-semibold text-[14px] truncate w-[70%]">
                {activeIndex === index ? `${project.startDate} - ${project.endDate}` : project.projectName}
              </Text>
              <View className="ml-2">
                <MaterialCommunityIcons
                  name={activeIndex === index ? "chevron-up" : "chevron-down"}
                  size={36}
                  color="black"
                />
              </View>
            </TouchableOpacity>

            <Collapsible collapsed={activeIndex !== index}>
              <TouchableWithoutFeedback onPress={() => setActiveIndex(activeIndex === index ? null : index)}>
                <View className="p-4 pt-0 bg-white rounded-t-none rounded-xl">
                  <View className="flex-row justify-between items-center">
                    <View>
                    <Link href={`/(details)/${projectId}`} >
  <TouchableOpacity >
    <View>
      <Text className="mb-1">Project Name:</Text>
      <Text className="font-semibold mb-3">{project.projectName}</Text>
    </View>
  </TouchableOpacity>
</Link>

                      
                      <Text className="mb-1">Client Name:</Text>
                      <Text className="font-semibold mb-3">{project.clientName}</Text>
                      <View className="flex flex-row justify-between  w-full gap-4">
                        <View className="bg-[#F1FFF3] p-4 rounded-lg pr-8">
                          <Text>Outsource Value:</Text>
                          <Text className="font-semibold">${project.outsourceValue}</Text>
                        </View>
                        <View className="bg-[#00D09E] p-4 rounded-lg pr-8">
                          <Text>Total PO Value:</Text>
                          <Text className="font-semibold">${project.totalPD}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View className="flex-row space-x-2 justify-end pt-8 gap-4 items-center mb-2">
                    <Text>Created On: {project.startDate}</Text>
                    <TouchableOpacity onPress={() => deleteProject(index)}>
                      <LinearGradient colors={["#D01313", "#6A0A0A"]} style={{ borderRadius: 50, padding: 8 }}>
                        <MaterialCommunityIcons name="delete" size={24} color="white" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Collapsible>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity className="absolute bottom-10 right-6">
        <LinearGradient colors={["#D01313", "#6A0A0A"]} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 50, padding: 10 }}>
          <MaterialCommunityIcons name="plus" size={32} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}