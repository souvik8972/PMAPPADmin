import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FadeIn } from 'react-native-reanimated';

export default function Food() {
  const [selectedValue, setSelectedValue] = useState(null);
  const [lunchType, setLunchType] = useState(null); // New state for lunch type
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

const handleSubmit = async () => {
  setIsLoading(true);

  try {
    const response = await fetch('https://your-api-url.com/submit-lunch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attendance: selectedValue,
        lunchPreference: lunchType, // will be null if not selected
        date: new Date().toISOString().split('T')[0], // optional: send today's date
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setHasSubmitted(true);
      setModalVisible(true);
    } else {
      console.error('Server Error:', data);
      alert('Failed to submit. Please try again later.');
    }
  } catch (error) {
    console.error('Network Error:', error);
    alert('Failed to submit. Please check your connection.');
  }

  setIsLoading(false);
};


  const handleEdit = () => {
    setIsEditing(true);
    setHasSubmitted(false);
  };

  return (
    <Animated.View
      style={{ opacity: fadeAnim }}
      className="flex-1 items-center bg-white justify-center  pt-0 p-3"
    >
      {/* Header with logo */}
      <View className="w-full h-[140px]  justify-center items-center">
        <Image
          source={require('../../assets/images/food2.png')}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        />
      </View>

      {/* Card Container */}
      <View
        className="bg-white p-8 rounded-xl w-full flex-1 shadow-sm"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 3,
          borderWidth: 1,
          borderColor: '#f3f4f6',
        }}
      >
        {hasSubmitted && !isEditing ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg font-medium text-gray-700 text-center p-8">
              Thank you for your response. We appreciate your participation.
            </Text>
            <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mt-4">
              <Text className="text-2xl">✓</Text>
            </View>
            {/* <TouchableOpacity
              onPress={handleEdit}
              className="mt-6 bg-gray-100 px-6 py-2 rounded-lg"
              activeOpacity={0.7}
            >
              <Text className="text-gray-700 font-medium">Edit Response</Text>
            </TouchableOpacity> */}
          </View>
        ) : (
          <>
            <Text className="text-xl font-semibold text-center text-gray-800 p-2 pb-2">
              Office Attendance & Lunch Preference
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-6">
              Please let us know your plans for Tomorrow
            </Text>

            {/* Radio Buttons */}
            <View className="justify-center p-4 gap-6">
              {[
                {
                  id: 'yes_coming',
                  label:
                    'Yes, I will be in the office and will join for lunch',
                },
                {
                  id: 'yes_own_lunch',
                  label:
                    'Yes, I will be in the office but bringing my own lunch',
                },
                {
                  id: 'no_coming',
                  label: 'No, I will not be in the office today',
                },
              ].map((option) => (
                <TouchableOpacity
                  key={option.id}
                  className="flex-row items-start mb-4"
                  onPress={() => setSelectedValue(option.id)}
                  activeOpacity={0.7}
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 ${
                      selectedValue === option.id
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } mr-3 flex items-center justify-center mt-1`}
                  >
                    {selectedValue === option.id && (
                      <View className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    )}
                  </View>
                  <Text className="text-gray-700 text-base flex-1">
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Veg / Non-Veg Preference */}
            {selectedValue === 'yes_coming' && (
              <Animated.View
                entering={FadeIn.duration(500)}
                className="mt-2 mb-4 px-4 py-4 rounded-xl bg-red-50 border border-red-100"
              >
                <Text className="text-base font-medium text-gray-800 mb-2 text-center">
                  What’s your lunch preference?
                </Text>

                <View className="flex-row justify-center gap-6">
                  {['veg', 'nonveg'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setLunchType(option)}
                      className={`flex items-center gap-1 px-5 py-3 rounded-xl border ${
                        lunchType === option
                          ? 'bg-red-100 border-red-500'
                          : 'bg-white border-gray-200'
                      }`}
                      activeOpacity={0.8}
                    >
                      <Text className={`text-xl`}>
                        {option === 'veg' ? '🥦' : '🍗'}
                      </Text>
                      <Text
                        className={`text-sm font-medium ${
                          lunchType === option
                            ? 'text-red-700'
                            : 'text-gray-600'
                        }`}
                      >
                        {option === 'veg' ? 'Veg' : 'Non-Veg'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>
            )}

            {/* Submit Button */}
            <View className="mt-auto mb-4">
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                  disabled={
                    !selectedValue ||
                    (selectedValue === 'yes_coming' && !lunchType) ||
                    isLoading
                  }
                  onPress={handleSubmit}
                  className="rounded-lg overflow-hidden"
                  activeOpacity={0.8}
                >
                  {!selectedValue ||
                  (selectedValue === 'yes_coming' && !lunchType) ? (
                    <View
                      style={{
                        padding: 14,
                        borderRadius: 8,
                        alignItems: 'center',
                        backgroundColor: '#e5e7eb',
                      }}
                    >
                      <Text className="text-gray-400 text-center text-base font-semibold">
                        {isLoading ? 'Submitting...' : 'Submit'}
                      </Text>
                    </View>
                  ) : (
                    <LinearGradient
                      colors={['#D01313', '#A01010']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        padding: 14,
                        borderRadius: 8,
                        alignItems: 'center',
                        shadowColor: '#D01313',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        elevation: 3,
                      }}
                    >
                      <Text className="text-white text-center text-base font-semibold">
                        {isLoading ? 'Submitting...' : isEditing ? 'Update' : 'Submit'}
                      </Text>
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>
          </>
        )}
      </View>

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <Animated.View
            className="bg-white p-6 rounded-xl shadow-lg w-80"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            }}
          >
            <View className="absolute -top-8 left-0 right-0 items-center">
              <View className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center">
                <View className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                  <Text style={{ fontSize: 28, color: '#10B981' }}>✓</Text>
                </View>
              </View>
            </View>
            <Text className="text-lg text-center mt-8 font-medium text-gray-800">
              Response {isEditing ? 'Updated' : 'Recorded'}
            </Text>
            <Text className="text-sm text-center text-gray-500 mt-2">
              Thank you for letting us know your plans.
            </Text>
            <TouchableOpacity
              className="bg-red-500 px-6 py-3 rounded-lg mt-6"
              onPress={() => setModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-medium">Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </Animated.View>
  );
}

