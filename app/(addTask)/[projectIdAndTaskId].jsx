import React, { useState, useEffect, useContext } from "react";
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
import { format } from 'date-fns';

const AddEditTask = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const ids = route.params?.projectIdAndTaskId?.split("-") || [];
  const [projectId, taskId, actionType, BId] = ids;
  const isEditMode =taskId;
  const { user } = useContext(AuthContext);
  
  // State for form fields
  const [taskName, setTaskName] = useState("");
  const [client, setClient] = useState(null);
  const [status, setStatus] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);

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

  // Animation interpolation
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });
// orginal Id
const [originalId, setOriginalId] = useState("");
  // Use the usePostData hook
  const { mutate: fetchTaskData, isLoading: isFetching } = usePostData('Task/getTaskDetailsByProjectId');
  const { mutate: submitTask, isPending: isSubmitPending } = usePostData('Task/CreateTask', ["Task/GetTasks"]);

  // Load task data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchTaskDetails();
    } else {
      loadDropdownOptions();
    }
  }, [isEditMode]);

  const fetchTaskDetails = () => {
    const queryParams = {
      ProjectId: projectId,
      ActionType: actionType,
      TaskId: taskId,
      Bid: BId
    };

    fetchTaskData(
      { 
        data: null, 
        queryParams,
        token: user?.token 
      },
      {
        onSuccess: (data) => {
          console.log("API Response Data:", data);
          processApiResponse(data);
          setIsLoading(false);
        },
        onError: (error) => {
          
          Alert.alert("Error", "Failed to fetch task details");
          setIsLoading(false);
        }
      }
    );
  };

  const loadDropdownOptions = () => {
    const queryParams = {
      ProjectId: projectId,
      ActionType: 1,
      
      Bid: BId||0
    };

    fetchTaskData(
      { 
        data: null, 
        queryParams,
        token: user?.token 
      },
      {
        onSuccess: (data) => {
          console.log("API Response Data:", data);
          processApiResponse(data);
          setIsLoading(false);
        },
        onError: (error) => {
          
          Alert.alert("Error", "Failed to fetch task details");
          setIsLoading(false);
        }
      }
    );
  };

  const processApiResponse = (apiData) => {
    if (!apiData) return;
  
    // Set costs data
    if (apiData?.costs) {
      setCosts({
        PurchaseCost: apiData.costs.PurchaseCost || "0.00",
        PredictedCost: apiData.costs.PredictedCost || "0.00",
        OutSourceCost: apiData.costs.OutSourceCost || "0.00",
        util_cost: apiData.costs.util_cost || null
      });
    }
    // originalId
  
      
  
    // Set team members dropdown
    if (apiData?.Emp_List && Array.isArray(apiData.Emp_List)) {
      const members = apiData.Emp_List.map(emp => ({
        label: emp.Employee_Name,
        value: emp.EmpId.toString(),
        name: emp.Employee_Name,
        id: emp.EmpId
      }));
      setTeamMembers(members);
    }
  
    // Set dropdown lists
    if (apiData?.dropdownList) {
      // Set clients dropdown
      if (apiData.dropdownList.clientName) {
        setClients([{
          label: apiData.dropdownList.clientName,
          value: apiData.dropdownList.Client_Id
        }]);
        setClient(apiData.dropdownList.Client_Id);
      }
  
      // Set statuses dropdown
      if (apiData?.dropdownList.Status && Array.isArray(apiData.dropdownList.Status)) {
        const statusOptions = apiData.dropdownList.Status.map(status => ({
          label: status.Status,
          value: status.Id.toString(), // Use ID as value for easier mapping
          statusName: status.Status
        }));
        setStatuses(statusOptions);
      }
    }
  
    // Set task details if in edit mode
    if (isEditMode && apiData.GetEditTaskDetails) {
      const taskDetails = apiData.GetEditTaskDetails;
//SET ORIGINAL ID
      setOriginalId(taskDetails?.Originalempids);
      // Set task title
      setTaskName(taskDetails.TskTitle || "");
      
      // Set dates (convert from MM/DD/YYYY format)
      if (taskDetails.StartDate) {
        const [month, day, year] = taskDetails.StartDate.split('/');
        setStartDate(new Date(year, month - 1, day));
      }
      
      if (taskDetails.EndDate) {
        const [month, day, year] = taskDetails.EndDate.split('/');
        setEndDate(new Date(year, month - 1, day));
      }
      
      // Set status (match the ID from dropdownList.Status)
      if (taskDetails.TskStatus) {
        setStatus(taskDetails.TskStatus.toString());
      }
      
      // Set selected team members
      if (taskDetails.Empids) {
        const empIds = taskDetails.Empids.split(',').filter(id => id.trim() !== '');
        
        // Find matching team members
        const selectedEmps = apiData.Emp_List
          .filter(emp => empIds.includes(emp.EmpId.toString()))
          .map(emp => ({
            label: emp.Employee_Name,
            value: emp.EmpId.toString(),
            name: emp.Employee_Name,
            id: emp.EmpId.toString() // Ensure ID is string for consistent comparison
          }));
        
        setSelectedResources(selectedEmps);
        
        // Initialize hours
        const hoursObj = {};
        selectedEmps.forEach(emp => {
          hoursObj[emp.id] = {};
          // If existing hours data is available from API, include it
          if (taskDetails.employees) {
            const empData = taskDetails.employees.find(e => e.empId.toString() === emp.id);
            if (empData && empData.logDetails) {
              empData.logDetails.forEach(log => {
                hoursObj[emp.id][log.date] = log.hr;
              });
            }
          }
        });
        setMemberHours(hoursObj);
      }
      
  
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
    if (!selectedResources.includes(resource)) {
      setSelectedResources([...selectedResources, resource]);
      setMemberHours(prev => ({
        ...prev,
        [resource]: {}
      }));
    }
    setResourceInput('');
    setShowResourceDropdown(false);
  };

  const removeResource = (resource) => {
    setSelectedResources(selectedResources.filter(r => r !== resource));
    const newMemberHours = {...memberHours};
    delete newMemberHours[resource];
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
  const handleHoursChange = (member, date, hours) => {
    setMemberHours(prev => ({
      ...prev,
      [member]: {
        ...prev[member],
        [date]: hours ? parseInt(hours) : 0
      }
    }));
  };

  // Generate dates between start and end date
  const getDatesInRange = (start, end) => {
    const dates = [];
    let currentDate = new Date(start);
    
    while (currentDate <= end) {
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
        console.log(hoursData,dateStr,"dateStr)")
        const hours = hoursData[dateStr] || 0;
        
        return {
          date: dateStr,
          hr: hours,
          startTime: "00:00:00", // Fixed value
          endTime: "00:00:00"    // Fixed value
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
  
    console.log("Complete Task Payload:", JSON.stringify(taskData, null, 2));
  
  
  
    
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
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#D01313" />
        <Text className="mt-4 text-slate-600">Loading task details...</Text>
      </SafeAreaView>
    );
  }

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
                  <ScrollView style={{zIndex: 100}} nestedScrollEnabled={true}>

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
                            value={memberHours[member.id]?.[dateStr] ? memberHours[member.id][dateStr].toString() : ""}
                            onChangeText={(text) => handleHoursChange(member.id, dateStr, text)}
                            placeholder="0"
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
    </SafeAreaView>
  );
};

export default AddEditTask;