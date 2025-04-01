import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MaterialIcons } from "@expo/vector-icons";
import "nativewind";

const RenderItem = ({ item ,selectedAssets,handlePress}) => {
  

  
  return ( <TouchableOpacity
      onPress={() => !item.taken && handlePress(item.id)}
      className={`w-28 h-36 m-2 p-3 rounded-xl items-center justify-between 
      ${selectedAssets.includes(item.id) ? "bg-[#d0e4cd]" : item.taken ? "bg-red-400 opacity-50" : "bg-[#e3e6e3]"}`}
      disabled={item.taken}
    >
      <MaterialIcons name={item.icon} size={40} color="black" />
      <Text className="text-xs text-center mt-2">{item.name}</Text>
      <TouchableOpacity onPress={() => !item.taken && handlePress(item.id)}>
        {selectedAssets.includes(item.id) ? (
          <MaterialIcons name="check-box" size={24} color="gray" />
        ) : (
          <MaterialIcons name="check-box-outline-blank" size={24} color="black" />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );

 
}

export default RenderItem

