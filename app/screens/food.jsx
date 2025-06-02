import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';

const FoodComponent = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedValue) {
      setModalVisible(true);
      setHasSubmitted(true); // Prevent re-submission
    }
  };

  return (
    <View className="flex-1 items-center justify-center  bg-gray-100 p-5 pt-0">
      <View className="w-full h-[250px]">
  <Image source={require("../../assets/images/food2.png")} 
    style={{ width: '100%', height: '100%', resizeMode: 'contain' }}  />
</View>

      <View className="bg-gray-100 p-6 rounded-lg w-full flex-1">
        
        {/* If already submitted, show a message */}
        {hasSubmitted ? (
          <Text className="text-lg font-semibold text-center p-10 pt-0">
            You have already submitted your response. Thank you!
          </Text>
        ) : (
          <>
            {/* Heading */}
            <Text className="text-lg font-semibold text-center p-10 pb-0 pt-0">
              Are you coming to the office tomorrow?
            </Text>

            {/* Radio Buttons */}
            <View className="justify-center p-8 gap-8">
              {[
                { id: 'yes_coming', label: 'Yes, I am coming.' },
                { id: 'yes_own_lunch', label: 'Yes, I am coming, but I will be bringing my own lunch.' },
                { id: 'no_coming', label: 'No, I am not coming.' }
              ].map((option) => (
                <TouchableOpacity
                  key={option.id}
                  className="flex-row items-center"
                  onPress={() => setSelectedValue(option.id)}
                >
                  <View className={`w-5 h-5 rounded-full border-2 border-black mr-3 flex items-center justify-center`}>
                    {selectedValue === option.id && <View className="w-3 h-3 rounded-full bg-red-600" />}
                  </View>
                  <Text className="text-lg ml-6">{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Submit Button */}
            <View className="mt-auto">
              <TouchableOpacity
                disabled={!selectedValue || hasSubmitted}
                onPress={handleSubmit}
                className="rounded-lg overflow-hidden w-32 self-center"
              >
                {!selectedValue || hasSubmitted ? (
                  <View style={{ padding: 10, borderRadius: 9999, alignItems: 'center', backgroundColor: '#A0A0A0' }}>
                    <Text className="text-white text-center text-sm font-bold">Submit</Text>
                  </View>
                ) : (
                  <LinearGradient
                    colors={['#D01313', '#6A0A0A']}
                    style={{ padding: 10, borderRadius: 9999, alignItems: 'center' }}
                  >
                    <Text className="text-white text-center text-sm font-bold">Submit</Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-2xl shadow-lg w-80 h-60 items-center relative">
            <View className="absolute -top-10 w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center">
              <Text style={{ fontSize: 30 }}>👍</Text>
            </View>
            <Text className="text-lg text-center mt-10 font-semibold">
              Thank you for your valuable response
            </Text>
            <TouchableOpacity
              className="bg-red-500 px-4 py-2 rounded-full mt-8"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white text-center font-medium">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FoodComponent;