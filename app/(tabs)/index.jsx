import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from "react-native";
import Collapsible from "react-native-collapsible";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import DropDown from "../../components/TaskList/DropDown";
import Animated, { Layout, FadeInDown, FadeOutUp,Easing, SlideInDown, SlideOutUp } from "react-native-reanimated";
import { getLast7Weekdays,getFormattedDate} from "../../utils/functions/last7Days"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import { AuthContext } from "@/context/AuthContext";


export default function TaskScreen() {

const {user}=useContext(AuthContext)
console.log("USER",user)

  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)
  useEffect(() => {
    setLoading(true); // Start with shimmer
    const timer = setTimeout(() => {
      setLoading(false); // Stop shimmer after 3 seconds
    }, 3000);
  
    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, []);
  
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const today=getFormattedDate(0)
  const [loading, setLoading] = useState(false);
  const yesterday=getFormattedDate(1)
  const [selectedOption, setSelectedOption] = useState(today);
  const [taskData, setTaskData] = useState([
    { id: 1, title: "Learning and Upskilling - Frontend Team - Tech", taskId: "10586", owner: "Shijin Pulikkotil", planned: "06", actual: "06" },
    { id: 2, title: "Backend Development - API Integration", taskId: "20345", owner: "Rahul Sharma", planned: "04", actual: "03" },
    { id: 3, title: "UI Design - Mobile App", taskId: "30876", owner: "Priya Verma", planned: "05", actual: "0" },
  ]);

  const items=[
    { label: "Today", value: today },
    { label: "Yesterday", value: yesterday },
    { label: "Last 7 Days", value: "last7days" }
  ]

  const dates = ["Mon 12", "Tue 13", "Wed 14", "Thu 15", "Fri 16", "Sat 17", "Sun 18"];

 

  useEffect(() => {
    // console.log(selectedDate,"date")
    if (selectedOption === "last7days") {
      setSelectedDate(dates[0]);
    } else {
      setSelectedDate(selectedOption);
    }
  }, [selectedOption]);

  useEffect(()=>{
    console.log(selectedDate)
  },[selectedDate])

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
      <DropDown open={open} setOpen={setOpen} items={items} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />

      <View className="flex-row items-center border  border-gray-300 shadow-[0px_5px_3px_1px_rgba(0,_0,_0,_0.1)] rounded-[12px] h-[60px] p-2 my-4 bg-white">
        <TextInput
          placeholder="Search your task"
          className="flex-1 text-black"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FontAwesome name="search" size={20} color="gray" className="mr-2" />
      </View>

   <View>
   {selectedOption === "last7days" && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="h-[100px] flex-grow-0" >
          {dates.map((date, index) => (
            <TouchableOpacity key={index} onPress={() => setSelectedDate(date)}>
              <LinearGradient
                colors={selectedDate === date ? ["#D01313", "#6A0A0A"] : ["#E0E0E0", "#C0C0C0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 20, marginRight: 12, height: 80 }}
              >
                <View className="px-3 py-1 h-[80px] flex justify-center items-center w-[50px] rounded-[20px]">
                  <Text className={selectedDate === date ? "text-white font-bold text-sm" : "text-black text-sm"}>{date}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
   </View>
   <Text className="text-lg font-bold  mb-2">Task list</Text>
   {loading ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {[1, 2, 3,4,5].map((index) => (
           <View key={index} className="m-1 mb-4 mt-4 bg-white p-4 rounded-lg">
           <ShimmerPlaceholder 
             style={{ width: '100%', height: 60, borderRadius: 8, marginBottom: 8 }}
             shimmerColors={['#EBEBEB', '#D9D9D9', '#EBEBEB']}
             autoRun={true}
           />
         </View>
          ))}
        </ScrollView>
      ) :
<  ScrollView showsVerticalScrollIndicator={false} className="">

      {filteredTasks.length === 0 ? (
        <Text className="text-center text-gray-500">No tasks available</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} className="h-100 flex-grow-0">
          {filteredTasks.map((task, index) => (
            <Animated.View 
              key={task.id}
             
              entering={SlideInDown.duration(300)} // Smooth slide in
              exiting={SlideOutUp.duration(300)}
              className="mb-2 mt-4"
            >
              <TouchableOpacity
                className={`p-3 h-[80px] pl-5 pr-5  flex-row justify-between items-center ${
                  activeIndex === index ? "bg-white rounded-none rounded-t-lg" : "bg-[#EBEBEB] rounded-lg shadow-[0px_5px_3px_1px_rgba(0,_0,_0,_0.1)]"
                }`}
                onPress={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                <Text className="text-black font-semibold text-[14px] truncate w-[85%]">
                  {task.title}
                </Text>
                <FontAwesome name={activeIndex === index ? "angle-up" : "angle-down"} size={28} color="black" />
              </TouchableOpacity>
            
              <Collapsible collapsed={activeIndex !== index}>
              <TouchableWithoutFeedback  onPress={() => setActiveIndex(activeIndex === index ? null : index)}> 
                <View className="p-4 pt-0 bg-white rounded-t-none rounded-lg">
                  <Text ><MaterialCommunityIcons name="star-three-points-outline" size={12} color="black" />Task Title : </Text>
                  <Text className="font-semibold mb-2 pl-4">{task.title} </Text>
                  <Text><MaterialCommunityIcons name="star-three-points-outline" size={12} color="black" />Task Id : </Text>
                  <Text className="font-semibold mb-2 pl-4">{task.taskId}</Text>
                  <Text className=" mt-2"><MaterialCommunityIcons name="star-three-points-outline" size={12} color="black" />Task Owner :  </Text>
                  <Text className="font-semibold pl-4">{task.owner}</Text>
                 

                  <View className="flex-row justify-between p-4 pb-0 pt-0 mt-4">
                    <View className="items-center">
                      <Text className="font-semibold mb-2">Planned Hours</Text>
                      <TextInput className="border border-gray-300 p-2 w-16 text-center" value={task.planned} editable={false} />
                    </View>
                    <View className="items-center">
                      <Text className="font-semibold mb-2">Actual Hours</Text>
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
                   {/* Submit Button */}
                   <TouchableOpacity className="w-40 p-2 rounded-lg mt-4">
                      <LinearGradient
                        style={{ borderRadius: 12 }}
                        colors={["#D01313", "#6A0A0A"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className=" p-2 "
                      >
                        <Text className="text-white text-center p-2 flex items-center  justify-center rounded-lg font-bold">Submit</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  
                </View>
                
                </TouchableWithoutFeedback>

              </Collapsible>
              
            </Animated.View>
          ))}
        </ScrollView>
      )}
</ScrollView>}
      
    </View>
  );
}
