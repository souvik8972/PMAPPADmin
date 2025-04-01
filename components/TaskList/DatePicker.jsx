
import React from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const DatePicker = ({handleDateSelection,dates,selectedDate}) => {
  return (
    <View className="h-[100px] " >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="my-2  ">
          {dates.map((date, index) => (
            <TouchableOpacity key={index} onPress={() => handleDateSelection(date)}>
              {selectedDate === date ? (
                <LinearGradient
                  colors={["#D01313", "#6A0A0A"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ borderRadius: 20, marginRight: 12, height: 80 }}
                >
                  <View className="px-3 py-1 h-[80px] flex justify-center items-center w-[50px] rounded-[20px]">
                    <Text className="text-white font-bold text-sm">{date}</Text>
                  </View>
                </LinearGradient>
              ) : (
                <View className="px-3 py-1 mx-1 h-[80px] flex justify-center items-center w-[50px] mr-3 rounded-[20px] bg-gray-200">
                  <Text className="text-black text-sm">{date}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
        </View>
  )
}

export default DatePicker