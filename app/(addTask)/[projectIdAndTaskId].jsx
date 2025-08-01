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

  // Employee working hours state
  const [employeeWorkingHours, setEmployeeWorkingHours] = useState({});
  const [loadingHours, setLoadingHours] = useState(false);

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

  // Function to fetch employee working hours
  const fetchEmployeeWorkingHours = useCallback(async (empId, startDate, endDate) => {
    try {
      setLoadingHours(true);
      const response = await fetch(
        `https://projectmanagement.medtrixhealthcare.com/ProjectManagmentApi/api/Task/GetEmpTaskWorkingHours?emp_id=${empId}&startdate=${format(startDate, 'MM/dd/yyyy')}&endDate=${format(endDate, 'MM/dd/yyyy')}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );
      
      const data = await response.json();
      
      if (data && data.emp_task_data) {
        const hoursData = {};
        
        data.emp_task_data.forEach(item => {
          const dateStr = format(new Date(item.WorkDate), 'MM/dd/yyyy');
          hoursData[dateStr] = item.TotalWorkingHours;
        });
        
        setEmployeeWorkingHours(prev => ({
          ...prev,
          [empId]: hoursData
        }));
      }
    } catch (error) {
      console.error("Error fetching working hours:", error);
    } finally {
      setLoadingHours(false);
    }
  }, [user.token]);

  // Fetch working hours when dates or team members change
  useEffect(() => {
    if (selectedResources.length > 0) {
      selectedResources.forEach(resource => {
        fetchEmployeeWorkingHours(resource.id, startDate, endDate);
      });
    }
  }, [selectedResources, startDate, endDate, fetchEmployeeWorkingHours]);

  // Function to skip weekends when setting dates
  const skipWeekends = (date) => {
    let newDate = new Date(date);
    while (isWeekend(newDate)) {
      newDate = addDays(newDate, 1);
    }
    return newDate;
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
        
        // Set dates (skip weekends)
        if (taskDetails.StartDate) {
          const [month, day, year] = taskDetails.StartDate.split('/');
          const initialStartDate = new Date(year, month - 1, day);
          setStartDate(skipWeekends(initialStartDate));
        }
        
        if (taskDetails.EndDate) {
          const [month, day, year] = taskDetails.EndDate.split('/');
          const initialEndDate = new Date(year, month - 1, day);
          setEndDate(skipWeekends(initialEndDate));
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

  // Date handlers with weekend skipping
  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const newDate = skipWeekends(selectedDate);
      setStartDate(newDate);
      
      // Adjust end date if needed
      if (newDate > endDate) {
        setEndDate(skipWeekends(newDate));
      }
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate && selectedDate >= startDate) {
      setEndDate(skipWeekends(selectedDate));
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
      // Fetch working hours for the new member
      fetchEmployeeWorkingHours(resource.id, startDate, endDate);
    }
    setResourceInput('');
    setShowResourceDropdown(false);
  };

  const removeResource = (resource) => {
    setSelectedResources(selectedResources.filter(r => r.id !== resource.id));
    const newMemberHours = {...memberHours};
    delete newMemberHours[resource.id];
    setMemberHours(newMemberHours);
    
    const newWorkingHours = {...employeeWorkingHours};
    delete newWorkingHours[resource.id];
    setEmployeeWorkingHours(newWorkingHours);
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

  // Generate dates between start and end date, skipping weekends
  const getDatesInRange = (start, end) => {
    const dates = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      if (!isWeekend(currentDate)) {
        dates.push(new Date(currentDate));
      }
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

  // Validate hours don't exceed available hours
  let hasExceededHours = false;
  const MAX_HOURS = 9;
  
  selectedResources.forEach(member => {
    const memberId = member.id;
    const dates = getDatesInRange(startDate, endDate);
    
    dates.forEach(date => {
      const dateStr = format(date, 'MM/dd/yyyy');
      const enteredHours = memberHours[memberId]?.[dateStr] || 0;
      const workedHours = employeeWorkingHours[memberId]?.[dateStr] || 0;
      
      // For edit mode, we need to check if the hours are being increased beyond available
      // Get the original hours for this task (if any)
      const originalHoursForThisTask = isEditMode ? 
        allocationTime?.find(emp => emp.empId.toString() === memberId)?.allocations
          ?.find(a => a.date === dateStr)?.hours || 0 : 0;
      
      // Calculate available hours differently for edit mode
      const availableHours = isEditMode ? 
        MAX_HOURS - (workedHours - originalHoursForThisTask) : 
        MAX_HOURS - workedHours;
      
      // Check if the new hours exceed available capacity
      if (enteredHours > availableHours) {
        hasExceededHours = true;
      }
    });
  });
  
  if (hasExceededHours) {
    Alert.alert(
      "Warning", 
      "Some team members have hours that exceed their available capacity. Please adjust the hours before submitting.",
      [{ text: "OK" }]
    );
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


  // Render function for hours input
 const renderHoursInput = (member, date, dateStr) => {
  const isWeekendDay = isWeekend(date);
  const MAX_HOURS = 9;
  const workedHours = employeeWorkingHours[member.id]?.[dateStr] || 0;
  const currentHours = memberHours[member.id]?.[dateStr] || 0;
  
  // For edit mode, get original hours for this task
  const originalHoursForThisTask = isEditMode ? 
    allocationTime?.find(emp => emp.empId.toString() === member.id)?.allocations
      ?.find(a => a.date === dateStr)?.hours || 0 : 0;
  
  // Calculate available hours differently for edit mode
  const availableHours = isEditMode ? 
    MAX_HOURS - (workedHours - originalHoursForThisTask) : 
    MAX_HOURS - workedHours;
  
  const exceedsAvailable = currentHours > availableHours;
  
  return (
    <View 
      key={dateStr} 
      className={`flex-row items-center justify-between mb-2 ${isWeekendDay ? 'opacity-50' : ''}`}
    >
      <Text className={`text-gray-600 w-24`}>
        {dateStr} {isWeekendDay ? '(Weekend)' : ''}
      </Text>
      
      <View className="flex-1 ml-2 flex-row items-center">
        <TextInput
          value={currentHours.toString()}
          onChangeText={(text) => {
            if (!isWeekendDay) {
              handleHoursChange(member.id, dateStr, text);
            }
          }}
          placeholder="0"
          keyboardType="numeric"
          editable={!isWeekendDay}
          className={`bg-white border rounded px-3 py-2 text-gray-700 flex-1 ${
            isWeekendDay ? 'bg-gray-100' : ''
          } ${exceedsAvailable ? 'border-red-500' : 'border-gray-200'}`}
        />
        <Text className="text-gray-600 ml-2">hours</Text>
      </View>
      
     {!isWeekendDay && (
  <View className="flex-row items-center ml-2">
    {/* Available hours indicator */}
    <View className={`px-2 py-1 rounded-md ${
      exceedsAvailable ? 'bg-red-200' : 'bg-green-50'
    }`}>
      <Text className={`text-xs font-medium ${
        exceedsAvailable ? 'text-red-400' : 'text-green-500'
      }`}>
        {exceedsAvailable ? (
          <>
            <Text className="font-bold">+{currentHours - availableHours}h</Text>
            <Text className="text-red-400"> over</Text>
          </>
        ) : (
          <>
            <Text className="font-bold">{availableHours - currentHours}h</Text>
            <Text className="text-green-500"> free</Text>
          </>
        )}
      </Text>
    </View>

    {/* Original hours indicator (edit mode only) */}
    {/* {isEditMode && originalHoursForThisTask > 0 && (
      <View className="ml-2 px-2 py-1 bg-gray-100 rounded-md">
        <Text className="text-xs text-gray-500 font-medium">
          Prev: <Text className="font-semibold">{originalHoursForThisTask}h</Text>
        </Text>
      </View>
    )} */}
  </View>
)}
    </View>
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
      <View className="flex-row items-center justify-center p-4 pb-2  bg-white ">
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
              <View className="bg-white rounded-lg border border-slate-200 shadow-xs mb-3">
                <TextInput
                  value={taskName}
                  onChangeText={setTaskName}
                  placeholder="Enter task name"
                  placeholderTextColor="#9ca3af"
                  className="h-12 px-4 text-slate-800"
                />
              </View>

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
              {showResourceDropdown && (
                  <View className="mt-1 bg-white border border-slate-200   rounded-lg max-h-40">
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
                            className="px-4 py-2 border-b border-slate-100 "
                          >
                            <Text className="text-slate-800 ">{member.label}</Text>
                          </TouchableOpacity>
                        ))}
                    </ScrollView>
                  </View>
                )}
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
              {selectedResources.length > 0 && (
                <View className="mb-4 border border-slate-200 rounded-lg p-3">
                  <Text className="text-sm font-medium text-slate-600 mb-2">
                    Enter Hours for Each Member
                    {loadingHours && (
                      <Text className="text-xs text-gray-500 ml-2">(Loading availability...)</Text>
                    )}
                  </Text>
                  
                  {selectedResources.map((member, memberIndex) => {
                    const isOddIndex = memberIndex % 2 !== 0;
                    const bgColor = isOddIndex ? 'bg-gray-100' : 'bg-red-50';
                    
                    return (
                      <View key={memberIndex} className={`mb-4 p-2 rounded ${bgColor}`}>
                        <Text className="font-medium text-gray-700 mb-2">
                          {member.label || member.name}
                        </Text>
                        
                        {getDatesInRange(startDate, endDate).map((date, dateIndex) => {
                          const dateStr = format(date, 'MM/dd/yyyy');
                          return renderHoursInput(member, date, dateStr);
                        })}
                      </View>
                    );
                  })}
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