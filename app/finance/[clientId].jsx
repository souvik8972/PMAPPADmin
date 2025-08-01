import React, {useContext, useEffect, useState} from "react";
import { View, Text, TouchableOpacity, StatusBar, TouchableWithoutFeedback, ScrollView , Platform} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { LinearGradient } from "expo-linear-gradient";
import ClientList from "../../components/StaticClientData";
import AnimatedNumber from "../../components/AnimatedNumber";
import AnimationPercentage from "../../components/AnimationPercentage";
import { EvilIcons, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";
import Animated, { SlideInDown, SlideOutUp } from "react-native-reanimated";
import { Link } from 'expo-router'
import { AuthContext } from "../../context/AuthContext";
import { useFetchData } from "../../ReactQuery/hooks/useFetchData";
import ShimmerLoader from "../../components/ShimmerLoader";


const Client = () => {
  const param = useLocalSearchParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [clientsInfo, setClientsInfo] = useState([]);
  const [projects, setProjects] = useState([]);
  
  // Extracting the clientId and splitting it into parts
  const clientData = param.clientId?.split('-') || [];
  const clientInfo = {
    Client_ID: clientData[0] || '',
    Year_ID: clientData[1] || '',
    Client_Title: clientData[2] || '',
    PoValue: clientData[3] || "00",
    Predicted_Gp: clientData[4] || "00",
    Predicted_percentage: clientData[5] || '00',
    Actual_Gp: clientData[6] || '00',
    Actual_percentage: clientData[7] || '00',
  };



  const endpoint = `FinanceModule/GetAllProjectName_ByClientIdd?FinYrId=${clientInfo.Year_ID}&clientId=${clientInfo.Client_ID}`;
  const { data, isLoading: loading, refetch } = useFetchData(endpoint, user?.token);

  useEffect(() => {
    if (data) {
      
      setClientsInfo(data.clientGpValues || []);
      setProjects(data.projectNames || []);
      // console.log("API response data:", data); // Better to log the raw data
    }
  }, [data]);

 const safeCurrencyToNumber = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : Number(value);
  return isNaN(num) ? 0 : num;
}
  const currentClientInfo = clientsInfo.length > 0 ? clientsInfo[0] : clientInfo;
  const currencyToNumber = (currency) => {
    if (!currency) return 0;
    return Number(currency.replace(/[^0-9.-]+/g, ""));
  };

  if (!clientInfo) {
    return (
      <SafeAreaView edges={['top']}   className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-gray-500">Client not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView  edges={['top']}  className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="flex-row items-center py-3 bg-white relative">
        <TouchableOpacity onPress={() => router.back()} className="z-10 p-2 pl-3">
          <ArrowLeft size={30} color="black" />
        </TouchableOpacity>
        <View className="absolute left-0 right-0 items-center justify-center">
          <Text className="text-xl font-bold">{clientInfo.Client_Title}</Text>
        </View>
        <View className="w-10" />
      </View>

      {/* Financial Data */}
      <View className="flex-row justify-between mt-1 pt-3 mb-6">
        {/* PoValue */}
        <View className="items-center w-1/3 border-r border-gray-200 px-1 ">
          <View className="flex-row items-center justify-center gap-1">
            <Ionicons name="trending-up" size={20} color="#10B981" />
            <Text className="text-sm font-semibold text-gray-500">PoValue</Text>
          </View>
          <AnimatedNumber 
            value={currencyToNumber(currentClientInfo.PoValue)} 
            color="text-black" 

          />
        </View>
      
       <View className="items-center w-1/3 border-r border-gray-200 px-1">
  <View className="flex-row items-center justify-center gap-1">
    {safeCurrencyToNumber(currentClientInfo.Predicted_Gp) > safeCurrencyToNumber(currentClientInfo.Actual_Gp) ? (
      <Ionicons name="trending-up" size={20} color="#10B981" />
    ) : (
      <Ionicons name="trending-down" size={20} color="#EF4444" />
    )}
    <Text className="text-sm font-semibold text-gray-500">Predicted GP</Text>
  </View>
  <AnimatedNumber 
    value={safeCurrencyToNumber(currentClientInfo.Predicted_Gp)} 
    color="text-black" 
  />
</View>

{/* Actual GP */}
<View className="items-center w-1/3 px-1">
  <View className="flex-row items-center justify-center gap-1">
    {safeCurrencyToNumber(currentClientInfo.Actual_Gp) > safeCurrencyToNumber(currentClientInfo.Predicted_Gp) ? (
      <Ionicons name="trending-up" size={20} color="#10B981" />
    ) : (
      <Ionicons name="trending-down" size={20} color="#EF4444" />
    )}
    <Text className="text-sm font-semibold text-gray-500">Actual GP</Text>
  </View>
  <AnimatedNumber   
    value={safeCurrencyToNumber(currentClientInfo.Actual_Gp)} 
    color="text-black" 
  />
</View>

      </View>

      {/* Progress Bar */}
      <View className="items-center justify-center w-full ">
        <View className="w-[90%] h-11 bg-[#00D09E] rounded-full flex-row overflow-hidden">
          <View 
            style={{ width: `${50}%` }} 
            className="h-full items-start justify-center px-1 pl-5"
          >
            <Text className="text-black font-bold text-sm">
              $ {currencyToNumber(currentClientInfo.Predicted_Gp).toLocaleString()}
            </Text>
          </View>
          <View 
            style={{ width: `50%`}} 
            className={`${currentClientInfo.Actual_percentage < 100 ? "bg-[#052224]" : "bg-black"} h-full rounded-full items-end justify-center px-1`}
          >
            <Text className="text-white font-bold text-sm pr-2">
              $ {currencyToNumber(currentClientInfo.Actual_Gp).toLocaleString()}
            </Text>
          </View>
        </View>
        <View className='flex-row mt-6 items-center space-x-2  gap-2'>
          <Text className='w-3 h-3 bg-[#00D09E] rounded-full text-center mr-1'></Text>
          <Text className='font-semibold text-sm '>Predicted</Text>
          <Text className='w-3 h-3 bg-[#052224] rounded-full text-center ml-2 mr-1'></Text>
          <Text className='font-semibold text-sm'>Actual</Text>
        </View>
      </View>

      {/* Scrollable Section */}
      <View
        style={{
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              backgroundColor: "transparent",
            },
            android: {
              elevation: 10,
              backgroundColor: "white",
            },
          }),
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          marginTop: 25,
        }}
      >
        <LinearGradient
          colors={["#FFF", "#FFF"]}
          style={{
            padding: 16,
            width: "100%",
            height: "100%",
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
          }}
        >
          <TaskList projects={projects || []} clientId={clientInfo.Client_ID} loading={loading} />
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};


