import React, { useState, useEffect, useContext, useCallback } from "react";
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
  ActivityIndicator,
  KeyboardAvoidingView
} from "react-native";
import { Feather, AntDesign, MaterialIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from '@expo/vector-icons';
import { usePostData } from '../../ReactQuery/hooks/usePostData';
import { AuthContext } from "../../context/AuthContext";
import { format, isWeekend, addDays } from 'date-fns';
import { useFetchData } from "../../ReactQuery/hooks/useFetchData";
import { API_URL } from "@env";
// Debounce function outside component
const debounce = (func, delay) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

export default AddEditTask = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const ids = route.params?.projectIdAndTaskId?.split("-") || [];
  const [projectId, taskId, actionType, BId] = ids;
  const isEditMode = taskId;
  const { user } = useContext(AuthContext);
  
  // State for form fields
  const [taskName, setTaskName] = useState("");
  const [client, setClient] = useState(null);
  const [status, setStatus] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Task name validation states
  const [isTaskNameValid, setIsTaskNameValid] = useState(null);
  const [isCheckingTaskName, setIsCheckingTaskName] = useState(false);

  // Cost states from API
  const [costs, setCosts] = useState({
    PurchaseCost: "0.00",
    PredictedCost: "0.00",
    OutSourceCost: "0.00",
    util_cost: null
  });

  // Dropdown states
  const [clientOpen, setClientOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [statuses, setStatuses] = useState([]);

  // Team members states
  const [selectedResources, setSelectedResources] = useState([]);
  const [resourceInput, setResourceInput] = useState("");
  const [showResourceDropdown, setShowResourceDropdown] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);

  // Hours tracking states
  const [showHoursInput, setShowHoursInput] = useState(false);
  const [memberHours, setMemberHours] = useState({});
  const [rotateAnim] = useState(new Animated.Value(0));
  const [originalId, setOriginalId] = useState("");

  // Animation interpolation
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  // Use the usePostData hook
  const { mutate: submitTask, isPending: isSubmitPending } = usePostData('Task/CreateTask', ["Task/GetTasks"]);
  
  // Fetch task details
  const { data, isLoading, refetch } = useFetchData(
    isEditMode 
      ? `Task/getTaskDetailsByProjectId?ProjectId=${projectId}&ActionType=${actionType}&TaskId=${taskId}&Bid=${BId}`
      : `Task/getTaskDetailsByProjectId?ProjectId=${projectId}&ActionType=1&Bid=${BId || 0}`,
    user.token
  );

  // Fetch allocation time if in edit mode
  const { data: allocationTime, isLoading: allocationLoader } = useFetchData(
    isEditMode ? `Task/getTaskHoursDetailsByID?taskid=${taskId}` : null,
    user.token
  );

  // Debounced task name validation
  const debouncedCheckTaskName = useCallback(
    debounce(async (name) => {
      if (!name.trim()) {
        setIsTaskNameValid(null);
        return;
      }

      setIsCheckingTaskName(true);
      try {
        const response = await fetch(
          `${API_URL}Task/CheckTaskNameByTitle?tskTitle=${name}`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
            },
          }
        );
        const data = await response.json();
        
        if (data.message === "There is no Task available you can create the task.") {
          setIsTaskNameValid(true);
        } else if (data.message === "Task Title is already Exist!") {
          setIsTaskNameValid(false);
        }
      } catch (error) {
        console.error("Error checking task name:", error);
        setIsTaskNameValid(null);
      } finally {
        setIsCheckingTaskName(false);
      }
    }, 500),
    [user.token]
  );

  // Handle task name change
  const handleTaskNameChange = (text) => {
    setTaskName(text);
    debouncedCheckTaskName(text);
  };

  // Process API response for task details
  useEffect(() => {
    if (data) {
      processApiResponse(data);
    }
  }, [data]);

  // Process allocation time data when it's available
  useEffect(() => {
    if (allocationTime && isEditMode) {
      processAllocationTime(allocationTime);
    }
  }, [allocationTime]);

  const processAllocationTime = (allocData) => {
    if (!allocData || !Array.isArray(allocData)) return;

    const hoursObj = {...memberHours};

    allocData.forEach(employee => {
      if (!employee.allocations || !Array.isArray(employee.allocations)) return;

      const empId = employee.empId.toString();
      hoursObj[empId] = hoursObj[empId] || {};

      employee.allocations.forEach(allocation => {
        if (allocation.date && allocation.hours !== undefined) {
          hoursObj[empId][allocation.date] = allocation.hours;
        }
      });
    });

    setMemberHours(hoursObj);
  };

  const processApiResponse = (apiData) => {
    if (!apiData) return;

    try {
      // Set costs data
      const costsData = apiData.costs || {};
      setCosts({
        PurchaseCost: costsData.PurchaseCost || "0.00",
        PredictedCost: costsData.PredictedCost || "0.00",
        OutSourceCost: costsData.OutSourceCost || "0.00",
        util_cost: costsData.util_cost || null
      });

      // Set team members dropdown
      if (apiData.Emp_List && Array.isArray(apiData.Emp_List)) {
        const members = apiData.Emp_List.map(emp => ({
          label: emp.Employee_Name,
          value: emp.EmpId.toString(),
          name: emp.Employee_Name,
          id: emp.EmpId.toString()
        }));
        setTeamMembers(members);
      }

      // Set dropdown lists
      if (apiData.dropdownList) {
        // Set clients dropdown
        if (apiData.dropdownList.clientName) {
          setClients([{
            label: apiData.dropdownList.clientName,
            value: apiData.dropdownList.Client_Id.toString()
          }]);
          setClient(apiData.dropdownList.Client_Id.toString());
        }

        // Set statuses dropdown
        if (apiData.dropdownList.Status && Array.isArray(apiData.dropdownList.Status)) {
          const statusOptions = apiData.dropdownList.Status.map(status => ({
            label: status.Status,
            value: status.Id.toString(),
            statusName: status.Status
          }));
          setStatuses(statusOptions);
        }
      }

      // Set task details if in edit mode
      if (isEditMode && apiData.GetEditTaskDetails) {
        const taskDetails = apiData.GetEditTaskDetails;
        
        setOriginalId(taskDetails?.Originalempids || "");
        setTaskName(taskDetails.TskTitle || "");
        
        // Set dates
        if (taskDetails.StartDate) {
          const [month, day, year] = taskDetails.StartDate.split('/');
          const initialStartDate = new Date(year, month - 1, day);
          setStartDate(initialStartDate);
        }
        
        if (taskDetails.EndDate) {
          const [month, day, year] = taskDetails.EndDate.split('/');
          const initialEndDate = new Date(year, month - 1, day);
          setEndDate(initialEndDate);
        }
        
        // Set status
        if (taskDetails.TskStatus) {
          setStatus(taskDetails.TskStatus.toString());
        }
        
        // Set selected team members
        if (taskDetails.Empids) {
          const empIds = taskDetails.Empids.split(',').filter(id => id.trim() !== '');
          
          const selectedEmps = (apiData.Emp_List || [])
            .filter(emp => empIds.includes(emp.EmpId.toString()))
            .map(emp => ({
              label: emp.Employee_Name,
              value: emp.EmpId.toString(),
              name: emp.Employee_Name,
              id: emp.EmpId.toString()
            }));
          
          setSelectedResources(selectedEmps);
        }
      }
    } catch (error) {
      console.error("Error processing API response:", error);
    }
  };

  // Date handlers
  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
      if (selectedDate > endDate) {
        setEndDate(selectedDate);
      }
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate && selectedDate >= startDate) {
      setEndDate(selectedDate);
    }
  };

  // Team member handlers
  const addResource = (resource) => {
    if (!selectedResources.some(r => r.id === resource.id)) {
      setSelectedResources([...selectedResources, resource]);
      setMemberHours(prev => ({
        ...prev,
        [resource.id]: prev[resource.id] || {}
      }));
    }
    setResourceInput('');
    setShowResourceDropdown(false);
  };

  const removeResource = (resource) => {
    setSelectedResources(selectedResources.filter(r => r.id !== resource.id));
    const newMemberHours = {...memberHours};
    delete newMemberHours[resource.id];
    setMemberHours(newMemberHours);
  };

  // Hours input toggle
  const toggleHoursInput = () => {
    setShowHoursInput(!showHoursInput);
    Animated.timing(rotateAnim, {
      toValue: showHoursInput ? 0 : 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  };

  // Handle hours change for each member
  const handleHoursChange = (memberId, date, hours) => {
    setMemberHours(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [date]: hours ? parseInt(hours) : 0
      }
    }));
  };

  // Generate dates between start and end date
  const getDatesInRange = (start, end) => {
    const dates = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  // Form submission
  const handleSubmit = () => {
    // Validate required fields
    if (!taskName) {
      Alert.alert("Error", "Please enter a task name");
      return;
    }

    if (isTaskNameValid === false) {
      Alert.alert("Error", "Task name already exists");
      return;
    }
  
    if (!client) {
      Alert.alert("Error", "Please select a client");
      return;
    }
  
    if (!status) {
      Alert.alert("Error", "Please select a status");
      return;
    }
  
    if (selectedResources.length === 0) {
      Alert.alert("Error", "Please add at least one team member");
      return;
    }
  
    // Prepare employee data with hours
    const employees = selectedResources.map(resource => {
      const hoursData = memberHours[resource.id] || {};
      const datesInRange = getDatesInRange(startDate, endDate);
      
      const logDetails = datesInRange.map(date => {
        const dateStr = format(date, 'MM/dd/yyyy');
        const hours = hoursData[dateStr] || 0;
        
        return {
          date: dateStr,
          hr: hours,
          startTime: "00:00:00",
          endTime: "00:00:00"
        };
      });
  
      return {
        empId: parseInt(resource.id),
        empName: resource.label || resource.name,
        logDetails
      };
    });
  
    // Prepare the complete task data for API
    const taskData = {
      tskTitle: taskName,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      tskStatus: parseInt(status),
      projectId: parseInt(projectId),
      clientId: parseInt(client),
      taskId: isEditMode ? parseInt(taskId) : null,
      Empids: selectedResources.map(r => r.id).join(','),
      Originalempids: originalId,
      employees
    };
  
    submitTask(
      { 
        data: taskData,
        token: user?.token 
      },
      {
        onSuccess: (data) => {
          Alert.alert("Success", isEditMode ? "Task updated successfully" : "Task created successfully");
          navigation.goBack();
        },
        onError: (error) => {
          console.error("Submission failed:", error);
          Alert.alert("Error", error.message || "Failed to submit task");
        }
      }
    );
  };

  if (isLoading || (isEditMode && allocationLoader)) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#D01313" />
        <Text className="mt-4 text-slate-600">Loading task details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-center p-4 pb-2 bg-white">
        <TouchableOpacity onPress={() => navigation.goBack()} className="absolute left-4 p-2 z-10">
          <AntDesign name="arrowleft" size={24} color="#4b5563" />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold text-slate-800">
          {isEditMode ? "Edit Task" : "Add Task"}
        </Text>
      </View>

      {/* Main Content with KeyboardAvoidingView */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          className="flex-1 p-4"
          contentContainerStyle={{ paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cost Cards Section */}
          <View className="pb-4">
            <View className="flex-row justify-between gap-4">
              {/* Left Section */}
              <View className="flex-1 gap-4">
                <View className="rounded-xl p-4 border border-gray-100 flex-row items-center justify-between">
                  <View>
                    <Text className="text-sm font-medium text-gray-500">Out source value</Text>
                    <Text className="text-sm font-semibold text-gray-800">
                      $ {(costs.OutSourceCost)}
                    </Text>
                  </View>
                  <FontAwesome name="money" size={24} color="#CDFFF3" />
                </View>

                <View className="rounded-xl p-4 border border-gray-100 flex-row items-center justify-between">
                  <View>
                    <Text className="text-sm font-medium text-gray-500">Predicted Cost</Text>
                    <Text className="text-sm font-semibold text-gray-800">
                     $ {(costs.PredictedCost)}
                    </Text>
                  </View>
                  <FontAwesome name="money" size={24} color="#C3FFCC" />
                </View>
              </View>

              {/* Right Section */}
              <View className="flex-1 gap-4">
                <View className="rounded-xl p-4 border border-gray-100 flex-row items-center justify-between">
                  <View>
                    <Text className="text-sm font-medium text-gray-500">Total PO value</Text>
                    <Text className="text-sm font-semibold text-gray-800">
                     $ {(costs.PurchaseCost)}
                    </Text>
                  </View>
                  <FontAwesome name="money" size={24} color="#6EF6D6" />
                </View>

                <View className="rounded-xl p-4 border border-gray-100 flex-row items-center justify-between">
                  <View>
                    <Text className="text-sm font-medium text-gray-500">Utilization cost</Text>
                    <Text className="text-sm font-semibold text-gray-800">
                      $ {(costs.util_cost)}
                    </Text>
                  </View>
                  <FontAwesome name="money" size={24} color="#86FF97" />
                </View>
              </View>
            </View>
          </View>

          {/* Form Section */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              {/* Task Name */}
              <Text className="text-sm font-medium text-slate-600 mb-1">Task Name</Text>
              <View className={`bg-white rounded-lg border ${isTaskNameValid === false ? 'border-red-500' : isTaskNameValid === true ? 'border-green-500' : 'border-slate-200'} shadow-xs mb-3`}>
                <TextInput
                  value={taskName}
                  onChangeText={handleTaskNameChange}
                  placeholder="Enter task name"
                  placeholderTextColor="#9ca3af"
                  className="h-12 px-4 text-slate-800"
                />
                {isCheckingTaskName && (
                  <View className="absolute right-3 top-3">
                    <ActivityIndicator size="small" color="#64748b" />
                  </View>
                )}
                {!isCheckingTaskName && isTaskNameValid === false && (
                  <View className="absolute right-3 top-3">
                    <Feather name="x-circle" size={20} color="#ef4444" />
                  </View>
                )}
                {!isCheckingTaskName && isTaskNameValid === true && (
                  <View className="absolute right-3 top-3">
                    <Feather name="check-circle" size={20} color="#22c55e" />
                  </View>
                )}
              </View>
              {isTaskNameValid === false && (
                <Text className="text-red-500 text-xs mb-2">Task name already exists</Text>
              )}

              {/* Client Dropdown */}
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

              {/* Date Pickers */}
              <View className="flex-row justify-between mb-3">
                <View className="w-[48%]">
                  <Text className="text-sm font-medium text-slate-600 mb-1">Start Date</Text>
                  <TouchableOpacity 
                    onPress={() => setShowStartDatePicker(true)} 
                    className="rounded-lg border bg-red-800 h-12 px-4 flex-row items-center justify-between"
                  >
                    <Text className="text-white">{format(startDate, 'MM/dd/yyyy')}</Text>
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
                  <TouchableOpacity 
                    onPress={() => setShowEndDatePicker(true)} 
                    className="rounded-lg border bg-red-800 h-12 px-4 flex-row items-center justify-between"
                  >
                    <Text className="text-white">{format(endDate, 'MM/dd/yyyy')}</Text>
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
                    <ScrollView nestedScrollEnabled={true}>
                      {teamMembers
                        .filter(member => 
                          member.label.toLowerCase().includes(resourceInput.toLowerCase()) &&
                          !selectedResources.some(r => r.id === member.id)
                        )
                        .map((member, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() => addResource(member)}
                            className="px-4 py-2 border-b border-slate-100"
                          >
                            <Text className="text-slate-800">{member.label}</Text>
                          </TouchableOpacity>
                        ))}
                    </ScrollView>
                  </View>
                )}
                
                {selectedResources.length > 0 && (
                  <View className="flex-row flex-wrap mt-2">
                    {selectedResources.map((resource, index) => (
                      <View key={index} className="flex-row items-center bg-slate-100 rounded-full px-3 py-1 mr-2 mb-2">
                        <Text className="text-slate-700 mr-1">{resource.label || resource.name}</Text>
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
                <Text className="text-slate-700 font-medium">Add Hours for Team Members</Text>
                <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                  <Feather name="chevron-down" size={20} color="#64748b" />
                </Animated.View>
              </TouchableOpacity>

              {showHoursInput && selectedResources.length > 0 && (
                <View className="mb-4 border border-slate-200 rounded-lg p-3">
                  <Text className="text-sm font-medium text-slate-600 mb-2">Enter Hours for Each Member</Text>
                  
                  {selectedResources.map((member, memberIndex) => (
                    <View key={memberIndex} className="mb-4">
                      <Text className="font-medium text-slate-700 mb-2">{member.label || member.name}</Text>
                      
                      {getDatesInRange(startDate, endDate).map((date, dateIndex) => {
                        const dateStr = format(date, 'MM/dd/yyyy');
                        
                        return (
                          <View key={dateIndex} className="flex-row items-center justify-between mb-2">
                            <Text className="text-slate-600 w-24">{dateStr}</Text>
                            <TextInput
                              value={memberHours[member.id]?.[dateStr] ? memberHours[member.id][dateStr].toString() : "0"}
                              onChangeText={(text) => handleHoursChange(member.id, dateStr, text)}
                              placeholder=""
                              keyboardType="numeric"
                              className="flex-1 ml-2 bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
                            />
                            <Text className="text-slate-500 ml-2">hours</Text>
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity 
                onPress={handleSubmit} 
                activeOpacity={0.9} 
                className="rounded-lg h-14 justify-center items-center mt-4 shadow-md flex-row"
              >
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
                  {isSubmitPending ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Text className="text-white font-semibold text-lg mr-2">
                        {isEditMode ? "Update Task" : "Add Task"}
                      </Text>
                      <MaterialIcons name="arrow-forward" size={24} color="#fff" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};