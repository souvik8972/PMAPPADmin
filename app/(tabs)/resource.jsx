import React, { useState, useMemo, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, ScrollView, Platform, Animated, KeyboardAvoidingView, Easing} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/AntDesign";
import tw from "tailwind-react-native-classnames";
 import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useFetchData } from "../../ReactQuery/hooks/useFetchData";
import moment from "moment/moment";
 
import ShimmerPlaceholder, { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
 
 
 
//
const TABS = [{"Tech":1}, {"Creative":2}, {"Content":3}, {"PM":4}, ];
 
export default function ResourcesScreen() {
  const [activeTab, setActiveTab] = useState("Tech");
  const [activeData,setActiveData]=useState([]);
 
  const [searchText, setSearchText] = useState("");
  const [selectedDropdown, setSelectedDropdown] = useState(null);
  const {user}= useContext(AuthContext)
 
 
  const TOKEN=user.token||null;
  const teamId = TABS.find((tab) => activeTab in tab)?.[activeTab]||1;
  const {data,isLoading,isError} = useFetchData(`Resource/GetTeamMembers?teamId=${teamId}`, TOKEN)
  console.log(isError);
     
 
  const HandleTab = async (tab) => {
    setSearchText("");
    setActiveTab(tab);
    console.log(activeTab);
  };
 
  let  FilterTaskData= activeData.filter((emp) =>
    emp.Employee_Name.toLowerCase().includes(searchText.toLowerCase()))
   console.log(FilterTaskData);
 
  useEffect(()=>{
 
    if(data){
      console.log(data);
     
     
      setActiveData(data);
     
    }
  },[data,activeTab,isLoading])
 
    const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)
 
 
 
 
  return (
   
     <View style={{flex:1}}>
     
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={tw`flex-1`}>
      <Text className='mx-3 mb-6  text-lg font-medium'>Task Availability</Text>
       
    <ScrollView style={{flexGrow:1}}>
        <View className="flex-row  justify-evenly m-0 p-0 ">
          {TABS.map((tab) => (
            <TabButton key={tab[Object.keys(tab)]} tab={Object.keys(tab)[0]} activeTab={activeTab} setActiveTab={()=>{HandleTab(Object.keys(tab)[0])}} />
          ))}
        </View>
 
       
        <View className='mx-4 mt-5 mb-2'>
          <Text className={`text-lg `}>Team Utilization:</Text>
          <View className={`flex-row items-center justify-between mt-2 mr-16  `}>
            <GradientProgressBar progress={0.5}  />
            <Text className={'p-2'}>50%</Text>
            <Icon name="infocirlceo" size={18} color="gray" />
          </View>
        </View>
         
        {/* Search Input */}
        <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-100 mx-3  shadow-lg mb-4 mt-2 pr-4 pl-3  pt-3  pb-3">
          <TextInput
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            className="flex-1 pl-3"
           
          />
          <Icon name="search1" size={20} color="gray" />
        </View>
       
 
        {/* Team Members List */}
     
       
       <TeamMember item={FilterTaskData} selectedDropdown={selectedDropdown} setSelectedDropdown={setSelectedDropdown} isLoading={isLoading}/>
      </ScrollView>
      </KeyboardAvoidingView>
     
      </View>
     
  );
}
 
// 💡 Reusable Components
const TabButton = ({ tab, activeTab, setActiveTab }) => (
  <TouchableOpacity onPress={() => setActiveTab(tab)} className="   " style={{minWidth:80, alignSelf:'flext-start', }} >
    <LinearGradient
      colors={activeTab === tab ? ["#D01313", "#6A0A0A"] : ["#333", "#333"]}
      style={tw` rounded-lg`}
    >
      <Text className={` text-white text-center  p-4 `}>{tab}</Text>
    </LinearGradient>
  </TouchableOpacity>
);
 
