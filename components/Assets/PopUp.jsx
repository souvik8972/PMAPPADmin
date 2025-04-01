import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'react-native-svg'

const PopUp = ({handleTextInputChange,handleModalSubmit,handleCancelModal,textInput}) => {
  return (
    <View className="flex-1 justify-center items-center bg-black/50" >
    <View className="bg-white p-5 rounded-lg w-[90%]">
      <Text className="text-lg font-bold mb-4">Enter Details</Text>
      <TextInput
        value={textInput}
        onChangeText={handleTextInputChange}
        placeholder="Enter text"
        className="border border-gray-300 h-12 p-2 rounded mb-4"
      />
      {/* Button Container with Row Layout */}
      <View className="flex-row justify-between">
        {/* Submit Button with Gradient */}
        <TouchableOpacity 
          onPress={handleModalSubmit}
          className="flex-1 mr-2" // Adds space between buttons
        >
          <LinearGradient
            colors={['#D01313', '#6A0A0A']} // Gradient colors
            style={{
              padding: 10,
              borderRadius: 9999,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Submit
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity onPress={handleCancelModal} className="flex-1">
          <View className="bg-gray-100 p-3 rounded-full justify-center items-center">
            <Text className="text-red-500 text-center font-bold">Cancel</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  </View>)
}

export default PopUp