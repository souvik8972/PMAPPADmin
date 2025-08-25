import React, { useContext, useMemo, useState } from "react";
import { ScrollView, View, Text, RefreshControl, ActivityIndicator } from "react-native";
import GradientCard from "../../components/GradientCard";
import { AuthContext } from "../../context/AuthContext";
import GetCurrentDate from "../../components/GetCurrentDate";
import { useFetchData } from "../../ReactQuery/hooks/useFetchData";

export default function FoodDashboard() {
  const { user } = useContext(AuthContext);
  const currentDate = GetCurrentDate();
  const [refreshing, setRefreshing] = useState(false);

  const { data: apiData, isLoading, error: apiError, refetch } = useFetchData(
    `Food/GetFoodDetailsByDate?st_dt=${currentDate}`,
    user?.token
  );

  const {
    data: Emp,
    isLoading: TotalCountLoad,
    error: resourcesError,
  } = useFetchData(`Resource/GetResourceCount`, user?.token);

  const FoodApiData = useMemo(() => apiData || {}, [apiData]);

  const OptforFood = useMemo(() => {
    return FoodApiData?.assests_requests?.filter((ele) => ele.FoodOption === 1) || [];
  }, [FoodApiData]);

  const NotOptForFood = useMemo(() => {
    return FoodApiData?.assests_requests?.filter((ele) => ele.FoodOption !== 1) || [];
  }, [FoodApiData]);

  const NotDecided = (Emp?.teamMembers ?? 0) - (OptforFood.length + NotOptForFood.length);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading || TotalCountLoad) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-lg font-medium text-gray-600 mt-4">Loading dashboard data...</Text>
      </View>
    );
  }

  if (apiError || resourcesError) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <View className="bg-white p-6 rounded-xl shadow-sm items-center max-w-xs">
          <Text className="text-2xl mb-3">⚠️</Text>
          <Text className="text-lg font-semibold text-gray-800 mb-2">Data Loading Error</Text>
          <Text className="text-gray-600 text-center">Unable to load dashboard information. Please try again later.</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#3b82f6"]}
          tintColor="#3b82f6"
          progressBackgroundColor="#ffffff"
        />
      }
    >
      {/* Header Section */}
      <View className="bg-white p-6 rounded-xl shadow-sm mb-5 border border-gray-100">
        <Text className="text-2xl font-bold text-gray-800 mb-1">Food Management Dashboard</Text>
        <Text className="text-sm text-gray-500">Track today's meal preferences and participation</Text>
        
        <View className="bg-blue-50 mt-4 p-3 rounded-lg border border-blue-100">
          <Text className="text-sm font-medium text-blue-700 text-center">Date: {currentDate}</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="flex-row flex-wrap justify-between mb-4" style={{gap: 12}}>
        <GradientCard
          icon="account-group"
          label="Total Employees"
          count={Emp?.teamMembers ?? 0}
          gradient={["#4f46e5", "#6366f1"]}
        />
        <GradientCard
          icon="food"
          label="Opt For Food"
          count={OptforFood.length}
          outOf={Emp?.teamMembers ?? 0}
          gradient={["#059669", "#10b981"]}
        />
        <GradientCard
          icon="food-off"
          label="No Office Food"
          count={NotOptForFood.length}
          outOf={Emp?.teamMembers ?? 0}
          gradient={["#dc2626", "#ef4444"]}
        />
        <GradientCard
          icon="help-circle-outline"
          label="No Choice"
          count={NotDecided}
          outOf={Emp?.teamMembers ?? 0}
          gradient={["#475569", "#64748b"]}
        />
      </View>

      {/* Summary Section */}
      <View className="bg-white rounded-xl p-5 shadow-sm mb-5 border border-gray-100">
        <Text className="text-lg font-semibold text-gray-800 mb-4">Participation Summary</Text>
        
        <View className="space-y-3">
          <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
            <Text className="text-gray-600">Total Team Members</Text>
            <Text className="font-medium text-gray-800">{Emp?.teamMembers ?? 0}</Text>
          </View>
          <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
            <Text className="text-gray-600">Meal Participation</Text>
            <View className="flex-row items-center">
              <Text className="font-medium text-green-600 mr-1">{OptforFood.length}</Text>
              <Text className="text-xs text-gray-500">
                ({Emp?.teamMembers ? Math.round((OptforFood.length / Emp.teamMembers) * 100) : 0}%)
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
            <Text className="text-gray-600">Declined Meals</Text>
            <View className="flex-row items-center">
              <Text className="font-medium text-red-600 mr-1">{NotOptForFood.length}</Text>
              <Text className="text-xs text-gray-500">
                ({Emp?.teamMembers ? Math.round((NotOptForFood.length / Emp.teamMembers) * 100) : 0}%)
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-gray-600">Pending Responses</Text>
            <View className="flex-row items-center">
              <Text className="font-medium text-gray-600 mr-1">{NotDecided}</Text>
              <Text className="text-xs text-gray-500">
                ({Emp?.teamMembers ? Math.round((NotDecided / Emp.teamMembers) * 100) : 0}%)
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Status Indicator */}
      <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <View className="flex-row items-center">
          <View className={`h-3 w-3 rounded-full mr-2 ${NotDecided > 0 ? 'bg-yellow-400' : 'bg-green-400'}`} />
          <Text className="text-sm text-gray-600">
            {NotDecided > 0 
              ? `${NotDecided} team members haven't responded yet` 
              : 'All team members have responded'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}