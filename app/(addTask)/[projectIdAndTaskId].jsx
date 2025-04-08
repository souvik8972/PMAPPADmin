import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Easing,
} from "react-native";
import { Feather, AntDesign, MaterialIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const AddEditTask = () => {
  const navigation = useNavigation();
  const route = useRoute();
const [projectId, taskId] = route.params?.projectIdAndTaskId.split("-") || [null, null];
  
  const isEditMode = !!taskId;
  
  const [taskName, setTaskName] = useState("");
  const [client, setClient] = useState(null);
  const [status, setStatus] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [clientOpen, setClientOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [clients, setClients] = useState([
    { label: "Client A", value: "Client A" },
    { label: "Client B", value: "Client B" },
    { label: "Client C", value: "Client C" },
  ]);
  const [statuses, setStatuses] = useState([
    { label: "Open", value: "Open" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
  ]);

  const [selectedResources, setSelectedResources] = useState([]);
  const [resourceInput, setResourceInput] = useState("");
  const [showResourceDropdown, setShowResourceDropdown] = useState(false);
  const fakeUsers = ["Vishwnath", "Prajwal K", "John Doe", "Jane Smith", "Alice Brown"];

  const [showHoursInput, setShowHoursInput] = useState(false);
  const [dateHours, setDateHours] = useState({});
  const [rotateAnim] = useState(new Animated.Value(0));

  // Load task data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      // Here you would typically fetch the task data based on taskId
      // For now, we'll simulate loading some data
      const fetchTaskData = async () => {
        // Simulate API call
        const mockTaskData = {
          taskName: "Sample Task",
          client: "Client B",
          status: "In Progress",
          startDate: new Date(2023, 5, 15),
          endDate: new Date(2023, 5, 20),
          teamMembers: ["Vishwnath", "Prajwal K"],
          hours: {
            "15/06/2023": 8,
            "16/06/2023": 6,
          }
        };
        
        setTaskName(mockTaskData.taskName);
        setClient(mockTaskData.client);
        setStatus(mockTaskData.status);
        setStartDate(mockTaskData.startDate);
        setEndDate(mockTaskData.endDate);
        setSelectedResources(mockTaskData.teamMembers);
        
        if (mockTaskData.hours) {
          setDateHours(mockTaskData.hours);
          setShowHoursInput(true);
        }
      };
      
      fetchTaskData();
    }
  }, [isEditMode, taskId]);

  const toggleHoursInput = () => {
    setShowHoursInput(!showHoursInput);
    Animated.timing(rotateAnim, {
      toValue: showHoursInput ? 0 : 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const addResource = (name) => {
    if (name && !selectedResources.includes(name)) {
      setSelectedResources([...selectedResources, name]);
    }
    setResourceInput("");
    setShowResourceDropdown(false);
  };

  const removeResource = (name) => {
    setSelectedResources(selectedResources.filter((res) => res !== name));
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === "ios");
    setStartDate(currentDate);
    if (endDate < currentDate) {
      setEndDate(currentDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === "ios");
    if (currentDate >= startDate) {
      setEndDate(currentDate);
    } else {
      Alert.alert("Invalid Date", "End date cannot be before start date");
      setEndDate(startDate);
    }
  };

  const getDatesInRange = (start, end) => {
    const date = new Date(start);
    const dates = [];
    while (date <= end) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };

  const handleSubmit = () => {
    const taskData = {
      taskName,
      client,
      status,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      teamMembers: selectedResources,
      hours: showHoursInput ? dateHours : null,
    };
    
    if (isEditMode) {
      console.log("Updated Task Data:", taskData);
      Alert.alert("Success", "Task has been updated successfully!");
      navigation.goBack();
    } else {
      console.log("New Task Data:", taskData);
      Alert.alert("Success", "Task has been created successfully!");
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-center p-4 pb-2 border-slate-200 bg-white shadow-sm">
        <TouchableOpacity onPress={() => navigation.goBack()} className="absolute left-4 p-2 z-10">
          <AntDesign name="arrowleft" size={24} color="#4b5563" />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold text-slate-800">
          {isEditMode ? "Edit Task" : "Add Task"}
        </Text>
      </View>

      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View>
            <Text className="text-sm font-medium text-slate-600 mb-1">Task Name</Text>
            <View className="bg-white rounded-lg border border-slate-200 shadow-xs mb-3">
              <TextInput
                value={taskName}
                onChangeText={setTaskName}
                placeholder="Enter task name"
                placeholderTextColor="#9ca3af"
                className="h-12 px-4 text-slate-800"
              />
            </View>

            <Text className="text-sm font-medium text-slate-600 mb-1">Client Name</Text>
            <View className="z-50 mb-3">
              <DropDownPicker
                open={clientOpen}
                value={client}
                items={clients}
                setOpen={setClientOpen}
                setValue={setClient}
                setItems={setClients}
                placeholder="Select a client"
                placeholderStyle={{ color: "#9ca3af" }}
                style={{ backgroundColor: "#fff", borderColor: "#e2e8f0", borderRadius: 8, minHeight: 48 }}
                dropDownContainerStyle={{ backgroundColor: "#fff", borderColor: "#e2e8f0", borderRadius: 8, marginTop: 2 }}
                textStyle={{ fontSize: 16, color: "#1e293b" }}
                labelStyle={{ fontWeight: "500" }}
                listMode="SCROLLVIEW"
                nestedScrollEnabled={true}
                ArrowDownIconComponent={() => <Feather name="chevron-down" size={18} color="#64748b" />}
                ArrowUpIconComponent={() => <Feather name="chevron-up" size={18} color="#64748b" />}
              />
            </View>

            <Text className="text-sm font-medium text-slate-600 mb-1">Status</Text>
            <View className="z-40 mb-3">
              <DropDownPicker
                open={statusOpen}
                value={status}
                items={statuses}
                setOpen={setStatusOpen}
                setValue={setStatus}
                setItems={setStatuses}
                placeholder="Select status"
                placeholderStyle={{ color: "#9ca3af" }}
                style={{ backgroundColor: "#fff", borderColor: "#e2e8f0", borderRadius: 8, minHeight: 48 }}
                dropDownContainerStyle={{ backgroundColor: "#fff", borderColor: "#e2e8f0", borderRadius: 8, marginTop: 2 }}
                textStyle={{ fontSize: 16, color: "#1e293b" }}
                labelStyle={{ fontWeight: "500" }}
                listMode="SCROLLVIEW"
                nestedScrollEnabled={true}
                ArrowDownIconComponent={() => <Feather name="chevron-down" size={18} color="#64748b" />}
                ArrowUpIconComponent={() => <Feather name="chevron-up" size={18} color="#64748b" />}
              />
            </View>

            <View className="flex-row justify-between mb-3">
              <View className="w-[48%]">
                <Text className="text-sm font-medium text-slate-600 mb-1">Start Date</Text>
                <TouchableOpacity onPress={() => setShowStartDatePicker(true)} className="rounded-lg border bg-red-800 h-12 px-4 flex-row items-center justify-between">
                  <Text className="text-white">{formatDate(startDate)}</Text>
                  <Feather name="calendar" size={18} color="white" />
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={handleStartDateChange}
                    minimumDate={isEditMode ? undefined : new Date()}
                  />
                )}
              </View>
              <View className="w-[48%]">
                <Text className="text-sm font-medium text-slate-600 mb-1">End Date</Text>
                <TouchableOpacity onPress={() => setShowEndDatePicker(true)} className="rounded-lg border bg-red-800 h-12 px-4 flex-row items-center justify-between">
                  <Text className="text-white">{formatDate(endDate)}</Text>
                  <Feather name="calendar" size={18} color="white" />
                </TouchableOpacity>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={handleEndDateChange}
                    minimumDate={startDate}
                  />
                )}
              </View>
            </View>

            {/* Team Members Section */}
            <Text className="text-sm font-medium text-slate-600 mb-1">Team Members</Text>
            <View className="mb-3">
              <View className="bg-white rounded-lg border border-slate-200 shadow-xs">
                <TextInput
                  value={resourceInput}
                  onChangeText={(text) => {
                    setResourceInput(text);
                    setShowResourceDropdown(text.length > 0);
                  }}
                  placeholder="Add team members"
                  placeholderTextColor="#9ca3af"
                  className="h-12 px-4 text-slate-800"
                />
              </View>
              
              {showResourceDropdown && (
                <View className="mt-1 bg-white border border-slate-200 rounded-lg max-h-40">
                  <ScrollView>
                    {fakeUsers
                      .filter(user => 
                        user.toLowerCase().includes(resourceInput.toLowerCase()) &&
                        !selectedResources.includes(user)
                      )
                      .map((user, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => addResource(user)}
                          className="px-4 py-2 border-b border-slate-100"
                        >
                          <Text className="text-slate-800">{user}</Text>
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
              )}
              
              {selectedResources.length > 0 && (
                <View className="flex-row flex-wrap mt-2">
                  {selectedResources.map((resource, index) => (
                    <View key={index} className="flex-row items-center bg-slate-100 rounded-full px-3 py-1 mr-2 mb-2">
                      <Text className="text-slate-700 mr-1">{resource}</Text>
                      <TouchableOpacity onPress={() => removeResource(resource)}>
                        <Feather name="x" size={16} color="#64748b" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Hours Input Section */}
            <TouchableOpacity 
              onPress={toggleHoursInput}
              className="flex-row items-center justify-between bg-slate-50 p-3 rounded-lg mb-3"
            >
              <Text className="text-slate-700 font-medium">Add Hours for Specific Dates</Text>
              <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                <Feather name="chevron-down" size={20} color="#64748b" />
              </Animated.View>
            </TouchableOpacity>

            {showHoursInput && (
              <View className="mb-4 border border-slate-200 rounded-lg p-3">
                <Text className="text-sm font-medium text-slate-600 mb-2">Enter Hours</Text>
                {getDatesInRange(startDate, endDate).map((date, index) => {
                  const dateStr = formatDate(date);
                  return (
                    <View key={index} className="flex-row items-center justify-between mb-2">
                      <Text className="text-slate-700 w-24">{dateStr}</Text>
                      <TextInput
                        value={dateHours[dateStr] ? dateHours[dateStr].toString() : ""}
                        onChangeText={(text) => {
                          const num = text === "" ? 0 : parseInt(text, 10);
                          setDateHours(prev => ({
                            ...prev,
                            [dateStr]: isNaN(num) ? 0 : num
                          }));
                        }}
                        placeholder="0"
                        keyboardType="numeric"
                        className="flex-1 ml-2 bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
                      />
                      <Text className="text-slate-500 ml-2">hours</Text>
                    </View>
                  );
                })}
              </View>
            )}

            <TouchableOpacity onPress={handleSubmit} activeOpacity={0.9} className="rounded-lg h-14 justify-center items-center mt-4 shadow-md flex-row">
              <LinearGradient 
                colors={["#D01313", "#6A0A0A"]} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 0 }}
                style={{ 
                  width: '100%',
                  borderRadius: 8, 
                  alignItems: "center", 
                  justifyContent: "center", 
                  flexDirection: "row", 
                  shadowColor: "#000", 
                  shadowOffset: { width: 0, height: 2 }, 
                  shadowOpacity: 0.25, 
                  shadowRadius: 3.84, 
                  elevation: 5,
                  height: 56
                }}
              >
                <Text className="text-white font-semibold text-lg mr-2">
                  {isEditMode ? "Update Task" : "Add Task"}
                </Text>
                <MaterialIcons name="arrow-forward" size={24} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddEditTask;