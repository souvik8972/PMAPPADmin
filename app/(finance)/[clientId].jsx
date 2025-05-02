import React, {useContext, useState} from "react";
import { View, Text, TouchableOpacity, StatusBar, TouchableWithoutFeedback, ScrollView , Platform} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { LinearGradient } from "expo-linear-gradient";
import ClientList from "../../components/StaticClientData";
import AnimatedNumber from "../../components/AnimatedNumber";
import AnimationPercentage from "../../components/AnimationPercentage";
import { EvilIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";
import Animated, { SlideInDown, SlideOutUp } from "react-native-reanimated";
import { Link } from 'expo-router'
import { AuthContext } from "../../context/AuthContext";

const  Client = () => {
  const param = useLocalSearchParams();
  const router = useRouter();
  const id = param.clientId;
  const CurrentClient = ClientList.filter((ele) => ele.id.toString() === id);

  let DummyPValue=416964
  let DummyAvalue=-118823;
  let PL=Number(DummyAvalue/DummyPValue *100).toFixed(2)
  let PredicatedGraphValue= (100-(Math.abs(PL)))



  if (!CurrentClient[0]) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-gray-500">Client not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="flex-row items-center py-3 bg-white relative">
        <TouchableOpacity onPress={() => router.back()} className="z-10 p-2 pl-9">
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>
        <View className="absolute left-0 right-0 items-center justify-center">
          <Text className="text-xl font-bold">{CurrentClient[0].companyName}</Text>
        </View>
        <View className="w-10" />
      </View>

      {/* Financial Data */}
      <View className="flex-row justify-between mt-4 pt-6 mb-6">
        {/* PoValue */}
        <View className="items-center w-1/3 border-r border-gray-200 px-1">
          <View className="flex-row items-center justify-center space-x-1 mb-1">
            <FontAwesome6 name="arrow-trend-up" size={12} color="black" className='border-gray-100 border-2 m-1 p-1'/>
            <Text className="text-sm text-gray-500">PoValue</Text>
          </View>
          <AnimatedNumber value={CurrentClient[0].TotalPO} color="text-black" />
          
        </View>
      
        {/* Predicated Gp */}
        <View className="items-center w-1/3 border-r border-gray-200 px-1 m-1">
          <View className="flex-row items-center justify-center space-x-1 mb-1">
            <FontAwesome6 name="arrow-trend-up" size={12} color="black" className='border-gray-100 border-2 p-1 m-1'/>
            <Text className="text-sm text-gray-500">Predicated Gp</Text>
          </View>
          <AnimationPercentage value={CurrentClient[0].PredicatedGp} color="text-black" />
        </View>
      
        {/* Current GP */}
        <View className="items-center w-1/3 px-1">
          <View className="flex-row items-center justify-center space-x-1 mb-1">
            <FontAwesome6 name="arrow-trend-down" size={12} color="black" className='border-gray-100 border-2 p-1 m-1'/>
            <Text className="text-sm text-gray-500">Current GP</Text>
          </View>
          <AnimationPercentage value={CurrentClient[0].currentGP} color="text-black" />
        </View>
      </View>


      {/* Progress Bar */}
      <View className="items-center justify-center w-full mt-6">
        <View className="w-[90%] h-11 bg-[#00D09E] rounded-full flex-row overflow-hidden">
          <View style={{ width: `${PredicatedGraphValue}%` }} className="h-full items-start justify-center px-1 pl-5">
            <Text className="text-black font-bold text-sm">$416,964.00</Text>
          </View>
          <View style={{ width: `${Math.abs(PL)}%`}} className={`${PL<0 ? "bg-red-500":"bg-black "} h-full rounded-full items-end justify-center px-1`}>
            <Text className="text-white font-bold text-sm pr-2">$118,823.75</Text>
          </View>
        </View>
        <View className='flex-row mt-6 items-center space-x-2 mb-6'>
          <Text className='w-3 h-3 bg-[#00D09E] rounded-full text-center mr-1'></Text>
          <Text className='font-semibold text-sm italic'>Predicted</Text>
          <Text className='w-3 h-3 bg-[#052224] rounded-full text-center ml-2 mr-1'></Text>
          <Text className='font-semibold text-sm'>Actual</Text>
        </View>
      </View>

      {/* Scrollable Section */}
      <View
        style={{
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              backgroundColor: "transparent",
            },
            android: {
              elevation: 10,
              backgroundColor: "white",
            },
          }),
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          marginTop: 25,
        }}
      >
        <LinearGradient
          colors={["white", "#01a47e"]}
          style={{
            padding: 16,
            width: "100%",
            height: "100%",
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
          }}
        >
          <TaskList />
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const TaskList = () => {
  const router = useRouter();
  const {user}=useContext(AuthContext)

  const projectData = [
    {
      id: 1,
      projectName: "E-commerce App",
      clientName: "ABC Corp",
      outsourceValue: "5000",
      totalPD: "150",
      startDate: "2025-2026",
      Pm: "Karishma, Aditi, Prajwal",
      Status: "closed",
    },
    {
      id: 2,
      projectName: "Healthcare Portal",
      clientName: "XYZ Ltd",
      outsourceValue: "8000",
      totalPD: "200",
      startDate: "2025-2026",
      Pm: "Karishma, Aditi, Prajwal",
      Status: "Active",
    },
  ];

  return (
    <View className="flex-1 pt-0">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-lg font-semibold">Projects List</Text>
        {user?.userType == 1 && <TouchableOpacity
          className=""
          onPress={() => router.push("/(addProject)/addProject")}
        >
          <LinearGradient
            colors={["black", "gray"]}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 50,
              padding: 10,
            }}
          >
            <MaterialCommunityIcons name="plus" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {projectData.map((project) => (
          <TouchableOpacity
            key={project.id}
            className="bg-white p-4 mb-3 rounded-lg flex-row justify-between items-center shadow-sm"
            onPress={() => router.push(`/projectInfo/${project.id}`)}
          >
            <View>
              <Text className="text-base font-semibold text-black">
                {project.projectName}
              </Text>
              <Text
                className={`${
                  project.Status === "Active" ? "bg-[#00D09E]" : "bg-red-400"
                } text-white px-2 py-1 mt-1 rounded-md w-fit text-xs`}
              >
                {project.Status}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        className="absolute bottom-10 right-6"
        onPress={() => router.push("/(addProject)/addProject")}
      >
        <LinearGradient
          colors={["#D01313", "#6A0A0A"]}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            padding: 10,
          }}
        >
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default Client;