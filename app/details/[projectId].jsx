import { View, Text, TouchableOpacity, StatusBar, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ScrollView } from "react-native";
import Animated, { useSharedValue, withTiming, useAnimatedProps } from "react-native-reanimated";
import AnimatedNumber from "../../components/AnimatedNumber";
import TaskList from "../../components/TaskList/TaskList";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Modal } from "react-native-paper";
import AddTask from "../../components/TaskList/AddTask";
import Entypo from '@expo/vector-icons/Entypo';
const ProjectDetails = () => {

const [showModal,setShowModal]=useState(false)

  const [taskData, setTaskData] = useState([
    { id: 1, title: "Learning and Upskilling - Frontend Team - Tech", taskId: "10586", owner: "Shijin Pulikkotil", planned: "06", actual: "06" },
    { id: 2, title: "Backend Development - API Integration", taskId: "20345", owner: "Rahul Sharma", planned: "04", actual: "03" },
    { id: 3, title: "UI Design - Mobile App", taskId: "30876", owner: "Priya Verma", planned: "05", actual: "0" },
  ]);
  const { projectId } = useLocalSearchParams();
  const router = useRouter();
// make random
  // Mock JSON Data
  const projectData = {
    projectId: projectId || "10356",
    projectName: "Stemline",
    task: "Frontend Team - Tech",
    amountSpent: 783.00,
    totalValue: 1187.4,
    progress: 0.9, // 90%
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header with Back Button */}
      <View className="flex-row items-center py-3 bg-white relative">
        <TouchableOpacity onPress={() => router.back()} className="z- p-2 pl-9">
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>
        <View className="absolute left-0 right-0 items-center justify-center">
          <Text className="text-3xl font-bold">{projectData.projectName}</Text>
        </View>
        <View className="w-10" />
      </View>

      {/* Project Header */}
      <View className="items-center mt-4">
        <Text className="text-gray-500">{projectData.task}</Text>
      </View>

      {/* Financial Data with Animated Numbers */}
      <View className="flex-row justify-between mx-6 mt-4 p-2 pt-6">
        <View className="items-center w-1/2 border-r-[1px] border-gray-100">
          <Text className="text-gray-500 mb-2">
            <FontAwesome6 name="arrow-trend-up" size={15} color="black" /> Out Starter Value
          </Text>
          <AnimatedNumber value={projectData.amountSpent} color="text-black" />
        </View>
        <View className="items-center w-1/2">
          <Text className="text-gray-500 mb-2">
            <FontAwesome6 name="arrow-trend-down" size={15} color="black" /> Total PO Value
          </Text>
          <AnimatedNumber value={projectData.totalValue} color="text-[#00D09E]" />
        </View>
      </View>

      {/* Progress Bar */}
      <View className="items-center justify-center w-full mt-6">
        <View className="w-96 h-11 bg-[#00D09E] rounded-full flex-row overflow-hidden">
          <View style={{ width: `${90 - 10}%` }} className="h-full items-start justify-center px-3 pl-5">
            <Text className="text-black font-bold">{90}%</Text>
          </View>
          <View style={{ width: `${10 + 10}%` }} className="bg-black h-full rounded-full items-end justify-center px-3">
            <Text className="text-white font-bold">{10}%</Text>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <LinearGradient
  colors={["white","#01a47e" ]}
  style={{
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    marginTop: 25,
    padding: 16,
    width: "100%",
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  }}
  className="mt-10 rounded-t-[40]"
>
  <View className="w-full h-full p-2 relative">
    {/* Header */}
    <View className="mt-4 mb-4 flex-row justify-between items-center px-4">
      <Text className="text-xl text-black underline font-bold">Task List</Text>
      
      <Link href={`/(addTask)/${projectId}`} className="w-12 h-12 justify-center items-center">
        <LinearGradient colors={["black", "black"]} style={{ borderRadius: 50 }} className="p-2 rounded-lg">
         
            <Feather name="plus" size={24} color="white" />
        </LinearGradient>
        </Link>
    </View>

    {/* ScrollView wrapped in a View to apply fade effect */}
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <TaskList taskData={taskData} />
      </ScrollView>

      {/* Fade effect at the bottom */}
      <LinearGradient
        colors={['white ', '#01a47e']}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 40,
        }}
        pointerEvents="none"
      />
    </View>
  </View>
</LinearGradient>


     

    </SafeAreaView>

  );
};

export default ProjectDetails;
