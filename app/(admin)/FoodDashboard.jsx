import React, { useContext, useMemo, useState } from "react";
import { ScrollView, View, Text, RefreshControl } from "react-native";
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
      <View className="flex-1 justify-center items-center bg-[#f1f5f9]">
        <Text className="text-lg font-medium text-gray-700">Loading...</Text>
      </View>
    );
  }

  if (apiError || resourcesError) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f1f5f9]">
        <Text className="text-lg text-red-600 font-semibold">Error loading data</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-[#f1f5f9]"
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
      <View className="bg-white p-6 rounded-3xl shadow-md mb-4 items-center">
        <Text className="text-4xl font-extrabold text-gray-900 mb-2">🍱 Food Dashboard</Text>
        <Text className="text-base text-gray-500">Track today’s food choices at a glance</Text>
      </View>

      <View className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 items-center">
        <Text className="text-base font-medium text-blue-700">📅 Date: {currentDate}</Text>
      </View>

      <View className="flex-row justify-between mb-4 space-x-2">
        <GradientCard
          icon="account-group"
          label="Total Employees"
          count={Emp?.teamMembers ?? 0}
          gradient={["#3b82f6", "#60a5fa"]}
        />
        <GradientCard
          icon="food"
          label="Opt For Food"
          count={OptforFood.length}
          outOf={Emp?.teamMembers ?? 0}
          gradient={["#22c55e", "#86efac"]}
        />
      </View>

      <View className="flex-row justify-between mb-6 space-x-2">
        <GradientCard
          icon="food-off"
          label="No Office Food"
          count={NotOptForFood.length}
          outOf={Emp?.teamMembers ?? 0}
          gradient={["#ef4444", "#f87171"]}
        />
        <GradientCard
          icon="help-circle-outline"
          label="No Choice"
          count={NotDecided}
          outOf={Emp?.teamMembers ?? 0}
          gradient={["#64748b", "#cbd5e1"]}
        />
      </View>

      <View className="bg-white rounded-2xl p-5 shadow-md">
        <Text className="text-xl font-bold text-gray-800 mb-4">📊 Summary</Text>

        <View className="space-y-2">
          <Text className="text-gray-700">
            Total Employees: <Text className="font-semibold text-gray-900">{Emp?.teamMembers ?? 0}</Text>
          </Text>
          <Text className="text-gray-700">
            Opted for Office Food: <Text className="font-semibold text-green-700">{OptforFood.length}</Text>
          </Text>
          <Text className="text-gray-700">
            Declined Office Food: <Text className="font-semibold text-red-600">{NotOptForFood.length}</Text>
          </Text>
          <Text className="text-gray-700">
            No Response: <Text className="font-semibold text-gray-600">{NotDecided}</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
