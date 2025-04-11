import React, {useState} from "react";
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
 
const  Client = () => {
  const param = useLocalSearchParams();
  const router = useRouter();
  const id = param.clientId;
  const CurrentClient = ClientList.filter((ele) => ele.id.toString() === id);
 
  let DummyPValue=416964
  let DummyAvalue=-118823;
  let PL=Number(DummyAvalue/DummyPValue *100).toFixed(2)
  let PredicatedGraphValue= (100-(Math.abs(PL)))
  console.log(PL);
 
 
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
          <Text className="text-3xl font-bold">{CurrentClient[0].companyName}</Text>
        </View>
        <View className="w-10" />
      </View>
 
      {/* Financial Data */}
      <View className="flex-row justify-between mt-4 pt-6 mb-6">
  {/* PoValue */}
  <View className="items-center w-1/3 border-r border-gray-200 px-1 ">
    <View className="flex-row items-center justify-center space-x-1 mb-1">
      <FontAwesome6 name="arrow-trend-up" size={10} color="black"  className='border-gray-100 border-2 m-1 p-1'/>
      <Text className="text-gray-500 ">PoValue</Text>
    </View>
    <AnimatedNumber value={CurrentClient[0].TotalPO} color="text-black" customCSS='text-xl p-0 m-0 px-0' />
  </View>
 
  {/* Predicated Gp */}
  <View className="items-center w-1/3 border-r border-gray-200 px-1 m-1">
    <View className="flex-row items-center justify-center space-x-1 mb-1">
      <FontAwesome6 name="arrow-trend-up" size={10} color="black"  className='border-gray-100 border-2 p-1 m-1'/>
      <Text className="text-gray-500 ">Predicated Gp</Text>
    </View>
    <AnimationPercentage value={CurrentClient[0].PredicatedGp} color="text-black"  />
  </View>
 
  {/* Current GP */}
  <View className="items-center w-1/3 px-1">
    <View className="flex-row items-center justify-center space-x-1 mb-1">
      <FontAwesome6 name="arrow-trend-down" size={10} color="black"  className='border-gray-100 border-2 p-1 m-1'/>
      <Text className="text-gray-500 ">Current GP</Text>
    </View>
    <AnimationPercentage value={CurrentClient[0].currentGP} color="text-black" />
  </View>
</View>
 
 
 
      {/* Progress Bar */}
      <View className="items-center justify-center w-full mt-6">
        <View className="w-[90%] h-11 bg-[#00D09E] rounded-full flex-row overflow-hidden">
          <View style={{ width: `${PredicatedGraphValue}%` }} className="h-full items-start justify-center px-1 pl-5">
            <Text className="text-black font-bold pl-1">$416,964.00</Text>
          </View>
          <View style={{ width: `${Math.abs(PL)}%`}} className={` ${PL<0 ? "bg-red-500":"bg-black "} h-full rounded-full items-end justify-center px-1`}>
            <Text className={` text-white font-bold pr-2`}>$118,823.75</Text>
          </View>
        </View>
         <View className='flex-row mt-6 items-center space-x-2 mb-6 '>
          <Text className='w-3 h-3 bg-[#00D09E] rounded-full text-center mr-1 '></Text>
          <Text className='font-semibold text-[15px] italic'>Predicted </Text>
          <Text className='w-3 h-3 bg-[#052224] rounded-full text-center ml-2 mr-1'></Text>
          <Text className='font-semibold text-[15px]'>Actual </Text>
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
        backgroundColor: "transparent", // important for iOS shadows
      },
      android: {
        elevation: 10,
        backgroundColor: "white", // needed to show elevation shadow
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
 
 
const TaskList=()=>{
  const [activeIndex, setActiveIndex] = useState(null);
    const [projectData, setProjectData] = useState([
      { id: 1, projectName: "E-commerce App", clientName: "ABC Corp",
        outsourceValue: "5000", totalPD: "150", startDate: "2025-2026",
         Pm: "Karishma, Aditi, Prajwal",
         Status:"closed",},
     
      { id: 2, projectName: "Healthcare Portal", clientName: "XYZ Ltd",
        Status:"Active",
        outsourceValue: "8000", totalPD: "200", startDate: "2025-2026", Pm: "Karishma, Aditi, Prajwal" },
    ]);
 
 
  return (
    <View className="flex-1  pt-0 ">
      <View className="flex-row  items-center justify-between">
        <Text className="text-[18px] font-semibold underline">Projects List</Text>
        <View className="flex-row items-center ml-1 mt-4">
          <EvilIcons name="exclamation" size={15} color="black" />
          <Text className="text-[11px]  ">
            Click on Project Name to View Tasks.
          </Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {projectData.map((project, index) => (
          <Animated.View
            key={project.id}
            entering={SlideInDown.duration(500)}
            exiting={SlideOutUp.duration(500)}
            className="m-1 mb-2 mt-6"
          >
            <TouchableOpacity
              className={` p-3 h-[80px] flex-row justify-between items-center ${
                activeIndex === index
                  ? "bg-white rounded-none rounded-t-lg "
                  : "bg-[#fdfdfd] rounded-lg shadow-[0px_10px_8px_-10px_rgba(0,_0,_0,_0.1)] -z-10"
              }`}
              onPress={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
            >
              <View>
                <Text className={`  text-[14px] truncate  ${activeIndex===index? 'text-gray-700':'text-black'}`}>
                  {activeIndex === index
                    ? ` FY-${project.startDate} `
                    : project.projectName}
                </Text>
                {activeIndex !== index && (
                  <Text
                    className={`${
                      project.Status === "Active"
                        ? "bg-[#00D09E]"
                        : " bg-red-400"
                    } text-gray-100 p-1 mt-2 rounded-md w-[60px] text-center `}
                  >
                    {project.Status}
                  </Text>
                )}
              </View>
              {activeIndex === index && (
                <>
                  <Text className="bg-[#DFF7E2] text-black p-2 rounded-md">
                    0686
                  </Text>
                  <Text
                    className={`${
                      project.Status === "Active"
                        ? "bg-[#DFF7E2]"
                        : " bg-red-300"
                    }  text-black p-2 rounded-md`}
                  >
                    {project.Status}
                  </Text>
                </>
              )}
              <View className="ml-2">
                <MaterialCommunityIcons
                  name={activeIndex === index ? "chevron-up" : "chevron-down"}
                  size={36}
                  color="black"
                />
              </View>
            </TouchableOpacity>
 
            <Collapsible collapsed={activeIndex !== index}>
              <TouchableWithoutFeedback
                onPress={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
              >
                <View className="p-4 pt-0 bg-white rounded-t-none rounded-xl">
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Link href={`/details/${project.id}`} asChild>
                        <TouchableOpacity>
                          <View>
                            <Text className="mb-1 text-gray-700">Project Title:</Text>
                            <Text className="font-semibold mb-3 underline">
                              {project.projectName}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </Link>
 
                      <Text className="mb-1 text-gray-700">Rate Card:</Text>
                      <Text className="font-semibold mb-3">
                        {project.clientName}
                      </Text>
                      <Text className='text-gray-700'>Project Manager: </Text>
                      <Text>{project.Pm}</Text>
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
 
export default Client;