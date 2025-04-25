import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const FoodComponent = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  const handleSubmit = () => {
    if (selectedValue) {
      // Animation when submitting
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalVisible(true);
        setHasSubmitted(true);
      });
    }
  };

  React.useEffect(() => {
    // Fade in animation when component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View 
      style={{ opacity: fadeAnim }}
      className="flex-1 items-center bg-white justify-center 0 p-5 pt-0"
    >
      {/* Header with logo */}
      <View className="w-full h-[140px] mb-4 justify-center items-center">
        <Image 
          source={require("../../assets/images/food2.png")} 
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

      {/* Card container */}
      <View className="bg-white p-6 rounded-xl w-full flex-1 shadow-sm"
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
        {hasSubmitted ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg font-medium text-gray-700 text-center p-4">
              Thank you for your response. We appreciate your participation.
            </Text>
            <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mt-4">
              <Text className="text-2xl">✓</Text>
            </View>
          </View>
        ) : (
          <>
            <Text className="text-xl font-semibold text-center text-gray-800 p-6 pb-2">
              Office Attendance & Lunch Preference
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-6">
              Please let us know your plans for today
            </Text>

            {/* Radio Buttons */}
            <View className="justify-center p-4 gap-6">
              {[
                { id: 'yes_coming', label: 'Yes, I will be in the office and will join for lunch' },
                { id: 'yes_own_lunch', label: 'Yes, I will be in the office but bringing my own lunch' },
                { id: 'no_coming', label: 'No, I will not be in the office today' }
              ].map((option) => (
                <TouchableOpacity
                  key={option.id}
                  className="flex-row items-start"
                  onPress={() => setSelectedValue(option.id)}
                  activeOpacity={0.7}
                >
                  <View className={`w-5 h-5 rounded-full border-2 ${selectedValue === option.id ? 'border-red-500' : 'border-gray-300'} mr-3 flex items-center justify-center mt-1`}>
                    {selectedValue === option.id && (
                      <View className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    )}
                  </View>
                  <Text className="text-gray-700 text-base flex-1">{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Submit Button */}
            <View className="mt-auto mb-4">
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                  disabled={!selectedValue}
                  onPress={handleSubmit}
                  className="rounded-lg overflow-hidden"
                  activeOpacity={0.8}
                >
                  {!selectedValue ? (
                    <View style={{ 
                      padding: 14, 
                      borderRadius: 8, 
                      alignItems: 'center', 
                      backgroundColor: '#e5e7eb' 
                    }}>
                      <Text className="text-gray-400 text-center text-base font-semibold">Submit</Text>
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
                      <Text className="text-white text-center text-base font-semibold">Submit</Text>
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              </Animated.View>
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
          <Animated.View 
            className="bg-white p-6 rounded-xl shadow-lg w-80"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              transform: [{
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                })
              }]
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
              Response Recorded
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
};

export default FoodComponent;