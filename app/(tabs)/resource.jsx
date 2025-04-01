import React, { useState, useMemo, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, ScrollView, Platform, Animated, KeyboardAvoidingView} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/AntDesign";
import tw from "tailwind-react-native-classnames";
 
 
const teamData = {
  Tech: [
    {
      id: 1, name: "Tony Stark", Loggedhours: 4, Available: 4,
      taskData: [
        { id: 1123, title: "Meeting", PH: 4, LH: 4, Owner: "Shijin Pulikkotil" },
        { id: 1543, title: "MAT-USA2025", PH: 4, LH: 4, Owner: "Shijin Pulikkotil" }
      ]
    },
    { id: 2, name: "Bruce Wayne", Loggedhours: 25, Available: 30, taskData: [
      { id: 1123, title: "Meeting", PH: 4, LH: 4, Owner: "Shijin Pulikkotil" },
      { id: 1543, title: "MAT-USA2025", PH: 4, LH: 4, Owner: "Shijin Pulikkotil" }
    ] },
    {
      id:3, name: "Harry Potter", Loggedhours: 1, Available: 10,
      taskData: [
        { id: 1123, title: "Orsodu", PH: 4, LH: 4, Owner: "Shijin Pulikkotil" },
        { id: 1543, title: "Ask the Expert", PH: 4, LH: 4, Owner: "Shijin Pulikkotil" }
      ]
    },
  ],
  Creative: [{ id: 4, name: "Picasso", Loggedhours: 4, Available: 4, taskData: [] }],
  Content: [{ id: 7, name: "Stan Lee", Loggedhours: 4, Available: 4, taskData: [] }],
  PM: [{ id: 10, name: "Marvel", Loggedhours: 4, Available: 4, taskData: [] },{ id: 11, name: "DC", Loggedhours: 4, Available: 4, taskData: [] }],
};
 
const TABS = ["Tech", "Creative", "Content", "PM"];
 
