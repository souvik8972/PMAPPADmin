import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddTask = () => {
  const navigation = useNavigation();
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
  const fakeUsers = ["Vishwnath", "Prajwal K", "John Doe", "Jane Smith", "Alice Brown"];

  const [showHoursInput, setShowHoursInput] = useState(false);
  const [dateHours, setDateHours] = useState({});
  const [rotateAnim] = useState(new Animated.Value(0));

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
    
    console.log("Task Data:", taskData);
    Alert.alert("Success", "Task has been created successfully!");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="flex-row items-center justify-center p-4 pb-2 border-b border-slate-200 bg-white shadow-sm">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="absolute left-4 p-2 z-10"
        >
          <AntDesign name="arrowleft" size={24} color="#4b5563" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-slate-800">Add Task</Text>
      </View>

      <ScrollView 
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View>
            {/* Task Name */}
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

            {/* Client Name Dropdown */}
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
                style={{
                  backgroundColor: "#fff",
                  borderColor: "#e2e8f0",
                  borderRadius: 8,
                  minHeight: 48,
                }}
                dropDownContainerStyle={{
                  backgroundColor: "#fff",
                  borderColor: "#e2e8f0",
                  borderRadius: 8,
                  marginTop: 2,
                }}
                textStyle={{ fontSize: 16, color: "#1e293b" }}
                labelStyle={{ fontWeight: "500" }}
                listMode="SCROLLVIEW"
                nestedScrollEnabled={true}
                ArrowDownIconComponent={() => <Feather name="chevron-down" size={18} color="#64748b" />}
                ArrowUpIconComponent={() => <Feather name="chevron-up" size={18} color="#64748b" />}
              />
            </View>

            {/* Status Dropdown */}
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
                style={{
                  backgroundColor: "#fff",
                  borderColor: "#e2e8f0",
                  borderRadius: 8,
                  minHeight: 48,
                }}
                dropDownContainerStyle={{
                  backgroundColor: "#fff",
                  borderColor: "#e2e8f0",
                  borderRadius: 8,
                  marginTop: 2,
                }}
                textStyle={{ fontSize: 16, color: "#1e293b" }}
                labelStyle={{ fontWeight: "500" }}
                listMode="SCROLLVIEW"
                nestedScrollEnabled={true}
                ArrowDownIconComponent={() => <Feather name="chevron-down" size={18} color="#64748b" />}
                ArrowUpIconComponent={() => <Feather name="chevron-up" size={18} color="#64748b" />}
              />
            </View>

            {/* Start & End Date */}
            <View className="flex-row justify-between mb-3">
              <View className="w-[48%]">
                <Text className="text-sm font-medium text-slate-600 mb-1">Start Date</Text>
                <TouchableOpacity
                  onPress={() => setShowStartDatePicker(true)}
                  className="bg-white rounded-lg border border-slate-200 h-12 px-4 flex-row items-center justify-between shadow-xs"
                >
                  <Text className="text-slate-800">{formatDate(startDate)}</Text>
                  <Feather name="calendar" size={18} color="#64748b" />
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={handleStartDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </View>

              <View className="w-[48%]">
                <Text className="text-sm font-medium text-slate-600 mb-1">End Date</Text>
                <TouchableOpacity
                  onPress={() => setShowEndDatePicker(true)}
                  className="bg-white rounded-lg border border-slate-200 h-12 px-4 flex-row items-center justify-between shadow-xs"
                >
                  <Text className="text-slate-800">{formatDate(endDate)}</Text>
                  <Feather name="calendar" size={18} color="#64748b" />
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

            {/* Searchable Resource Input */}
            <Text className="text-sm font-medium text-slate-600 mb-1">Add Team Members</Text>
            <View className="relative mb-3">
              <TextInput
                value={resourceInput}
                onChangeText={setResourceInput}
                placeholder="Search & add team members"
                placeholderTextColor="#9ca3af"
                className="bg-white rounded-lg border border-slate-200 h-12 px-4 text-slate-800 shadow-xs"
              />
              {resourceInput.length > 0 && (
                <View className="absolute top-14 left-0 right-0 bg-white rounded-lg border border-slate-200 max-h-48 z-50 shadow-md">
                  <ScrollView className="max-h-44">
                    {fakeUsers
                      .filter((name) =>
                        name.toLowerCase().includes(resourceInput.toLowerCase())
                      )
                      .map((name, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => addResource(name)}
                          className="p-3 border-b border-slate-100"
                        >
                          <Text className="text-slate-800">{name}</Text>
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Team Members */}
            <Text className="text-sm font-medium text-slate-600 mb-1">Team Members</Text>
            <View className="bg-white rounded-lg border border-slate-200 p-3 min-h-12 flex-row flex-wrap shadow-xs mb-3">
              {selectedResources.length < 1 ? (
                <View className="w-full items-center justify-center p-2">
                  <Text className="text-slate-400">No Members Selected</Text>
                </View>
              ) : (
                selectedResources.map((res, index) => (
                  <View key={index} className="bg-blue-500 rounded-full px-3 py-1 flex-row items-center mr-2 mb-2">
                    <Text className="text-white mr-1 text-sm">{res}</Text>
                    <TouchableOpacity onPress={() => removeResource(res)}>
                      <Feather name="x" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>

            {/* Set Hours for Each Day Button */}
            <TouchableOpacity
              className="bg-blue-500 rounded-lg h-12 justify-center items-center mb-3 flex-row px-5 shadow-sm"
              onPress={toggleHoursInput}
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold mr-2">
                {showHoursInput ? "Hide Hours Inputs" : "Set Hours for Each Day"}
              </Text>
              <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                <Feather name="chevron-down" size={20} color="#fff" />
              </Animated.View>
            </TouchableOpacity>

            {/* Hour Inputs */}
            {showHoursInput && (
              <Animated.View 
                className="bg-white rounded-lg border border-slate-200 p-4 mb-3 shadow-xs"
                style={{
                  opacity: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1]
                  }),
                  transform: [
                    {
                      translateY: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 20]
                      })
                    }
                  ]
                }}
              >
                <Text className="text-center font-semibold text-slate-800 mb-4">Daily Hours Allocation</Text>
                {getDatesInRange(startDate, endDate).map((date, index) => {
                  const dateKey = date.toISOString().split("T")[0];
                  return (
                    <View key={index} className="flex-row items-center justify-between mb-3">
                      <Text className="text-slate-700 flex-1">{formatDate(date)}</Text>
                      <TextInput
                        keyboardType="numeric"
                        placeholder="Hours"
                        placeholderTextColor="#9ca3af"
                        className="bg-slate-50 rounded-lg px-3 py-2 w-20 text-center border border-slate-200"
                        value={dateHours[dateKey]?.toString() || ""}
                        onChangeText={(text) =>
                          setDateHours((prev) => ({ ...prev, [dateKey]: text }))
                        }
                      />
                    </View>
                  );
                })}
              </Animated.View>
            )}

            {/* Submit Button */}
            
            <TouchableOpacity
              className="bg-emerald-500 rounded-lg h-14 justify-center items-center mt-4 shadow-md flex-row"
              onPress={handleSubmit}
              activeOpacity={0.9}
            >
              <Text className="text-white font-semibold text-lg mr-2">Add Task</Text>
              <MaterialIcons name="arrow-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddTask;