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
  Keyboard,
  LayoutAnimation,
  FlatList
} from "react-native";
import Collapsible from "react-native-collapsible";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import DropDown from "../../components/TaskList/DropDown";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../../context/AuthContext";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { useFetchData } from "../../ReactQuery/hooks/useFetchData";
import { API_URL } from '@env';
import { getLast7Weekdays, getFormattedDate } from "../../utils/functions/last7Days";
import {isTokenValid} from '@/utils/functions/checkTokenexp';
import  { Toast } from 'toastify-react-native'
// Configure layout animation
LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export default function TaskScreen() {
  const { user,accessTokenGetter, logout } = useContext(AuthContext);
  const flatListRef = useRef(null);
  const itemRefs = useRef({});
  const inputRefs = useRef({});

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
      const floatValue = parseFloat(text) || 0;
      if (floatValue <= 9) {
        setLocalTaskData(prev => ({
          ...prev,
          [taskId]: text
        }));
      }
    }
  };

  const handleInputFocus = (index) => {
    setActiveIndex(index);
    
    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: index,
          viewOffset: 150, // Increased offset for better visibility
          animated: true,
        });
      }, 350); // Slightly longer delay to ensure expansion completes
    });
  };

  const handleItemPress = (index) => {
    Keyboard.dismiss();
    const newIndex = activeIndex === index ? null : index;
    setActiveIndex(newIndex);
    
    if (newIndex !== null) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: index,
          viewOffset: 100,
          animated: true,
        });
      }, 300);
    }
  };

  const handleSubmit = async (taskId) => {
    const task = apiData?._Tasks?.find(t => t.Task_Id.toString() === taskId);
    if (!task) return;
  
    const logValue = localTaskData[taskId]||0;
    if (!logValue || isNaN(logValue)) {
      // Alert.alert("Error", "Invalid log value");
      Toast.error("Invalid log value");
      return;
    }
  
    setIsProcessing(true);

    try {
    //   const tokenvalid= await isTokenValid(user,logout)
    //  if(!tokenvalid) {
    //     // alert("Session expired. Please log in again.");
    //     Toast.error("Session expired. Please log in again.");
    //     return;
    //   }
    const token = await accessTokenGetter();

      const response = await fetch(
        `${API_URL}Task/SendActualHours?TimelogId=${task.LogId}&TaskId=${task.Task_Id}&Emp_Id=${user.empId}&logDate=${encodeURIComponent(selectedDate)}&Log=${logValue}&Billing_type=${task.Billing_Type}&Notes=Na`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({}) 
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to send actual hours");
      }
      
      refetch();
      // Toast.success('Success message!');
      Toast.success("Hours submitted successfully");
    } catch (error) {
      Toast.error("Failed to submit hours");
    } finally {
      Keyboard.dismiss()
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

  const renderTaskItem = ({item: task, index}) => (
    <View 
      key={`${task.taskId}-${index}`} 
      className="mb-4"
      ref={ref => itemRefs.current[index] = ref}
    >
      <TouchableOpacity
        className={`p-5 rounded-lg ${activeIndex === index ? "bg-white" : "bg-gray-50"}`}
        onPress={() => handleItemPress(index)}
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
          <Text style={{lineHeight: 22}} className="text-gray-800 font-semibold text-[16px] flex-1 pr-2" numberOfLines={activeIndex === index ? undefined : 1}>
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
            <View className="mb-3">
              <View className="flex-row items-center">
                <Text className="text-gray-500 text-sm font-medium ">Task ID</Text>
              </View>
              <Text className="text-gray-900 text-base font-semibold"># {task.taskId}</Text>
            </View>

            <View className="mb-4">
              <View className="flex-row items-center">
                <Text className="text-gray-500 text-sm font-medium ">Task Owner</Text>
              </View>
              <Text className="text-gray-900 text-base font-semibold ">👤 {task.owner}</Text>
            </View>

            <View className="flex-row gap-6 justify-start flex-none mb-6">
              <View className="flex-none justify-center flex mr-4">
                <View className="flex-row items-center mb-1">
                  <Text className="text-gray-600 text-sm font-medium ">Planned Hours</Text>
                </View>
                <View style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                  backgroundColor: "#f3f4f6", 
                  borderRadius: 8,
                }}
                className="w-20 mx-2"
                >
                  <TextInput
                    className="bg-gray-100 px-4 py-2 w-20 rounded-lg text-center text-md font-semibold text-gray-800"
                    value={task.planned}
                    editable={false}
                    style={{
                      textAlign: "center",
                    }}
                  />
                </View>
              </View>

              <View className="">
                <View className="flex-row items-center mb-1">
                  <Text className="text-gray-600 text-sm font-medium">Actual Hours</Text>
                </View>
                <View
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    backgroundColor: "#fff", 
                    borderRadius: 8,
                  }}
                  className="w-20"
                >
                  <TextInput
                    ref={ref => inputRefs.current[task.taskId] = ref}
                    className="px-4 py-2 text-center text-md font-md text-gray-800 font-semibold"
                    keyboardType="decimal-pad"
                    placeholder=""
                    maxLength={5}
                    value={task.actual}
                    onChangeText={(text) => handleActualHoursChange(text, task.taskId)}
                    onFocus={() => {
                      handleInputFocus(index);
                      setTimeout(() => {
                        inputRefs.current[task.taskId]?.focus();
                      }, 100);
                    }}
                    showSoftInputOnFocus={true}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              className="rounded-lg overflow-hidden"
              onPress={() => handleSubmit(task.taskId)}
              disabled={isProcessing}
            >
              <LinearGradient
                colors={["#D01313", "#6A0A0A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className=" rounded-lg"
              >
                <View className="flex-row justify-center p-4 items-center">
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
      <FlatList
        data={filteredTasks}
        showsVerticalScrollIndicator={false}
        ref={flatListRef}
        style={{flex: 1, marginBottom: 10, padding: 8}}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: 20 }}
        getItemLayout={(data, index) => (
          {
            length: activeIndex === index ? 350 : 100,
            offset: (activeIndex === index ? 350 : 100) * index,
            index
          }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#D01313"
            colors={["#D01313"]}
          />
        }
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              viewOffset: 100,
              animated: true,
            });
          });
        }}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.select({
        ios: 90,
        android: 0 // Let Android handle it natively
      })}
      enabled={Platform.OS === "ios"} 
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-gray-50">
          <View className="p-4 pt-0 pb-1 z-40">
            <DropDown
              open={open}
              setActiveIndex={setActiveIndex}
              setOpen={setOpen}
              items={items}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />

            <View className="flex-row items-center border border-gray-200 rounded-lg h-[40px] px-4 my-4 bg-white">
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
                      className={`h-[70px] w-[50px] rounded-xl justify-center items-center border border-gray-200 ${
                        selectedDate === item.date ? "bg-gray-200" : "bg-white"
                      }`}
                    >
                      <Text
                        className={`${
                          selectedDate === item.date ? "text-gray" : "text-gray-800"
                        } font-bold text-xs`}
                      >
                        {item.label.split(" ")[0]}
                      </Text>
                      <Text
                        className={`${
                          selectedDate === item.date ? "text-gray" : "text-gray-800"
                        } font-bold text-base mt-1`}
                      >
                        {item.label.split(" ")[1]}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <Text className="text-lg font-semibold text-gray-800">My Task List</Text>
          </View>

          <View className="flex-1 px-2">
            {renderContent()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}