import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
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

export default function TaskScreen() {
  const { user } = useContext(AuthContext);
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
    // Close all collapsible items when date changes
    setActiveIndex(null);
    refetch();
  }, [selectedDate]);

  const items = [
    { label: "Today", value: today },
    { label: "Yesterday", value: yesterday },
    { label: "Last 7 Days", value: "last7days" },
  ];

  useEffect(() => {
    if (selectedOption === "last7days") {
      setSelectedDate(dates[0].date);
    } else {
      setSelectedDate(selectedOption);
    }
  }, [selectedOption]);

  const formatTaskData = (data) => {
    if (!data?.emp_task_data) return [];
    
    return data.emp_task_data.map((task, index) => ({
      id: index + 1,
      title: task.Task_Title || "No title",
      taskId: task.Task_Id ? task.Task_Id.toString() : "N/A",
      owner: task.Taskowner || "Unknown",
      planned: task.Working_hours ? task.Working_hours.toString() : "0",
      actual: localTaskData[task.Task_Id] || 
             (task.Logged_hours ? task.Logged_hours.toString() : "0"),
    }));
  };

  const handleActualHoursChange = (text, taskId) => {
    if (!/^\d*\.?\d*$/.test(text)) return;
    
    setLocalTaskData(prev => ({
      ...prev,
      [taskId]: text
    }));
  };

  const handleSubmit = async (taskId) => {
    const task = formattedTasks.find(t => t.taskId === taskId);
    if (!task) return;

    setIsProcessing(true);
    try {
      console.log(`Submitting ${task.actual} hours for task ${taskId}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert("Success", "Hours submitted successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to submit hours");
      console.error("Submission error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDateChange = (date) => {
    // Close any open collapsible before changing date
    setActiveIndex(null);
    setSelectedDate(date);
  };

  const formattedTasks = formatTaskData(apiData);
  const filteredTasks = formattedTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTaskItem = (task, index) => (
    <Animated.View
      key={`${task.taskId}-${index}-${selectedDate}`} // Include selectedDate in key to force re-render
      entering={SlideInDown.duration(300)}
      exiting={SlideOutUp.duration(300)}
      className="mb-2 mt-4"
    >
      <TouchableOpacity
        className={`p-3 h-[80px] pl-5 pr-5 flex-row justify-between items-center ${
          activeIndex === index
            ? "bg-white rounded-none rounded-t-lg"
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
        <TouchableWithoutFeedback>
          <View className="p-4 pt-0 bg-white rounded-t-none rounded-b-lg ">
            {["Task Title", "Task Id", "Task Owner"].map((label, i) => (
              <View key={i}>
                <View className="flex-row items-center mb-1">
                  <MaterialCommunityIcons
                    name="star-three-points-outline"
                    size={12}
                    color="black"
                  />
                  <Text className="ml-1">{label}:</Text>
                </View>
                <Text className="font-semibold mb-4 pl-4">
                  {label === "Task Title"
                    ? task.title
                    : label === "Task Id"
                    ? task.taskId
                    : task.owner}
                </Text>
              </View>
            ))}

            <View className="flex-row justify-between p-4 pb-0 pt-0">
              <View className="items-center">
                <Text className="font-semibold mb-2">Planned Hours</Text>
                <TextInput
                  className="border border-gray-300 p-2 w-16 text-center rounded"
                  value={task.planned}
                  editable={false}
                />
              </View>
              <View className="items-center">
                <Text className="font-semibold mb-2">Actual Hours</Text>
                <TextInput
                  className="border border-gray-300 p-2 w-16 text-center rounded"
                  keyboardType="decimal-pad"
                  placeholder="00"
                  maxLength={5}
                  editable={true}
                  onChangeText={text => handleActualHoursChange(text, task.taskId)}
                  value={task.actual}
                />
              </View>
            </View>

            <TouchableOpacity
              className="w-40 p-2 rounded-lg mt-6 self-center"
              onPress={() => handleSubmit(task.taskId)}
              disabled={isProcessing}
            >
              <LinearGradient
                style={{ borderRadius: 12 }}
                colors={["#D01313", "#6A0A0A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-2"
              >
                {isProcessing ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-bold">Submit</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Collapsible>
    </Animated.View>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <ScrollView className="bg-white" showsVerticalScrollIndicator={false}>
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
        </ScrollView>
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredTasks.map((task, index) => renderTaskItem(task, index))}
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 p-4 pt-0 bg-gray-100">
      <DropDown
        open={open}
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

      <Text className="text-lg font-bold mb-2">Task list</Text>
      {renderContent()}
    </View>
  );
}