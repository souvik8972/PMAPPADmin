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
 const today = new Date();
const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
// console.log(formattedDate);

  const {data:utilData,isLoading:utillLoading,isError:utillError} = useFetchData(`Task/GetTeamUtilData?teamId=${teamId}&date_val=${formattedDate}`, TOKEN)
  
const parseTheData = Math.min(utilData?.utilizationPercent ?? 0, 100);


  
   
 
  const HandleTab = async (tab) => {
    setSearchText("");
    setActiveTab(tab);
    // console.log(activeTab);
  };
 
  let  FilterTaskData= activeData.filter((emp) =>
    emp.Employee_Name.toLowerCase().includes(searchText.toLowerCase()))
  //  console.log(FilterTaskData);
 
  useEffect(()=>{
 
    if(data){
      // console.log(data);
     
     
      setActiveData(data?.teamMembers);
     
    }
  },[data,activeTab,isLoading])
 
    const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)
 
 
 
 
  return (
   
     <View style={{flex:1}}>
     
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={tw`flex-1 bg-white`}>
      <Text className='mx-3 mb-4  text-xl font-semibold'>Task Availability</Text>
      <View className="flex-row  justify-evenly m-0 p-0 ">
          {TABS.map((tab) => (
            <TabButton key={tab[Object.keys(tab)]} tab={Object.keys(tab)[0]} activeTab={activeTab} setActiveTab={()=>{HandleTab(Object.keys(tab)[0])}} />
          ))}
        </View>
        <View className='mx-4 mt-3 mb-2'>
          <Text className={`text-lg font-semibold`}>Team Utilization:</Text>
          <View className={`flex-row items-center justify-between mt-0 mr-16 gap-4  `}>
            <GradientProgressBar progress={utilData?.utilizationPercent/100||0/100}  />
            <Text className={'pl- pb-2 pt-1 font-semibold'}>{utilData?.utilizationPercent||0}%</Text>
           
          </View>
        </View>
         {/* Search Input */}
         {/* <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-100 mx-3  shadow-lg mb-4 mt-2 pr-4 pl-3  pt-1  pb-1">
          <TextInput
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            className="flex-1 pl-3 h-[40px]"
           
          />
          <Icon name="search1" size={20} color="gray" />
        </View> */}
    <ScrollView style={{flexGrow:1}}>
      {/* Team Members List */}
       <TeamMember item={FilterTaskData} selectedDropdown={selectedDropdown} setSelectedDropdown={setSelectedDropdown} isLoading={isLoading}/>
      </ScrollView>
      </KeyboardAvoidingView>
     
      </View>
     
  );
}
 
// 💡 Reusable Components
const TabButton = ({ tab, activeTab, setActiveTab }) => (
  <TouchableOpacity onPress={() => setActiveTab(tab)} className="" style={{minWidth:80, alignSelf:'flext-start', }} >
    <LinearGradient
      colors={activeTab === tab ? ["#D01313", "#6A0A0A"] : ["#333", "#333"]}
      style={tw` rounded-lg`}
    >
      <Text className={` text-white text-center  p-2 font-semibold `}>{tab}</Text>
    </LinearGradient>
  </TouchableOpacity>
);
 
