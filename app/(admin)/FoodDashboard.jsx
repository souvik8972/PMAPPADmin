import React, { useContext, useMemo, useState } from "react";
import { FlatList, View, Text, RefreshControl } from "react-native";
import GradientCard from '../../components/GradientCard';
import { API_URL } from '@env';
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
      await Promise.all([refetch()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading && TotalCountLoad) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Loading...</Text>
      </View>
    );
  }

  if (apiError || resourcesError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-red-500">Error loading data</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f1f5f9]">
      {/* <FlatList
        data={[1]} // Dummy data for FlatList
        keyExtractor={() => "foodDashboard"}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
        renderItem={() => (
          <>
            <View className="bg-white shadow-md p-5 rounded-3xl mb-6 items-center">
              <Text className="text-3xl font-bold text-gray-800">
                🍱 Food Dashboard
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Monitor today's office food preferences
              </Text>
            </View>

            <View className="flex-row justify-between mb-4">
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

            <View className="flex-row justify-between mb-6">
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

            <View className="bg-white rounded-2xl p-4 shadow-md">
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Summary
              </Text>

              <View className="mb-2">
                <Text className="text-gray-700">
                  <Text>Total Employees: </Text>
                  <Text className="font-semibold text-gray-900">
                    {Emp?.teamMembers ?? 0}
                  </Text>
                </Text>
              </View>

              <View className="mb-2">
                <Text className="text-gray-700">
                  <Text>Opted for Office Food: </Text>
                  <Text className="font-semibold text-green-700">
                    {OptforFood.length}
                  </Text>
                </Text>
              </View>

              <View className="mb-2">
                <Text className="text-gray-700">
                  <Text>Declined Office Food: </Text>
                  <Text className="font-semibold text-red-700">
                    {NotOptForFood.length}
                  </Text>
                </Text>
              </View>

              <View>
                <Text className="text-gray-700">
                  <Text>No Response: </Text>
                  <Text className="font-semibold text-gray-600">
                    {NotDecided}
                  </Text>
                </Text>
              </View>
            </View>
          </>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
            progressBackgroundColor="#ffffff"
          />
        }
      /> */}
    </View>
  );
}