const GradientProgressBar = ({ progress }) => (
  <View className={`w-full h-2 bg-gray-300 rounded-lg`}>
    <LinearGradient
      colors={["#D01313", "#6A0A0A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[tw`h-full rounded-lg`, { width: `${progress * 100}%` }]}
    />
  </View>
);
 
const TeamMember = ({ item, selectedDropdown, setSelectedDropdown  ,isLoading}) => {
  const handleToggle = (id) => {
    setSelectedDropdown(prev=>prev===id?null:id);
  };
 
 
  if(isLoading){
    return  <ScrollView showsVerticalScrollIndicator={false}>
    {[1, 2, 3,4].map((index) => (
     <View key={index} className="m-1 mb-4 mt-4 bg-white p-4 rounded-lg">
     <ShimmerPlaceholder
       style={{ width: '100%', height: 60, borderRadius: 8, marginBottom: 8 }}
       shimmerColors={['#EBEBEB', '#D9D9D9', '#EBEBEB']}
       autoRun={true}
     />
   </View>
    ))}
  </ScrollView>
  }
 console.log("inside team member",item);
 
 
  return (
 
    <View>
   {item && item.map((emp)=>{ return(<View style={[tw`p-3 rounded-lg shadow-md my-3 mx-3 `, {backgroundColor:'#EBEBEB'}]} key={emp.EmpId}  >
     
      <TouchableOpacity onPress={()=>{handleToggle(emp.EmpId)}} className='flex-row justify-between  items-center'>
        <Text className=' text-center'>{emp.Employee_Name}</Text>
          <MaterialIcons name={selectedDropdown === emp.EmpId ? "keyboard-arrow-down" : "chevron-right"} size={35} color="black" />
          </TouchableOpacity>
          {selectedDropdown === emp.EmpId && (
        <TaskDropdown emp={emp} />
      )}
     
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
 
      )
    })}
 
    </View>
   
  );
};
 
const TaskDropdown = ({ emp }) => {
  // moment().format('MM-DD-YYYY')
  const [selectedDate, setSelectedDate] = useState('01/10/2025');
  const [taskData,setTaskData]=useState([]);
  const [thisWeek,setThisWeek]= useState([]);
  const {user}= useContext(AuthContext)
  const [SearchTask,SetSearchTask]=useState("")
 
  const TOKEN=user.token||null;
  console.log(selectedDate);
  console.log(emp);
 
 
  const {data,isLoading, isError}= useFetchData(`Task/TaskDetails?emp_id=${emp.EmpId}&date_val=${selectedDate}`, TOKEN)
 
 
 
 
   let  FilterTaskData= taskData.filter((member) =>
   
    member.Task_Title.toLowerCase().includes(SearchTask.toLowerCase()))
   
  useEffect(()=>{
    const StartOfWeek= moment().startOf('isoWeek')
    const Dates=[];
 
    for(let i=0;i<5;i++){
      const date= moment(StartOfWeek).add(i,'day')
 
      Dates.push({
         lebel:date.format('ddd'),
         value:date.format('MM-DD-YYYY'),
         day:date.format('DD'),
 
      })
    }
    setThisWeek(Dates)
  },[])
  useEffect(() => {
    if (data?.emp_task_data) {
      console.log(data.emp_task_data);
     
      setTaskData(data.emp_task_data);
    }
  }, [data, isLoading]);
 
  const slideAnim = useRef(new Animated.Value(-3)).current; // Start a bit higher
  const fadeAnim = useRef(new Animated.Value(0)).current;     // Start transparent
 
  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  if(isLoading ){
    <View>
      <Text>Loading......</Text>
    </View>
  }
  if(isError){
    <Text>Something Went Wrong.......</Text>
  }
 
 
 
 
  return (
   
    <Animated.View
    style={[
      {
        transform: [{ translateY: slideAnim }],
        opacity: fadeAnim,
      },
     
    ]}
  >
 
    <View style={[tw`  `,{backgroundColor:'#EBEBEB'}]} >
    <View className={`  rounded-lg `}>
 
          {/* Google search bar */}
         
          <View className="flex-row space-x-3 items-center border border-gray-300 rounded-full   w-2/3 text-white mb-2 mt-2" style={{backgroundColor:'#B4B4B4'}}>
          <Icon name="search1" size={20} color="white" className="p-2" />
     
            <TextInput
             placeholder="Search here "
             onChangeText={SetSearchTask}
             className='w-full text-white'>
             
             
            </TextInput>
          </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="h-[100px] flex-grow-0 mt-2">
  {thisWeek && thisWeek.map((date) => (
    <TouchableOpacity key={date.value} onPress={() => setSelectedDate(date.value)}>
      <LinearGradient
        colors={selectedDate === date.value ? ["#D01313", "#6A0A0A"] : ["#E0E0E0", "#C0C0C0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 20, marginRight: 12, height: 80 }}
      >
        <View className="px-3 py-1 h-[80px] flex justify-center items-center w-[50px] rounded-[20px]">
        <Text className={selectedDate === date.value ? "text-white font-semibold text-sm" : "text-black text-sm"}>{date.day}</Text>
        <Text className={selectedDate === date.value ? "text-white font-bold text-sm" : "text-black text-sm"}>{date.lebel}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  ))}
</ScrollView>
 
 
     
     <View className="border-t border-gray-200  pt-2">
     
  {FilterTaskData.length === 0 && !isLoading? (
    <Text className="text-gray-500 text-center mt-4 text-base">
      No tasks available
    </Text>
  ) : (
    FilterTaskData.map((task) => (
      <View
        key={task.Task_Id}
        className="bg-white rounded-xl shadow-md border border-gray-200 mb-4 p-2 mt-2"
      >
        <View className="mb-2">
          <Text className="text-md font-bold text-gray-800">
            Tittle: {task.Task_Title}
          </Text>
          <View className="mt-1 max-w-[75%]">
            <Text
              className={`text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full w-auto`}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              ID: {task.Task_Id}
            </Text>
          </View>
        </View>
 
        <View  className='space-y-1'>
          <Text className="text-sm text-gray-700">
            <Text className="font-semibold">Logged Hours: </Text>{task.Working_hours}
          </Text>
          <Text className={`text-sm text-gray-700`}>
            <Text className={`font-semibold`}>Production Hours: </Text>{task.Working_hours}
          </Text>
          <Text className="text-sm text-gray-700">
            <Text className="font-semibold">Product Manager: </Text>{task.Taskowner}
          </Text>
        </View>
      </View>
    ))
  )}
</View>
 
 
    </View>
    </View>
    </Animated.View>
  );
};