const GradientProgressBar = ({ progress }) => (
  <View className={`w-full h-3 bg-gray-300 rounded-lg`}>
    <LinearGradient
      colors={["#D01313", "#6A0A0A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[tw`h-full rounded-lg`, { width: `${progress * 100>100?100:progress * 100}%` }]}
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
//  console.log("inside team member",item);
 
 
  return (
 
    <View>
   {item && item.map((emp)=>{ return(<View style={[tw`p-3 rounded-lg shadow-md my-3 mx-3 `, {backgroundColor:'#f9fafb'}]} key={emp.EmpId}  >
     
      <TouchableOpacity onPress={()=>{handleToggle(emp.EmpId)}} className='flex-row justify-between  items-center'>
        <Text className=' text-center font-semibold'>{emp.Employee_Name}</Text>
          <MaterialIcons name={selectedDropdown === emp.EmpId ? "keyboard-arrow-down" : "chevron-right"} size={35} color="black" />
          </TouchableOpacity>
          {selectedDropdown === emp.EmpId && (
        <TaskDropdown emp={emp} />
      )}
     
       
    </View>
 
      )
    })}
 
    </View>
   
  );
};
 
const TaskDropdown = ({ emp }) => {
  // 
  const [selectedDate, setSelectedDate] = useState(moment().format('MM-DD-YYYY'));
  const [taskData,setTaskData]=useState([]);
  const [thisWeek,setThisWeek]= useState([]);
  const {user}= useContext(AuthContext)
  const [SearchTask,SetSearchTask]=useState("")
 
  const TOKEN=user.token||null;
  // console.log(selectedDate);
  // console.log(emp);
 
 
  const {data,isLoading, isError}= useFetchData(`Task/TaskDetails?date_val=${selectedDate}&emp_id=${emp.EmpId}`, TOKEN)
 
 
 
 
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
    if (data?._Tasks) {
      // console.log(data._Tasks);
     
      setTaskData(data._Tasks);
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
 
    <View style={[tw`  `,{backgroundColor:'#f9fafb'}]} >
    <View className={`  rounded-lg `}>
 
          {/* Google search bar */}
         
          {/* <View className="flex-row space-x-3 items-center border border-gray-300 rounded-full   w-2/3 text-white mb-2 mt-2" style={{backgroundColor:'#B4B4B4'}}>
          <Icon name="search1" size={20} color="white" className="p-2" />
     
            <TextInput
             placeholder="Search here "
             onChangeText={SetSearchTask}
             className='w-full text-white'>
             
             
            </TextInput>
          </View> */}
  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="h-[60px] flex-grow-0 mt-2 mb-2">
  {thisWeek && thisWeek.map((date) => (
    <TouchableOpacity key={date.value} onPress={() => setSelectedDate(date.value)}>
      <LinearGradient
        colors={selectedDate === date.value ? ["#D01313", "#6A0A0A"] : ["#ffffff", "#ffffff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 18,
          marginRight: 10,
          height: 60,
          borderWidth: selectedDate === date.value ? 0 : 1,
          borderColor: selectedDate === date.value ? 'transparent' : '#D1D5DB', 
        }}
      >
        <View className="px-1 py-1 h-[60px] flex justify-center items-center w-[50px] rounded-full">
        <Text className={selectedDate === date.value ? "text-white font-semibold text-sm" : "text-black text-sm"}>{date.day}</Text>
        <Text className={selectedDate === date.value ? "text-white font-bold text-sm" : "text-black text-sm"}>{date.lebel}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  ))}
</ScrollView>
 
 
     
     <View className="border-gray-200  pt-2">
     
     {FilterTaskData.length === 0 && !isLoading ? (
  <Text className="text-gray-500 text-center mt-4 text-base">
    No tasks available
  </Text>
) : (
  FilterTaskData.map((task) => (
    <View
      key={task.Task_Id}
      className="bg-white rounded-xl mb-3 px-4 py-3"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className="flex-row justify-between items-center mb-4">
        <Text
          className="text-base font-semibold text-gray-900 flex-1 mr-2"
          numberOfLines={1}
        >
          {task.Task_Title}
        </Text>
        <Text className="text-[11px] font-medium text-white bg-blue-500 px-2 py-0.5 rounded-md">
          #{task.Task_Id}
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-2">
        <View className="bg-green-100 px-2 py-1 rounded-lg">
          <Text className="text-sm text-green-800 font-semibold">
          Planned: {task.Working_hours}h
          </Text>
        </View>

        <View className="px-2 bg-green-100 py-1 rounded-lg">
          <Text className="text-sm font-semibold" style={{ color: '#213448' }}>
            Logged: {task.Logged_hours}h
          </Text>
        </View>

        <View className="px-2 py-1 rounded-full">
          <Text className="text-sm font-semibold">
             👤 {`${task.Taskowner?.split(' ')[0]} ${task.Taskowner?.split(' ')[1]?.[0] || ''}`}
          </Text>
        </View>
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