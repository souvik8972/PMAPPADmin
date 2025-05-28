import React from "react";
import { FlatList, View, Text } from "react-native";
import GradientCard from '../../components/GradientCard'

const data = {
  totalPeople: 30,
  veg: 10,
  nonVeg: 15,
  noChoice: 5,
};

const cards = [
  {
    icon: "account-group",
    label: "Total People",
    count: data.totalPeople,
    gradient: ["#3b82f6", "#60a5fa"],
  },
  {
    icon: "leaf",
    label: "Veg",
    count: data.veg,
    gradient: ["#22c55e", "#86efac"],
  },
  {
    icon: "food-drumstick",
    label: "Non-Veg",
    count: data.nonVeg,
    gradient: ["#ef4444", "#f87171"],
  },
  {
    icon: "help-circle-outline",
    label: "No Choice",
    count: data.noChoice,
    gradient: ["#64748b", "#cbd5e1"],
  },
];
const summaryText = `Out of ${data.totalPeople} people, ${data.veg} prefer Veg, ${data.nonVeg} prefer Non-Veg, and ${data.noChoice} made no choice.`;


export default function FoodDashboard() {
  return (
     <View className="flex-1 bg-[#f1f5f9] px-4 py-6">
    
      <View className="bg-white shadow-md p-5 rounded-3xl mb-6 items-center">
        <Text className="text-3xl font-bold text-gray-800">🍱 Food Dashboard</Text>
        <Text className="text-sm text-gray-500 mt-1">Monitor today’s office food preferences</Text>
      </View>
         <View className="flex-1 p-4">
      {/* First Row */}
      <View className="flex-row justify-between mb-4">
        <GradientCard
          icon="account-group"
          label="Total Employe"
          count={data.totalPeople}
          gradient={["#3b82f6", "#60a5fa"]}
        />
        <GradientCard
          icon="leaf"
          label="Veg"
          count={`${data.veg}`}
           outOf={30}
          gradient={["#22c55e", "#86efac"]}
        />
      </View>

      {/* Second Row */}
      <View className="flex-row justify-between mb-4">
        <GradientCard
          icon="food-drumstick"
          label="Non-Veg"
          count={data.nonVeg}
          outOf={30}
          gradient={["#ef4444", "#f87171"]}
        />
        <GradientCard
          icon="help-circle-outline"
          label="No Choice"
          count={data.noChoice}
          outOf={30}
          gradient={["#64748b", "#cbd5e1"]}
        />
      </View>

      {/* Summary Card */}
      <View className="bg-white rounded-2xl p-4 shadow-md">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Summary</Text>
        <Text className="text-base text-gray-600">{summaryText}</Text>
      </View>
    </View>
       
    
    </View>
  );
}
