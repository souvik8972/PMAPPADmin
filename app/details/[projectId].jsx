import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Modal,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/AuthContext";
import { useFetchOnClick } from "../../ReactQuery/hooks/useFetchOnClick";
import { useFetchData } from "../../ReactQuery/hooks/useFetchData";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FontAwesome } from "@expo/vector-icons";
import { deleteTask } from "../../ReactQuery/hooks/deleteTask";

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

  // const confirmDelete = () => {
  //   console.log("Deleting task:", );
  //   setShowModal(false);
  //   setDeleteTaskId(null);
  // };

  const cancelDelete = () => {
    setShowModal(false);
    setDeleteTaskId(null);
  };

  // Fetch project details
  const {
    data: projectData,
    isLoading: isProjectLoading,
    error: projectError,
  } = useFetchData(
    `FinanceModule/GetProjectDetails_ById?projectId=${projectId}`,
    user.token
  );

  // Fetch task list (names and IDs only)
  const {
    data: taskListData,
    isLoading: isTaskListLoading,
    error: taskListError,
    refetch: refetchTaskList,
  } = useFetchData(
    `Projects/GetAllTaskNamesProjectId?projectId=${projectId}`,
    user.token
  );

  const confirmDelete = async () => {
    if (!deleteTaskId) return;

    try {
      const result = await deleteTask(deleteTaskId, user.token);
      console.log(result, "delete result");

      if (result.success) {
        // Refetch task list after deletion
        await refetchTaskList(); // You need to set this up (see point 3)

        setShowModal(false);
        setDeleteTaskId(null);

        Alert.alert("Success", result.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to delete task. Please try again."
      );
      setShowModal(false);
      setDeleteTaskId(null);
    }
  };

  // State for task details
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Fetch task details when a task is clicked
  const {
    data: taskDetails,
    isLoading: isTaskDetailsLoading,
    error: taskDetailsError,
    refetch: refetchTaskDetails,
  } = useFetchOnClick(
    `Task/getTaskDetailsByID?taskid=${selectedTaskId}`,
    user.token,
    !!selectedTaskId
  );
  console.log(taskDetails);

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
  const ShimmerEffect = ({ width = "100%", height = 20, style = {} }) => (
    <View
      style={[
        { width, height, backgroundColor: "#e1e1e1", borderRadius: 4 },
        style,
      ]}
      className="animate-pulse"
    />
  );

  // Full page shimmer loader
  const FullPageShimmer = () => (
    <SafeAreaView
       edges={ ["top"]}
      className="flex-1 bg-white"
    >
      {/* Header Shimmer */}
      <View className="flex-row items-center py-3 bg-white relative px-4">
        <ShimmerEffect width={24} height={24} />
        <View className="absolute left-0 right-0 items-center justify-center">
          <ShimmerEffect width="50%" height={24} />
        </View>
      </View>

      {/* Project Header Shimmer */}
      <View className="items-center mt-4">
        <ShimmerEffect width="30%" height={16} />
      </View>

      {/* Financial Data Shimmer */}
      <View className="flex-row justify-between mx-6 mt-4 p-2 pt-6">
        <View className="items-center w-1/2 border-r-[1px] border-gray-100">
          <ShimmerEffect width="70%" height={16} style={{ marginBottom: 8 }} />
          <ShimmerEffect width="50%" height={20} />
        </View>
        <View className="items-center w-1/2">
          <ShimmerEffect width="70%" height={16} style={{ marginBottom: 8 }} />
          <ShimmerEffect width="50%" height={20} />
        </View>
      </View>

      {/* Progress Bar Shimmer */}
      <View className="items-center justify-center w-full mt-6">
        <ShimmerEffect width="90%" height={44} style={{ borderRadius: 22 }} />
      </View>

      {/* Main Content Shimmer */}
      <LinearGradient
        colors={["white", "white"]}
        className="mt-10 rounded-t-[40] flex-1 p-4"
      >
        <View className="w-full h-full p-2">
          {/* Header Shimmer */}
          <View className="mt-4 mb-4 flex-row justify-between items-center">
            <ShimmerEffect width="40%" height={24} />
            <ShimmerEffect
              width={48}
              height={48}
              style={{ borderRadius: 24 }}
            />
          </View>

          {/* Task List Shimmer */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {[...Array(5)].map((_, index) => (
              <View key={index} className="m-1 mb-4 mt-4">
                <ShimmerEffect
                  width="100%"
                  height={80}
                  style={{ borderRadius: 8 }}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );

  if (isProjectLoading) {
    return <FullPageShimmer />;
  }

  if (projectError || !projectData || !projectData[0]) {
    return (
      <SafeAreaView
         edges={ ["top"]}
        className="flex-1 bg-white justify-center items-center"
      >
        <Text>Error loading project details</Text>
      </SafeAreaView>
    );
  }

  const currentProject = projectData[0];

  return (
    <SafeAreaView
      edges={ ["top"]}
      className="flex-1 bg-white"
    >
      {/* Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header with Back TouchableOpacity */}
      <View className="flex-row items-center py-3 bg-white relative ">
        <TouchableOpacity onPress={() => router.back()} className="z-50 p-2 pl-9">
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>
        <View className="absolute left-0 right-0 items-center justify-center">
          <Text
            className="text-lg w-[60%] text-center font-bold"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {currentProject.project_Title}
          </Text>
        </View>

        <View className="w-10" />
      </View>

      {/* Project Header */}

      <View className="items-center rounded-full mt-2"
      >
        <View className=" font-bold px-6 py-2  " style={{ borderRadius: 20 , backgroundColor: "#212529"}}>
        <Text  className="text-white text-lg font-bold ">
          {currentProject.Region || "NA"}
        </Text></View>
      </View>

      {/* Financial Data */}
      <View className="flex-row justify-between mx-6 mt-2 p-2 pt-4 gap-2">
        <View className="items-center w-1/2 p-2 rounded-lg" style={{ backgroundColor: "#F4F4F4" }}>
          <Text className="text-black mb-2 font-semibold">
            <FontAwesome6 name="arrow-trend-up" size={15} color="black" />{"  "}
             Vendor Value
          </Text>
          <Text className="text-black font-bold">
            ${currentProject.Vendor_Value || 0}
          </Text>
        </View>
        <View className="items-center w-1/2 p-2 rounded-lg" style={{ backgroundColor: "#940101" , borderWidth: 1,
    borderColor: '#0000001a',
    borderStyle: 'solid', }}>
          <Text className="text-white mb-2 font-semibold">
            <FontAwesome6 name="arrow-trend-up" size={15} color="white" />{"  "}
            Total Value
          </Text>
          <Text className="text-white font-bold">
            ${currentProject.Total_Value || 0}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      {/* <View className="items-center justify-center w-full mt-6">
        <View className="w-96 h-11 rounded-full flex-row overflow-hidden" style={{ backgroundColor: "#ec1c24" }}>
          <View
            style={{ width: `50%` }}
            className="h-full items-start justify-center px-3 pl-5"
          >
            <Text className="text-white font-bold">
              ${currentProject.Vendor_Value || 0}
            </Text>
          </View>
          <View
            style={{ width: `50%` , backgroundColor: "#212529" }}
            className=" h-full rounded-full items-end justify-center px-3"
          >
            <Text className="text-white font-bold">
              ${currentProject.Total_Value || 0}
            </Text>
          </View>
        </View>
      </View> */}

      {/* Scrollable Content */}
      <LinearGradient
        colors={["#F3F3F3", "#F3F3F3"]}
        style={{
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          marginTop: 30,
          padding: 5,
          width: "100%",
          flex: 1,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 10,
        }}
        className="mt-10 rounded-t-[40] "
      >
        <View className="w-full h-full p-1 relative  ">
          {/* Header */}
          <View className="mt-4 mb-4 flex-row justify-between items-center px-4">
            <Text className="text-xl text-black underline font-bold">
              Task List
            </Text>

            <Link
              href={`/(addTask)/${projectId}`}
              className="w-12 h-12 flex  rounded-full justify-center items-center"
            >
              <View className="bg-black flex  rounded-full justify-center items-center w-12 h-12 ">
                <Feather name="plus" size={24} color="white" />
              </View>
            </Link>
          </View>

          <View style={{ flex: 1 }} className=" px- pt-2">
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 80 }}
            >
              {isTaskListLoading ? (
                [...Array(5)].map((_, index) => (
                  <View key={index} className="mb-5">
                    <ShimmerEffect
                      width="100%"
                      height={80}
                      style={{ borderRadius: 12 }}
                    />
                  </View>
                ))
              ) : taskListError ? (
                <Text className="text-red-500 text-center mt-5">
                  ⚠️ Error loading tasks
                </Text>
              ) : taskListData?.project_list?.length > 0 ? (
                taskListData.project_list.map((task, index) => (
                  // console.log(task, "task")
                 <View
  key={task.Task_Id}
  style={{
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb', // Tailwind's gray-200
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
  }}
>

                    {/* Task Header */}
                    <TouchableOpacity
                      className="flex-col justify-between  px-4 py-4 border-gray-200"
                      onPress={() => handleTaskClick(task.Task_Id, index)}
                    >
                      {/* Top Row: Title + Arrow */}
                      <View className="flex-row justify-between items-center">
                        {activeIndex !== index && (
                          <Text
                            className="text-base font-semibold text-gray-800 w-[85%]"
                            numberOfLines={1}
                          >
                            {task.Task_Title.trim()}
                          </Text>
                        )}



                        {/* Expanded Task Details */}
                        {activeIndex === index && taskDetails?.task_data?.[0] && (
                          <View className="flex-row flex-wrap gap-2 items-center ">
                            <Text className="text-sm font-semibold text-gray-500">
                              {taskDetails.task_data[0].Start_Date} -{" "}
                              {taskDetails.task_data[0].End_Date}
                            </Text>
                            <Text className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: '#fff' , borderColor: '#EC1C24', borderWidth: 1 , color: '#EC1C24' }}>
                              {taskDetails.task_data[0].Project_Id}
                            </Text>
                            <Text className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: '#fff' , borderColor: '#EC1C24', borderWidth: 1 , color: '#EC1C24' }}>#Task:{" "}
                            {taskDetails.task_data[0].Task_Id || task.Task_Id}
                            </Text>
                            {/* <Text className="text-xs font-medium  px-2 py-1 rounded" tyle={{ backgroundColor: '#fff' , borderColor: '#EC1C24', borderWidth: 1 , color: '#EC1C24' }}>
                              #Task:{" "}
                              {taskDetails.task_data[0].Task_Id || task.Task_Id}
                            </Text> */}
                          </View>
                        )}
                        <FontAwesome
                          name={
                            activeIndex === index ? "angle-up" : "angle-down"
                          }
                          size={26}
                          color="#1f2937"
                        />
                      </View>
                    </TouchableOpacity>

                    {/* Task Detail Section */}
                    {activeIndex === index && (
                      <View className="px-4 py-1 ">
                        {isTaskDetailsLoading ? (
                          <>
                            <ShimmerEffect
                              width="40%"
                              height={16}
                              className="mb-2"
                            />
                            <ShimmerEffect
                              width="80%"
                              height={16}
                              className="mb-4"
                            />

                            <View className="flex-row justify-between items-center">
                              <ShimmerEffect width="35%" height={16} />
                              <View className="flex-row gap-2">
                                <ShimmerEffect
                                  width={40}
                                  height={40}
                                  style={{ borderRadius: 20 }}
                                />
                                <ShimmerEffect
                                  width={40}
                                  height={40}
                                  style={{ borderRadius: 20 }}
                                />
                              </View>
                            </View>
                          </>
                        ) : taskDetailsError ? (
                          <Text className="text-red-600">
                            ⚠️ Error loading task details
                          </Text>
                        ) : taskDetails?.task_data?.[0] ? (
                          <View className="mb-4">
  {/* Project Title */}
  <View className="flex-row items-center mb-1">
    {/* <Feather name="users" size={16} color="#00C7BE" /> */}
    <Text className="text-sm font-medium text-gray-500">Task Title:</Text>
  </View>
  <View className="flex-row flex-wrap gap-2 text-gray-900 mb-2">
    
    <View className="flex-row items-center rounded-full px-3 py-1 border border-gray-200"
      style={{ backgroundColor: '#fff' }}
    >
      <View className="w-5 h-5 rounded-full bg-red-100 mr-2 flex items-center justify-center">
        <Feather name="clipboard" size={12} color="#940101" />
      </View>
      <Text className="text-sm max-w-[90%] font-semibold text-gray-700">
      {task.Task_Title.trim() || "N/A"}
      </Text>
    </View>
  
</View>
  
  {/* <Text className="text-base text-gray-900 mb-2">
    Task Title:{" "}
    <Text className="font-normal font-semibold">
      {task.Task_Title.trim() || "N/A"}
    </Text>
  </Text> */}

  {/* Employee Name */}
  <View className="flex-row items-center mb-1">
    {/* <Feather name="users" size={16} color="#00C7BE" /> */}
    <Text className="text-sm font-medium text-gray-500">Assigned to:</Text>
  </View>

  <View className="flex-row flex-wrap gap-2 text-gray-900 mb-3">
    {taskDetails.task_data[0].Employee_Name.split(',').map((employee, index) => (
      <View
        key={`employee-${index}`}
        className="flex-row items-center rounded-full px-3 py-1 border border-gray-200"
        style={{ backgroundColor: '#F3F4F6' }}
      >
        <View className="w-5 h-5 rounded-full bg-red-100 mr-2 flex items-center justify-center">
          <Feather name="user" size={12} color="#940101" />
        </View>
        <Text className="text-sm font-semibold text-gray-700">
          {employee.trim()}
        </Text>
      </View>
    ))}
  </View>
  <View className="flex-row items-center mb-1">
    {/* <Feather name="users" size={16} color="#00C7BE" /> */}
    <Text className="text-sm font-medium text-gray-500">Task Owner</Text>
  </View>
  <View className="flex-row flex-wrap gap-2 text-gray-900 mb-2">
    
      <View className="flex-row items-center rounded-full px-3 py-1 border border-gray-200"
        style={{ backgroundColor: '#F3F4F6' }}
      >
        <View className="w-5 h-5 rounded-full bg-red-100 mr-2 flex items-center justify-center">
          <Feather name="user" size={12} color="#940101" />
        </View>
        <Text className="text-sm font-semibold text-gray-700">
        {taskDetails.task_data[0].Task_owner || "N/A"}
        </Text>
      </View>
    
  </View>
  {/* <View>
      <Text className="text-base text-gray-600 mb-1">Task Owner</Text>
      <Text className="text-sm font-semibold text-gray-800">
        {taskDetails.task_data[0].Task_owner || "N/A"}
      </Text>
    </View> */}
  {/* Owner and Actions */}
  <View className="flex-row justify-end items-center mt-1">
   

    <View className="flex-row justify-end space-x-4 gap-2 mt-2">
      <Link
        href={`/(addTask)/${projectId}-${taskDetails.task_data[0].Task_Id}-${0}-${taskDetails.task_data[0].BuyingCenterId}`}
        asChild
      >
        <TouchableOpacity className="flex-row items-center bg-white border px-4 py-2 rounded-lg shadow-sm" style={{ borderColor: '#EC1C24' }}>
          <Feather name="edit-3" size={16} color="#EC1C24" />
          <Text className="ml-2 text-sm font-medium" style={{ color: '#EC1C24' }}>
            Edit
          </Text>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity
        className="flex-row items-center px-4 py-2 rounded-lg shadow-sm"
        style={{ backgroundColor: '#EC1C24' }}
        onPress={() =>
          handleDeleteTask(taskDetails.task_data[0].Task_Id)
        }
      >
        <Feather name="trash-2" size={16} color="white" />
        <Text className="ml-2 text-white text-sm font-medium">Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
</View>

                        ) : (
                          <Text className="text-gray-500 text-sm">
                            No task details available
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                ))
              ) : (
                <Text className="text-gray-500 text-center mt-5">
                  No tasks found
                </Text>
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
          <View className="bg-white p-6 rounded-xl w-11/12 max-w-md ">
            <Text className="text-xl font-bold mb-3 text-gray-800">
              Confirm Delete
            </Text>
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
