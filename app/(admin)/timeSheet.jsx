import React, { useState, useContext, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Collapsible from "react-native-collapsible";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import DropDown from "../../components/TaskList/DropDown";
import Animated, { SlideInDown, SlideOutUp } from "react-native-reanimated";
import { getLast7Weekdays, getFormattedDate } from "../../utils/functions/last7Days";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../../context/AuthContext";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { useFetchData } from "../../ReactQuery/hooks/useFetchData";
import { usePostData } from "../../ReactQuery/hooks/usePostData";
import { API_URL } from '@env';

export default function TaskScreen() {
  const { user } = useContext(AuthContext);
  const scrollViewRef = useRef();
  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

  const today = getFormattedDate(0);
  const yesterday = getFormattedDate(1);
  const dates = getLast7Weekdays();

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localTaskData, setLocalTaskData] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: apiData,
    isLoading,
    error: apiError,
    refetch,
  } = useFetchData(
    `Task/TaskDetails?emp_id=${user.empId}&date_val=${selectedDate}`,
    user.token
  );
  const flatListRef = useRef(null);

  useEffect(() => {
    if (apiData?._Tasks) {
      const initialData = {};
      apiData._Tasks.forEach(task => {
        if (task.Task_Id) {
          if (localTaskData[task.Task_Id] === undefined) {
            initialData[task.Task_Id] = task.Logged_hours?.toString() || "0";
          }
        }
      });
      setLocalTaskData(prev => ({ ...prev, ...initialData }));
    }
  }, [apiData]);

  const items = [
    { label: "Today", value: today },
    { label: "Yesterday", value: yesterday },
    { label: "Last 7 Days", value: "last7days" },
  ];

  useEffect(() => {
    setActiveIndex(null);
    if (selectedOption === "last7days") {
      setSelectedDate(dates[0].date);
    } else {
      setSelectedDate(selectedOption);
    }
  }, [selectedOption]);

  const onRefresh = () => {
    setRefreshing(true);
    refetch().then(() => {
      setRefreshing(false);
    }).catch(() => {
      setRefreshing(false);
    });
  };

  const formatTaskData = (data) => {
    if (!data?._Tasks) return [];
    
    return data?._Tasks?.map((task) => {
      const taskId = task.Task_Id ? task.Task_Id.toString() : "N/A";
      
      return {
        id: taskId,
        title: task.Task_Title || "No title",
        taskId: taskId,
        owner: task.Taskowner || "Unknown",
        planned: task.Working_hours ? task.Working_hours.toString() : "0",
        actual: localTaskData[task.Task_Id] !== undefined 
              ? localTaskData[task.Task_Id] 
              : (task.Logged_hours ? task.Logged_hours.toString() : "0"),
      };
    });
  };

  const handleActualHoursChange = (text, taskId) => {
    if (/^\d*\.?\d*$/.test(text)) {
      setLocalTaskData(prev => ({
        ...prev,
        [taskId]: text
      }));
    }
  };

  const handleSubmit = async (taskId) => {
    const task = apiData?._Tasks?.find(t => t.Task_Id.toString() === taskId);
    if (!task) return;
  
    const logValue = localTaskData[taskId]||0;
    if (!logValue || isNaN(logValue)) {
      Alert.alert("Error", "Invalid log value");
      return;
    }
  
    setIsProcessing(true);
  
    try {
      const response = await fetch(
        `${API_URL}Task/SendActualHours?TimelogId=${task.LogId}&TaskId=${task.Task_Id}&Emp_Id=${user.empId}&logDate=${encodeURIComponent(selectedDate)}&Log=${logValue}&Billing_type=${task.Billing_Type}&Notes=Na`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({}) 
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to send actual hours");
      }
      
      refetch();
      Alert.alert("Success", "Hours submitted successfully");
    } catch (error) {
      console.log("Submission error:", error);
      Alert.alert("Error", "Failed to submit hours");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDateChange = (date) => {
    setActiveIndex(null);
    setSelectedDate(date);
  };

  const formattedTasks = useMemo(() => formatTaskData(apiData), [apiData, localTaskData]);
  const filteredTasks = formattedTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTaskItem = (task, index) => (
    <View key={`${task.taskId}-${index}`} className="mb-4 ">
      <TouchableOpacity
        className={`p-4 rounded-lg ${activeIndex === index ? "bg-white" : "bg-gray-50"}`}
        onPress={() => setActiveIndex(activeIndex === index ? null : index)}
        activeOpacity={0.8}
        style={{
          shadowColor: "#000",
         
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-800 font-semibold text-[15px] flex-1 pr-2" numberOfLines={1}>
            {task.title}
          </Text>
          <FontAwesome
            name={activeIndex === index ? "angle-up" : "angle-down"}
            size={24}
            color="#6b7280"
          />
        </View>

        <Collapsible collapsed={activeIndex !== index}>
          <View className="mt-4">
            {/* Task ID */}
            <View className="mb-4 ">
              <View className="flex-row items-center mb-1">
                <Text className="text-gray-500 text-sm font-medium">#</Text>
                <Text className="text-gray-500 text-sm font-medium ml-2">Task ID</Text>
              </View>
              <Text className="text-gray-900 text-base font-semibold ml-6">{task.taskId}</Text>
            </View>

            {/* Task Owner */}
            <View className="mb-4">
              <View className="flex-row items-center mb-1">
                <MaterialCommunityIcons name="account" size={16} color="#6b7280" />
                <Text className="text-gray-500 text-sm font-medium ml-2">Task Owner</Text>
              </View>
              <Text className="text-gray-900 text-base font-semibold ml-6">{task.owner}</Text>
            </View>

            {/* Hours Section */}
            <View className="flex-row justify-between  m-0 mb-6">
              {/* Planned Hours */}
              <View className="  flex-1 pl-2">
                <View className="flex-row items-center mb-2">
                  <MaterialCommunityIcons name="clock-outline" size={16} color="#6b7280" />
                  <Text className="text-gray-600 text-sm font-medium ml-1">Planned</Text>
                </View>
                <TextInput
                  className="bg-gray-100 px-4 py-2 w-20 rounded-lg text-center text-sm font-medium text-gray-800"
                  value={task.planned}
                  style={{textAlign: "center"}}
                  editable={false}
                />
              </View>

              {/* Actual Hours */}
              <View className="items-end flex-1 pr-2">
                <View className="flex-row items-center mb-2">
                  <MaterialCommunityIcons name="clock-check-outline" size={16} color="#6b7280" />
                  <Text className="text-gray-600 text-sm font-medium ml-1">Actual</Text>
                </View>
                <TextInput
                  className="bg-white border border-gray-200 px-4 py-2 w-20 rounded-lg text-center text-sm font-medium text-gray-800"
                  keyboardType="decimal-pad"
                  placeholder=""
                  maxLength={5}
                  value={task.actual}
                  onChangeText={(text) => handleActualHoursChange(text, task.taskId)}
                  onFocus={() => {
                    setTimeout(() => {
                      flatListRef.current?.scrollToIndex({
                        index: index,
                        viewOffset: 50,
                        animated: true
                      });
                    }, 100);
                  }}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className="rounded-lg overflow-hidden"
              onPress={() => handleSubmit(task.taskId)}
              disabled={isProcessing}
            >
              <LinearGradient
                colors={["#D01313", "#6A0A0A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="py-3 rounded-lg"
              >
                <View className="flex-row justify-center items-center">
                  {isProcessing ? (
                    <ActivityIndicator color="white" size="small" className="mr-2" />
                  ) : (
                    <>
                      <MaterialCommunityIcons
                        name="send-check"
                        size={16}
                        color="white"
                        className="mr-2"
                      />
                      <Text className="text-white font-bold text-sm">SUBMIT HOURS</Text>
                    </>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Collapsible>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (isLoading && !refreshing) {
      return (
        <View className="flex-1">
          {[1, 2, 3, 4, 5].map(index => (
            <View key={index} className="m-1 mb-4 mt-4 bg-white p-4 rounded-lg">
              <ShimmerPlaceholder
                style={{
                  width: "100%",
                  height: 60,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
                shimmerColors={["#EBEBEB", "#D9D9D9", "#EBEBEB"]}
                autoRun={true}
              />
            </View>
          ))}
        </View>
      );
    }

    if (apiError) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 mb-2">Error loading tasks</Text>
          <TouchableOpacity
            onPress={refetch}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            <Text className="text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (filteredTasks.length === 0) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">No tasks available for this date</Text>
        </View>
      );
    }

    return (
      <Animated.FlatList
        data={filteredTasks}
        ref={flatListRef} 
        style={{marginBottom: 10,padding:8}}
        renderItem={({ item, index }) => renderTaskItem(item, index)}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{  }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#D01313"
            colors={["#D01313"]}
          />
        }
      />
    );
  };

  return (
   <KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  style={{ flex: 1 }}
  keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}  // Increased offset
>
      <View className="flex-1 bg-gray-50">
        <View className="p-4 pt-0">
          <DropDown
            open={open}
            setActiveIndex={setActiveIndex}
            setOpen={setOpen}
            items={items}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />

          <View className="flex-row items-center border border-gray-200 rounded-lg h-[50px] px-4 my-4 bg-white">
            <TextInput
              placeholder="Search your task"
              className="flex-1 text-gray-800"
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FontAwesome
              name="search"
              size={18}
              color="#9ca3af"
              style={{ marginRight: 8 }}
            />
          </View>

          {selectedOption === "last7days" && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="h-[80px] flex-grow-0 mb-2"
              contentContainerStyle={{ paddingHorizontal: 8 }}
            >
              {dates.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleDateChange(item.date)}
                  activeOpacity={0.8}
                  className="mr-3"
                >
                  <View
                    className={`h-[70px] w-[50px] rounded-xl justify-center items-center ${
                      selectedDate === item.date ? "bg-[#D01313]" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={`${
                        selectedDate === item.date ? "text-white" : "text-gray-800"
                      } font-bold text-xs`}
                    >
                      {item.label.split(" ")[0]}
                    </Text>
                    <Text
                      className={`${
                        selectedDate === item.date ? "text-white" : "text-gray-800"
                      } font-bold text-base mt-1`}
                    >
                      {item.label.split(" ")[1]}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <Text className="text-lg font-semibold text-gray-800 ">My Task List</Text>
        </View>

        <View className="flex-1 px-2">
          {renderContent()}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}