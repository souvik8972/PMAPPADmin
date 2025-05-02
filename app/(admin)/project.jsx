import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Link, router } from "expo-router";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useFetchData } from "../../ReactQuery/hooks/useFetchData"; 
import { AuthContext } from "../../context/AuthContext";

export default function ProjectList() {

const {user} =useContext(AuthContext); // Assuming you have a context for authentication
console.log("user",user);
  const [searchQuery, setSearchQuery] = useState("");
  const token = user?.token; // Replace with your actual token or get it from auth context

  // Fetch projects data using the custom hook
  const { data, isLoading, isError, error } ={data:[],isLoading:false,isError:null,error:null}; // useFetchData("projects", token);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
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

  // Filter projects based on search query
  const filteredProjects = data?.projects?.filter((project) =>
    project.project_Title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const deleteProject = (projectId) => {
    // Implement your delete functionality here
    console.log("Delete project with ID:", projectId);
    // You would typically make an API call to delete the project
    // and then update the local state or refetch the data
  };

  return (
    <View className="flex-1 p-4 pt-0 bg-gray-100">
      {/* Search Bar */}
      <View className="flex-row items-center border border-gray-300 shadow rounded-[12px] h-[60px] p-2 my-4 bg-white">
        <TextInput
          placeholder="Search project"
          className="flex-1 text-black"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View className="mr-2">
          <FontAwesome name="search" size={20} color="gray" />
        </View>
      </View>
      
      <View className="flex flex-row justify-between items-center">
        <Text className="pl-2 font-semibold">Project List</Text>
        <Text className="text-[10px] text-red-400">
          <EvilIcons name="exclamation" size={10} color="red" /> Click on Project Name to View Tasks.
        </Text>
      </View>

      {/* Project List as Cards */}
      <ScrollView showsVerticalScrollIndicator={false} className="mt-4">
        {filteredProjects.map((project) => (
          <View key={project.PROJECT_ID} className="bg-white rounded-lg shadow-[0px_14px_9px_-12px_rgba(0,_0,_0,_0.1)] mb-4 p-4">
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <Link href={`/details/${project.PROJECT_ID}`} asChild>
                  <TouchableOpacity>
                    <Text className="text-black font-semibold text-[16px] mb-2 underline">
                      {project.project_Title}
                    </Text>
                  </TouchableOpacity>
                </Link>
                <Text className="text-gray-500 text-sm">
                  {project.Pstart_date} - {project.end_date}
                </Text>
              </View>
              
              <TouchableOpacity onPress={() => deleteProject(project.PROJECT_ID)}>
                <LinearGradient colors={["#D01313", "#6A0A0A"]} style={{ borderRadius: 50, padding: 8 }}>
                  <MaterialCommunityIcons name="delete" size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            <View className="mb-3">
              <Text className="text-gray-600 text-sm">Client:</Text>
              <Text className="font-semibold">{project.Client_Title}</Text>
            </View>
            
            <View className="mb-3">
              <Text className="text-gray-600 text-sm">Region:</Text>
              <Text className="font-semibold">{project.Region}</Text>
            </View>
            
            <View className="flex flex-row justify-between w-full gap-4">
              <View className="bg-[#F1FFF3] p-3 rounded-lg flex-1">
                <Text className="text-gray-600 text-sm">Outsourcing Value:</Text>
                <Text className="font-semibold">${project.Outsourcing_Value}</Text>
              </View>
              <View className="bg-[#00D09E] p-3 rounded-lg flex-1">
                <Text className="text-white text-sm">Total Value:</Text>
                <Text className="font-semibold text-white">${project.Total_Value}</Text>
              </View>
            </View>
            
            <View className="mt-3 flex-row justify-between items-center">
              <Text className="text-gray-500 text-xs">Created: {project.Created_Date}</Text>
              <View className={`px-2 py-1 rounded-full ${
                project.Project_Status === 2 ? "bg-green-100" : "bg-yellow-100"
              }`}>
                <Text className="text-xs">
                  {project.Project_Status === 2 ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Button */}
      {user?.userType==1&&<TouchableOpacity 
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
      </TouchableOpacity>}
      
    </View>
  );
}