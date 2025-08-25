import React, { useContext, useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { API_URL } from '@env';
import {isTokenValid} from '@/utils/functions/checkTokenexp';
import  { Toast } from 'toastify-react-native'
const fetchProjectList = async (token,user,logout) => {
    const tokenvalid= await isTokenValid(user,logout)
     if(!tokenvalid) {
        Toast.error("Session expired. Please log in again.");
        return;
      }
  const response = await fetch(`${API_URL}Projects/GetAllProjectNames`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const fetchProjectDetails = async (projectId, token) => {
  const response = await fetch(`${API_URL}Projects/GetProjectDetailsById?projectId=${projectId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  // console.log("aaa",response)
  return response.json();
};
const ProjectSkeleton = () => {
  return (
    <View className="bg-white rounded-xl shadow-xl border border-gray-100 mb-4 overflow-hidden">
      {/* Header skeleton */}
      <View className="flex-row items-center px-5 py-4 min-h-[80px]">
        <View className="flex-1">
          <View className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
          <View className="h-4 w-1/2 bg-gray-200 rounded" />
        </View>
        <View className="w-6 h-6 bg-gray-200 rounded" />
      </View>
      
      {/* Content skeleton */}
      <View className="px-5 pb-5 border-t border-gray-100">
        {/* Date row */}
        <View className="flex-row justify-between items-center mt-4 mb-5">
          <View className="h-4 w-2/5 bg-gray-200 rounded" />
          <View className="h-8 w-1/3 bg-gray-200 rounded" />
        </View>
        
        {/* Client and Region */}
        <View className="space-y-3 mb-4">
          <View>
            <View className="h-3 w-1/4 bg-gray-200 rounded mb-2" />
            <View className="h-5 w-3/4 bg-gray-200 rounded" />
          </View>
        </View>
        
        {/* Value Cards */}
        <View className="flex-row space-x-3 gap-2 mb-5">
          <View className="flex-1 h-20 bg-gray-100 rounded-lg" />
          <View className="flex-1 h-20 bg-gray-100 rounded-lg" />
        </View>
        
        {/* Footer */}
        <View className="flex-row justify-between items-center">
          <View className="h-3 w-2/5 bg-gray-200 rounded" />
          <View className="h-6 w-1/5 bg-gray-200 rounded-full" />
        </View>
      </View>
    </View>
  );
};

export default function ProjectList() {
  const { user,logout  } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const token = user?.token;
  const [projectDetails, setProjectDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});
  const [expandedProjects, setExpandedProjects] = useState({});

  // Fetch all projects
  const { 
    data: projectListData, 
    isLoading, 
    isError, 
    error, 
    refetch
  } = useQuery({
    queryKey: ['projectList'],
    queryFn: () => fetchProjectList(token,user,logout),
    enabled: !!token
  });

  // Filter projects based on search query
  const filteredProjects = useMemo(() => {
    if (!projectListData?.projects) return [];
    return projectListData.projects.filter(project =>
      project.project_Title.toLowerCase().includes(searchQuery.toLowerCase())
  )}, [projectListData, searchQuery]);

  const toggleProjectDetails = async (projectId) => {
    // Toggle expanded state
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));

    // If we're expanding and don't have details yet, fetch them
    if (!projectDetails[projectId] && expandedProjects[projectId] !== true) {
      try {
        setLoadingDetails(prev => ({ ...prev, [projectId]: true }));
        const details = await fetchProjectDetails(projectId, token);
        console.log(details,"details")
        setProjectDetails(prev => ({
          ...prev,
          [projectId]: details.project_list[0]
        }));



      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        // console.log(details, "details");
        setLoadingDetails(prev => ({ ...prev, [projectId]: false }));
      }
    }
  };

  const deleteProject = (projectId) => {
    // console.log("Delete project with ID:", projectId);
    // Implement your delete functionality here
  };

    if (isLoading) {
    return (
      <View className="flex-1 p-4 pt-0 bg-gray-100">
        {/* Search Bar Skeleton */}
        <View className="flex-row items-center border border-gray-300 shadow-lg rounded-[12px] h-[60px] p-2 my-4 bg-white">
          <View className="flex-1 h-8 bg-gray-200 rounded" />
          <View className="w-8 h-8 bg-gray-200 rounded-full mr-2" />
        </View>
        
        <View className="flex flex-row justify-between mb-3 items-center">
          <View className="h-5 w-1/4 bg-gray-200 rounded" />
          <View className="h-3 w-1/3 bg-gray-200 rounded" />
        </View>
        
        {/* Render multiple skeleton items */}
        {[...Array(5)].map((_, index) => (
          <ProjectSkeleton key={index} />
        ))}
      </View>
    );
  }


  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1  pt-0 bg-gray-100 p-4">
      {/* Search Bar */}
      <View className="flex-row items-center border border-gray-300  rounded-[12px] h-[50px]  p-1 my-4 bg-white">
        <TextInput
          placeholder=" Search project"
          placeholderTextColor={"gray"}
          className="flex-1 text-black"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View className="mr-2">
          <FontAwesome name="search" size={20} color="gray" />
        </View>
      </View>
      
      <View className="flex flex-row justify-between mb-3 items-center">
        <Text className="pl-2 font-semibold">Project List</Text>
        <Text className="text-[10px] text-red-400">
          <EvilIcons name="exclamation" size={10} color="red" /> Click on Project Name to View Details.
        </Text>
      </View>

      {/* Project List as Cards with FlatList */}
      <FlatList
        data={filteredProjects}
        style={{backgroundColor:"transparent",padding:1,border:"none"}}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.PROJECT_ID.toString()}
        renderItem={({ item: project }) => {
          const details = projectDetails[project.PROJECT_ID];
        
          
          const isLoading = loadingDetails[project.PROJECT_ID];
          
          const isExpanded = expandedProjects[project.PROJECT_ID];
          if(isExpanded){
            // console.log("Loading project details:", details);
          }
          return (
            <View className="bg-white rounded-xl border-2 border-gray-300 shadow-xs mb-4 overflow-hidden">
            {/* Project Header - Clickable Area */}
            <TouchableOpacity 
              onPress={() => toggleProjectDetails(project.PROJECT_ID)}
              className="flex-row items-center px-5 py-4 min-h-[80px]"
            >
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">
                  {project.project_Title}
                </Text>
              </View>
              <MaterialCommunityIcons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={24} 
                color="#6B7280" 
              />
            </TouchableOpacity>
          
            {/* Loading Indicator */}
            {isLoading && isExpanded && (
              <View className="px-5 pb-4">
                <ActivityIndicator size="small" color="#3B82F6" />
              </View>
            )}
          
            {/* Expanded Content */}
            {isExpanded && details && !isLoading && (
              <View className="px-5 pb-5 border-t border-gray-100">
                {/* Date Row with Details Button */}
                <View className="flex-row justify-between items-center mt-4 mb-5">
                  <View className="flex-row items-center space-x-2">
                    <MaterialCommunityIcons name="calendar-range" size={18} color="#6B7280" />
                    <Text className="text-sm text-gray-600">
                      {details.Pstart_date} - {details.end_date}
                
                    </Text>
                  </View>
                
<TouchableOpacity 
  style={{
    backgroundColor:"#940101"
  }}
  onPress={() => router.push(`/details/${project.PROJECT_ID}`)}
  className="flex-row items-center space-x-1  px-3 py-2 rounded-lg border border-blue-100"
>
  <Text className="text-sm font-medium text-white">View Tasks</Text>
  <MaterialCommunityIcons name="arrow-right" size={16} color="white" />
</TouchableOpacity>
                </View>
          
                {/* Client and Region */}
                <View className="space-y-3 mb-4">
                  <View>
                    <Text className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Client</Text>
                    <Text className="text-base font-medium text-gray-900">{details.Client_Title}</Text>
                  </View>
                  {/* <View>
                    <Text className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Region</Text>
                    <Text className="text-base font-medium text-gray-900">{details.Region}</Text>
                  </View> */}
                </View>
          
                {/* Value Cards */}
                <View className="flex-row space-x-3 gap-2 mb-5">
                  <View style={{backgroundColor:"#F4F4F4"}} className="flex-1  p-3 rounded-lg border border-gray-100">
                    <Text className="text-xs font-medium text-[#940101] mb-1">Outsourcing Value</Text>
                    <Text className="text-lg font-semibold text-[#940101]">${details.Outsourcing_Value}</Text>
                  </View>
                  <View style={{
                    backgroundColor:"#940101"
                  }} className="flex-1  p-3 rounded-lg border border-blue-100">
                    <Text className="text-xs font-medium text-white mb-1">Total Value</Text>
                    <Text className="text-lg font-semibold text-white">${details.Total_Value}</Text>
                  </View>
                </View>
          
                {/* Footer */}
                <View className="flex-row justify-between items-center">
                  <Text className="text-xs text-gray-500">
                    Created: {details.Created_Date}
                  </Text>
                  <View className={`px-3 py-1 rounded-full ${
                    details.Project_Status === 2 ? "bg-green-50 border border-green-100" : "bg-amber-50 border border-amber-100"
                  }`}>
                    <Text className={`text-xs font-medium ${
                      details.Project_Status === 2 ? "text-green-700" : "text-amber-700"
                    }`}>
                      {details.Project_Status === 2 ? "Active" : "Inactive"}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
          );
        }}
        refreshing={isLoading}
        onRefresh={refetch}
      />

      {/* Add Button */}
      {/* {user?.userType == 1 && (
        <TouchableOpacity 
          className="absolute bottom-10 right-6" 
          onPress={() => router.push('/(addProject)/addProject')}
        >
          <LinearGradient 
            colors={["#D01313", "#6A0A0A"]} 
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              borderRadius: 50, 
              padding: 16,
              width: 60,
              height: 60
            }}
          >
            <MaterialCommunityIcons name="plus" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      )} */}
    </View>
  );
}