export default function ResourcesScreen() {
  const [activeTab, setActiveTab] = useState("Tech");
  const [searchText, setSearchText] = useState("");
  const [selectedDropdown, setSelectedDropdown] = useState(null);
 
 
  const filteredData = useMemo(() => {
    return teamData[activeTab].filter((member) =>
      member.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [activeTab, searchText]);
 
  const HandleTab=(tab)=>{
    setSearchText("")
    setActiveTab(tab)
  }
 
  return (
     <View style={{flex:1}}>
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={tw`flex-1`}>
      <Text className='mx-3 mb-6  text-lg font-medium'>Task Availability</Text>
       
    <ScrollView style={{flexGrow:1}}>
        <View className="flex-row  justify-evenly m-0 p-0 ">
          {TABS.map((tab) => (
            <TabButton key={tab} tab={tab} activeTab={activeTab} setActiveTab={()=>{HandleTab(tab)}} />
          ))}
        </View>
 
       
        <View className='mx-4 mt-5 mb-2'>
          <Text style={tw`text-lg `}>Team Utilization:</Text>
          <View style={tw`flex-row items-center justify-between mt-2 mr-16  `}>
            <GradientProgressBar progress={0.5}  />
            <Text className={'p-2'}>50%</Text>
            <Icon name="infocirlceo" size={18} color="gray" />
          </View>
        </View>
         
        {/* Search Input */}
        <View style={tw`flex-row items-center border border-gray-300 rounded-xl bg-gray-100 mx-3  shadow-lg mb-4 mt-2 pr-4 pl-3  pt-3  pb-3`}>
          <TextInput
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            style={tw`flex-1 pl-3`}
           
          />
          <Icon name="search1" size={20} color="gray" />
        </View>
       
 
        {/* Team Members List */}
     
        {filteredData.map((item, index) => (
               <TeamMember  key={index} item={item} selectedDropdown={selectedDropdown} setSelectedDropdown={setSelectedDropdown} />
            ))}
 
       
       
      </ScrollView>
      </KeyboardAvoidingView>
      </View>
     
  );
}
 
// 💡 Reusable Components
const TabButton = ({ tab, activeTab, setActiveTab }) => (
  <TouchableOpacity onPress={() => setActiveTab(tab)} className="   " style={{minWidth:80, alignSelf:'flext-start' }} >
    <LinearGradient
      colors={activeTab === tab ? ["#D01313", "#6A0A0A"] : ["#333", "#333"]}
      style={tw` rounded-lg`}
    >
      <Text style={tw` text-white text-center  p-4 `}>{tab}</Text>
    </LinearGradient>
  </TouchableOpacity>
);
 
const GradientProgressBar = ({ progress }) => (
  <View style={tw`w-full h-2 bg-gray-300 rounded-lg`}>
    <LinearGradient
      colors={["#D01313", "#6A0A0A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[tw`h-full rounded-lg`, { width: `${progress * 100}%` }]}
    />
  </View>
);
 
const TeamMember = ({ item, selectedDropdown, setSelectedDropdown }) => {
  const handleToggle = () => {
    setSelectedDropdown(prev => (prev === item.id ? null : item.id));
  };
 
  return (
    <View>
    <View style={[tw`p-3 rounded-lg shadow-md my-4 mx-3`, {backgroundColor:'#EBEBEB'}]}  >
     
      <TouchableOpacity onPress={handleToggle} className='flex-row justify-between'>
        <Text style={''}>{item.name}</Text>
          <MaterialIcons name={selectedDropdown === item.id ? "keyboard-arrow-down" : "chevron-right"} size={35} color="black" />
          </TouchableOpacity>
     
        {/* <TouchableOpacity className="flex-row items-center  p" onPress={handleToggle} > */}
  {/* Logged Hours */}
  {/* <View className="flex-row items-center space-x-1 mr-4" onPress={handleToggle}>
    <Text className="text-green-800 text-end pr-2">🟢</Text>
    <Text className="text-gray-500 text-lg">Logged: {item.Loggedhours} hr</Text>
  </View>
  */}
 
  {/* Available Hours */}
  {/* <View className="flex-row items-center space-x-1 " onPress={handleToggle}>
    <Text className="text-red-800 pr-2 text-xs">🔴</Text>
    <Text className="text-gray-500 text-lg ">Available: {item.Available} hr</Text>
  </View> */}
{/* </TouchableOpacity> */}
    </View>
 
 
      {/* Dropdown Content */}
      {selectedDropdown === item.id && (
        <TaskDropdown taskData={item.taskData} />
      )}
     
 
    </View>
   
  );
};
 
const TaskDropdown = ({ taskData }) => {
  const [selectedDate, setSelectedDate] = useState("Mon 12");
  const dates = ["Mon 12", "Tue 13", "Wed 14", "Thu 15", "Fri 16"];
  const [SearchTask, SetSearchTask]= useState("");
   let  FilterTaskData= taskData.filter((member) =>
   
    member.title.toLowerCase().includes(SearchTask.toLowerCase()))
   console.log(taskData, FilterTaskData);
 
 
 
  return (
    <View style={[tw`p-4  rounded-lg shadow-md  mx-3`,{backgroundColor:'#EBEBEB'}]} >
    <View style={tw`  rounded-lg mt-4 mb-4`}>
 
          {/* Google search bar */}
          <Animated.View>
          <View className="flex-row space-x-3 items-center border border-gray-300 rounded-full   w-2/3 text-white mb-2 mt-2" style={{backgroundColor:'#B4B4B4'}}>
          <Icon name="search1" size={20} color="white" className="p-2" />
     
            <TextInput
             placeholder="Search here "
             onChangeText={SetSearchTask}
             className='w-full text-white'>
             
             
            </TextInput>
          </View>
          </Animated.View>
 
      {/* Date Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
  {dates.map((date) => (
    <TouchableOpacity key={date} onPress={() => setSelectedDate(date)}>
      <LinearGradient
        colors={selectedDate === date ? ["#D01313", "#6A0A0A"] : ["#BDBDBD", "#BDBDBD"]}
        style={[tw`px-3 py-6 rounded-full mx-1`, {minWidth:60}]} // ✅ Ensures equal width
      >
        <Text style={tw`font-semibold text-white text-center`}>{date.split(" ")[0]}</Text>
        <Text style={tw` text-lg font-bold text-white text-center`}>{date.split(" ")[1]}</Text>
      </LinearGradient>
    </TouchableOpacity>
  ))}
</ScrollView>
 
 
      {/* Task Table */}
      <View style={tw`border-t border-gray-400 mt-2 pt-2`}>
        <View style={tw`flex-row border-b border-gray-400 pb-2`}>
          <Text style={tw`text-sm font-semibold w-1/5`}>ID</Text>
          <Text style={tw`text-sm font-semibold w-1/5`}>Title</Text>
          <Text style={tw`text-sm font-semibold w-1/5 pl-2`}>LH</Text>
          <Text style={tw`text-sm font-semibold w-1/5`}>PH</Text>
          <Text style={tw`text-sm font-semibold w-1/5`}>Owner</Text>
        </View>
        {FilterTaskData.length === 0 ? (
          <Text style={tw`text-gray-500 text-center mt-2`}>No tasks available</Text>
        ) : (
          FilterTaskData.map((task) => (
            <View key={task.id} style={tw`flex-row border-b border-gray-300 py-2`}>
              <Text style={tw`text-sm w-1/5`}>{task.id}</Text>
              <Text style={tw`text-sm w-1/5`}>{task.title}</Text>
              <Text style={tw`text-sm w-1/5 pl-2`}>{task.LH}</Text>
              <Text style={tw`text-sm w-1/5`}>{task.PH}</Text>
              <Text style={tw`text-sm w-1/5`}>{task.Owner}</Text>
            </View>
          ))
        )}
      </View>
    </View>
    </View>
  );
};