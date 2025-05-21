import { View, Text, TouchableOpacity, StatusBar, Modal, ActivityIndicator } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/AuthContext";
import { useFetchOnClick } from "../../ReactQuery/hooks/useFetchOnClick";
import { useFetchData } from "../../ReactQuery/hooks/useFetchData";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FontAwesome } from "@expo/vector-icons";

const ProjectDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const { user } = useContext(AuthContext);
  const { projectId } = useLocalSearchParams();
  const router = useRouter();

  const handleDeleteTask = (taskId) => {
    setDeleteTaskId(taskId);
    setShowModal(true);
  };

  const confirmDelete = () => {
    console.log("Deleting task:", deleteTaskId);
    setShowModal(false);
    setDeleteTaskId(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setDeleteTaskId(null);
  };

  // Fetch project details
  const { 
    data: projectData, 
    isLoading: isProjectLoading,
    error: projectError 
  } = useFetchData(
    `FinanceModule/GetProjectDetails_ById?projectId=${projectId}`,
    user.token
  );

  // Fetch task list (names and IDs only)
  const { 
    data: taskListData, 
    isLoading: isTaskListLoading,
    error: taskListError 
  } = useFetchData(
    `Projects/GetAllTaskNamesProjectId?projectId=${projectId}`,
    user.token
  );

  // State for task details
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  
  // Fetch task details when a task is clicked
  const { 
    data: taskDetails, 
    isLoading: isTaskDetailsLoading,
    error: taskDetailsError,
    refetch: refetchTaskDetails 
  } = useFetchOnClick(
    `Task/getTaskDetailsByID?taskid=${selectedTaskId}`,
    user.token,
    !!selectedTaskId
  );

  // Handle task click
  const handleTaskClick = async (taskId, index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
      setSelectedTaskId(null);
    } else {
      setActiveIndex(index);
      setSelectedTaskId(taskId);
      await refetchTaskDetails();
    }
  };

  // Shimmer effect component
  const ShimmerEffect = () => (
    <View className="animate-pulse">
      <View className="h-4 bg-gray-200 rounded mb-2 w-3/4"></View>
      <View className="h-4 bg-gray-200 rounded mb-2 w-1/2"></View>
      <View className="h-4 bg-gray-200 rounded mb-2 w-2/3"></View>
    </View>
  );

  // Calculate progress percentage
  
  if (isProjectLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#00D09E" />
      </SafeAreaView>
    );
  }

  if (projectError || !projectData || !projectData[0]) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text>Error loading project details</Text>
      </SafeAreaView>
    );
  }

  const currentProject = projectData[0];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header with Back TouchableOpacity */}
      <View className="flex-row items-center py-3 bg-white relative">
        <TouchableOpacity onPress={() => router.back()} className="z- p-2 pl-9">
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>
        <View className="absolute left-0 right-0   items-center justify-center">
          <Text className="text-lg w-[50%] text-center  font-bold">{currentProject.project_Title}</Text>
        </View>
        <View className="w-10" />
      </View>

      {/* Project Header */}
      <View className="items-center mt-4">
        <Text className="text-gray-500">{currentProject.Region || "No project code"}</Text>
      </View>

      {/* Financial Data */}
      <View className="flex-row justify-between mx-6 mt-4 p-2 pt-6">
        <View className="items-center w-1/2 border-r-[1px] border-gray-100">
          <Text className="text-gray-500 mb-2">
            <FontAwesome6 name="arrow-trend-up" size={15} color="black" /> Vendor Value
          </Text>
          <Text className="text-black">${currentProject.Vendor_Value || 0}</Text>
        </View>
        <View className="items-center w-1/2">
          <Text className="text-gray-500 mb-2">
            <FontAwesome6 name="arrow-trend-down" size={15} color="black" /> Total Value
          </Text>
          <Text className="text-[#00D09E]">${currentProject.Vendor_Value || 0}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="items-center justify-center w-full mt-6">
        <View className="w-96 h-11 bg-[#00D09E] rounded-full flex-row overflow-hidden">
          <View 
            style={{ width: `50%` }} 
            className="h-full items-start justify-center px-3 pl-5"
          >
            <Text className="text-black font-bold">${currentProject.Total_Value||0}</Text>
          </View>
          <View 
            style={{ width: `${50}%` }} 
            className="bg-black h-full rounded-full items-end justify-center px-3"
          >
            <Text className="text-white font-bold">${currentProject.Total_Value||0}</Text>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <LinearGradient
        colors={["white","#01a47e"]}
        style={{
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          marginTop: 25,
          padding: 16,
          width: "100%",
          flex: 1,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
        }}
        className="mt-10 rounded-t-[40]"
      >
        <View className="w-full h-full p-2 relative">
          {/* Header */}
          <View className="mt-4 mb-4 flex-row justify-between items-center px-4">
            <Text className="text-xl text-black underline font-bold">Task List</Text>
            
            <Link href={`/(addTask)/${projectId}`} className="w-12 h-12 justify-center items-center">
              <LinearGradient colors={["black", "black"]} style={{ borderRadius: 50 }} className="p-2 rounded-lg">
                <Feather name="plus" size={24} color="white" />
              </LinearGradient>
            </Link>
          </View>

          {/* Task List */}
          <View style={{ flex: 1 }}>
            <ScrollView 
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={{ paddingBottom: 60 }}
              style={{ flex: 1 }}
            >
              {isTaskListLoading ? (
                <ActivityIndicator size="large" color="#00D09E" />
              ) : taskListError ? (
                <Text>Error loading tasks</Text>
              ) : taskListData?.project_list?.length > 0 ? (
                taskListData.project_list.map((task, index) => (
                  <View 
                    key={task.Task_Id} 
                    className="m-1 mb-4 mt-4"
                  >
                    <TouchableOpacity
                      className={`p-3 h-[80px] flex-row justify-between bg-white items-center ${
                        activeIndex === index ? "rounded-t-lg" : "rounded-lg shadow"
                      }`}
                      onPress={() => handleTaskClick(task.Task_Id, index)}
                    >
                      <Text className="text-black font-semibold text-[14px] truncate w-[85%]">
                        {task.Task_Title.trim()}
                      </Text>
                      <FontAwesome 
                        name={activeIndex === index ? "angle-up" : "angle-down"} 
                        size={28} 
                        color="black" 
                      />
                    </TouchableOpacity>

                    {activeIndex === index && (
                      <View className="p-4 pt-0 bg-white rounded-b-lg shadow">
                        {isTaskDetailsLoading ? (
                          <ShimmerEffect />
                        ) : taskDetailsError ? (
                          <Text>Error loading task details</Text>
                        ) : taskDetails?.task_data?.[0] ? (
                          <>
                            <Text>
                              <MaterialCommunityIcons name="star-three-points-outline" size={12} color="black" /> Dates:
                            </Text>
                            <Text className="font-semibold pl-4">
                              {taskDetails.task_data[0].Start_Date} - {taskDetails.task_data[0].End_Date}
                            </Text>

                            <Text>
                              <MaterialCommunityIcons name="star-three-points-outline" size={12} color="black" /> Task Id:
                            </Text>
                            <Text className="font-semibold mb-2 pl-4">
                              {taskDetails.task_data[0].Task_Id || task.Task_Id}
                            </Text>

                            <View className="flex-row justify-between items-center mb-2">
                              <View>
                                <Text>
                                  <MaterialCommunityIcons name="star-three-points-outline" size={12} color="black" /> Task Owner:
                                </Text>
                                <Text className="font-semibold pl-4">
                                  {taskDetails.task_data[0].Task_owner || "N/A"}
                                </Text>
                              </View>
                              <View className="flex-row space-x-2 gap-2">
                                <Link 
                                  href={`/(addTask)/${projectId}-${taskDetails.task_data[0].Task_Id}-${0}-${taskDetails.task_data[0].BuyingCenterId}`} 
                                  asChild
                                >
                                  <TouchableOpacity>
                                    <LinearGradient colors={["#D01313", "#6A0A0A"]} style={{ borderRadius: 50, padding: 6 }} className="p-2 rounded-lg">
                                      <Feather name="edit" size={24} color="white" />
                                    </LinearGradient>
                                  </TouchableOpacity>
                                </Link>

                                <TouchableOpacity onPress={() => handleDeleteTask(taskDetails.task_data[0].Task_Id)}>
                                  <LinearGradient colors={["#D01313", "#6A0A0A"]} style={{ borderRadius: 50, padding: 6 }} className="p-2 rounded-lg">
                                    <MaterialCommunityIcons name="delete" size={24} color="white" />
                                  </LinearGradient>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </>
                        ) : (
                          <Text>No task details available</Text>
                        )}
                      </View>
                    )}
                  </View>
                ))
              ) : (
                <Text>No tasks found</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </LinearGradient>

      {/* Delete Confirmation Modal */}
      <Modal
  visible={showModal}
  animationType="fade"
  transparent={true}
  onRequestClose={cancelDelete}
>
  <View className="flex-1 justify-center items-center bg-gray-200 opacity-1/2">
    <View className="bg-white p-6 rounded-xl w-11/12 max-w-md shadow-lg">
      <Text className="text-xl font-bold mb-3 text-gray-800">Confirm Delete</Text>
      <Text className="text-base text-gray-600 mb-6">
        Are you sure you want to delete this task?
      </Text>
      <View className="flex-row justify-end  gap-2 space-x-4">
        <TouchableOpacity
          onPress={cancelDelete}
          className="px-4 py-2 rounded-md bg-gray-200"
        >
          <Text className="text-gray-700 font-medium">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={confirmDelete}
          className="px-4 py-2 rounded-md bg-red-700"
        >
          <Text className="text-white font-semibold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

    </SafeAreaView>
  );
};

export default ProjectDetails;