const TaskList = ({ projects, clientId, loading }) => {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  return (
    <View className="flex-1 pt-0 ">
      {/* Header with Add Button */}
      <View className="flex-row items-center justify-between mb-10 px-3">
        <Text className="text-2xl font-bold text-gray-800">Projects List</Text>
       
      </View>

      {/* Projects List */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 5, paddingBottom: 30 }}
        
      ><View className="mb-14">
        {loading ? (
          // Show shimmer loaders while loading
          <>
            {[...Array(10)].map((_, i) => (
              <ShimmerLoader key={i} />
            ))}
          </>
        ) : (
          // Show actual projects when loaded
          projects?.map((project) => (
            <Link 
              href={`/projectInfo/${project.project_ID}-${clientId}`}
              key={project.project_ID}
              asChild
              className=""
            >
              <TouchableOpacity 
                activeOpacity={0.8}
                className="bg-white p-5 mb-4 rounded-xl flex-row justify-between items-center shadow-sm border border-gray-100"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <View className="flex-1 mr-4">
                  <Text 
                    className="text-lg font-semibold text-gray-800"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {project.project_Title}
                  </Text>
                 
                </View>
                <View className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color="#6B7280"
                  />
                </View>
              </TouchableOpacity>
            </Link>
          ))
        )}
      </View></ScrollView>

      {/* Floating Add Button */}
      {user?.userType == 1 && !loading && (
        <TouchableOpacity
          className="absolute bottom-8 right-6"
          onPress={() => router.push("/(addProject)/addProject")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#4F46E5", "#312E81"]}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 50,
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 5,
              width: 60,
              height: 60,
            }}
          >
            <MaterialCommunityIcons name="plus" size={28} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};


export default Client;