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
  // Initialize localTaskData when apiData changes
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

  // Pull-to-refresh handler
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
  
    const logValue = localTaskData[taskId];
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
    <View key={`${task.taskId}-${index}`} className="mb-2">
      <TouchableOpacity
        className={`p-3 h-[80px] pl-5 pr-5 flex-row justify-between items-center ${
          activeIndex === index
            ? "bg-white rounded-none rounded-t-lg border-[0.5px] border-b-0"
            : "bg-[#EBEBEB] rounded-lg shadow-[0px_5px_3px_1px_rgba(0,_0,_0,_0.1)]"
        }`}
        onPress={() => setActiveIndex(activeIndex === index ? null : index)}
        activeOpacity={0.8}
      >
        <Text className="text-black font-semibold text-[14px] truncate w-[85%]">
          {task.title}
        </Text>
        <FontAwesome
          name={activeIndex === index ? "angle-up" : "angle-down"}
          size={28}
          color="black"
        />
      </TouchableOpacity>

      <Collapsible collapsed={activeIndex !== index}>
        <TouchableWithoutFeedback onPress={() => setActiveIndex(null)}>
          <View className="border-[0.5px] rounded-xl rounded-t-none pb-6">
            {/* Task ID */}
            <View className="px-4 pt-4 pb-4 border-b border-gray-200">
              <View className="flex-row items-center mb-1">
                <MaterialCommunityIcons name="identifier" size={16} color="#6b7280" className="mr-2" />
                <Text className="text-gray-500 text-sm font-medium">Task ID</Text>
              </View>
              <Text className="text-gray-900 text-base font-semibold pl-6">{task.taskId}</Text>
            </View>

            {/* Task Owner */}
            <View className="px-4 pt-5 pb-4 border-b border-gray-200">
              <View className="flex-row items-center mb-1">
                <MaterialCommunityIcons name="account" size={16} color="#6b7280" className="mr-2" />
                <Text className="text-gray-500 text-sm font-medium">Task Owner</Text>
              </View>
              <Text className="text-gray-900 text-base font-semibold pl-6">{task.owner}</Text>
            </View>

            {/* Hours Section */}
            <View className="flex-row justify-between px-4 py-6">
              {/* Planned Hours */}
              <View className="items-center">
                <View className="flex-row items-center mb-2">
                  <MaterialCommunityIcons name="clock-outline" size={16} color="#6b7280" className="mr-1" />
                  <Text className="text-gray-600 text-sm font-medium">Planned Hours</Text>
                </View>
                <TextInput
                  className="bg-gray-100 border border-gray-300 px-4 py-2 w-20 rounded-lg text-center text-sm font-medium text-gray-800"
                  value={task.planned}
                  style={{textAlign: "center"}}
                  editable={false}
                />
              </View>

              {/* Actual Hours */}
              <View className="items-center">
                <View className="flex-row items-center mb-2">
                  <MaterialCommunityIcons name="clock-check-outline" size={16} color="#6b7280" className="mr-1" />
                  <Text className="text-gray-600 text-sm font-medium">Actual Hours</Text>
                </View>
                <TextInput
      className="bg-white border border-gray-300 px-4 py-2 w-20 rounded-lg text-center text-sm font-medium text-gray-800 focus:border-red-500"
      keyboardType="decimal-pad"
      placeholder="0"
      maxLength={5}
      value={task.actual}
      onChangeText={(text) => handleActualHoursChange(text, task.taskId)}
      onFocus={() => {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: index,
            viewOffset: 50, // Adjust this value as needed
            animated: true
          });
        }, 100);
      }}
    />

              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className="mx-6 mt-2 rounded-xl overflow-hidden"
              onPress={() => handleSubmit(task.taskId)}
              disabled={isProcessing}
            >
              <LinearGradient
                colors={["#D01313", "#6A0A0A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{paddingLeft: 10, paddingRight: 10 ,height: 50,display:"flex",justifyContent:"center",alignItems:"center"}}
                className="py-3 px-6 rounded-xl shadow-md"
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
        </TouchableWithoutFeedback>
      </Collapsible>
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
        renderItem={({ item, index }) => renderTaskItem(item, index)}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
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
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View className="flex-1 bg-white">
        <View className="p-4 pt-0">
          <DropDown
            open={open}
            setActiveIndex={setActiveIndex}
            setOpen={setOpen}
            items={items}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />

          <View className="flex-row items-center border border-gray-300 shadow-[0px_5px_3px_1px_rgba(0,_0,_0,_0.1)] rounded-[12px] h-[60px] p-2 my-4 bg-white">
            <TextInput
              placeholder="Search your task"
              className="flex-1 text-black"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FontAwesome
              name="search"
              size={20}
              color="gray"
              style={{ marginRight: 8 }}
            />
          </View>

          {selectedOption === "last7days" && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="h-[100px] flex-grow-0 mb-2"
            >
              {dates.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleDateChange(item.date)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      selectedDate === item.date
                        ? ["#D01313", "#6A0A0A"]
                        : ["#E0E0E0", "#C0C0C0"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 20,
                      marginRight: 12,
                      height: 80,
                      width: 50,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View className="items-center">
                      <Text
                        className={
                          selectedDate === item.date
                            ? "text-white font-bold text-xs"
                            : "text-black font-semibold text-xs"
                        }
                      >
                        {item.label.split(" ")[0]}
                      </Text>
                      <Text
                        className={
                          selectedDate === item.date
                            ? "text-white font-bold text-base"
                            : "text-black font-semibold text-base"
                        }
                      >
                        {item.label.split(" ")[1]}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <Text style={{fontWeight:600 }} className="text-lg underline font-bold mb-2">My Task list</Text>
        </View>

        <View className="flex-1 bg-white p-3">
     
        {renderContent()}
      </View>
      </View>
    </KeyboardAvoidingView>
  );
}