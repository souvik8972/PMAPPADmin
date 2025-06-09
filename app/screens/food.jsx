import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, Animated, RefreshControl, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format, addDays, isAfter } from 'date-fns';
import { AuthContext } from '@/context/AuthContext';
import { usePostData } from '@/ReactQuery/hooks/usePostData';
import { useFetchData } from '@/ReactQuery/hooks/useFetchData';
import FoodLoader from '@/components/FoodLoader';
import AssetLoading from '@/components/AssetLoading';
const FoodComponent = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [recordId, setRecordId] = useState(0);
  const [targetDate, setTargetDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  const { user } = useContext(AuthContext);
  

  const calculateTargetDate = useCallback(() => {
    const now = new Date();
    const noonToday = new Date(now);
    noonToday.setHours(10, 0, 0, 0);
    
    // If current time is after 12 PM, use tomorrow's date
    const dateToUse = isAfter(now, noonToday) ? addDays(now, 1) : now;
    return format(dateToUse, 'MM/dd/yyyy');
  }, []);

  const { data, isLoading: isFetching, refetch } = useFetchData(
    `Food/GetFoodDetails?st_dt=${targetDate}`,
    user.token
  );

  const { mutate: postFoodData, isLoading: isPosting } = usePostData('Food/SendFoodDetails');

  // Initialize target date on mount
  useEffect(() => {
    setTargetDate(calculateTargetDate());
  }, [calculateTargetDate]);

  // Initialize component with existing data
  useEffect(() => {
    if (data?.assests_requests?.length > 0) {
      const existingRecord = data.assests_requests[0];
      setRecordId(existingRecord.id);
      setHasSubmitted(true);
      
      // Map FoodOption back to radio button value
      switch(existingRecord.FoodOption) {
        case 1: setSelectedValue('yes_coming'); break;
        case 2: setSelectedValue('yes_own_lunch'); break;
        case 3: setSelectedValue('no_coming'); break;
        default: setSelectedValue('');
      }
    } else {
      setHasSubmitted(false);
      setRecordId(0);
      setSelectedValue('');
    }
  }, [data]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => {
      setRefreshing(false);
    });
  }, [refetch]);

  const handleSubmit = () => {
    if (selectedValue) {
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
        const foodOpt = getFoodOptionValue(selectedValue);
        
        const queryParams = {
          id: recordId,
          foodOpt: foodOpt,
          Empid: user?.empId,
          FoodDate: targetDate,
          action: recordId === 0 ? 'Insert' : 'Update'
        };

        postFoodData(
          { 
            data: null,
            token: user?.token,
            queryParams 
          },
          {
            onSuccess: (response) => {
              setModalVisible(true);
              setHasSubmitted(true);
              setIsEditing(false);
              if (recordId === 0 && response?.id) {
                setRecordId(response.id);
              }
              // Refresh data after submission
              refetch();
            },
            onError: (error) => {
              // console.log('API Error:', error);
            }
          }
        );
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setHasSubmitted(false);
  };

  const getFoodOptionValue = (value) => {
    switch(value) {
      case 'yes_coming': return 1;
      case 'yes_own_lunch': return 2;
      case 'no_coming': return 3;
      default: return 0;
    }
  };

  const getFoodOptionText = (value) => {
    switch(value) {
      case 1: return 'I will be in the office and will join for lunch';
      case 2: return 'I will be in the office but bringing my own lunch';
      case 3: return 'I will not be in the office tomorrow';
      default: return '';
    }
  };

  const getDisplayDate = () => {
    try {
      const dateParts = targetDate.split('/');
      const date = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`);
      return format(date, 'MMMM d, yyyy');
    } catch (e) {
      return targetDate; // fallback to raw date if parsing fails
    }
  };

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  if (isFetching && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500 mb-4">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#D01313']}
          tintColor="#D01313"
        />
      }
    >
      <Animated.View 
        style={{ opacity: fadeAnim }}
        className="flex-1 items-center bg-white justify-center p-5 pt-0"
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
        <View className="bg-white p-6 rounded-xl w-full flex-1 shadow-sm min-h-[400px]"
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
              <Text className="text-lg font-medium text-gray-700 text-center p-4">
                You have already submitted your response for {getDisplayDate()}:
              </Text>
              {data?.assests_requests?.length > 0 && (
                <View className="bg-gray-50 p-4 rounded-lg mb-4">
                  <Text className="text-center font-medium">
                    {getFoodOptionText(data.assests_requests[0].FoodOption)}
                  </Text>
                  <Text className="text-center text-gray-500 text-sm mt-2">
                    Submitted on: {format(new Date(data.assests_requests[0].createdDate), 'MMM dd, yyyy hh:mm a')}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                onPress={handleEdit}
                className="mt-6 bg-gray-100 px-6 py-2 rounded-lg"
                activeOpacity={0.7}
              >
                <Text className="text-gray-700 font-medium">Edit Response</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text className="text-xl font-semibold text-center text-gray-800 p-6 pb-2">
                Office Attendance & Lunch Preference
              </Text>
              <Text className="text-sm text-gray-500 text-center mb-6">
                Please let us know your plans for {getDisplayDate()}
              </Text>

              {/* Radio Buttons */}
              <View className="justify-center p-4 gap-6">
                {[
                  { id: 'yes_coming', label: 'Yes, I will be in the office and will join for lunch' },
                  { id: 'yes_own_lunch', label: 'Yes, I will be in the office but bringing my own lunch' },
                  { id: 'no_coming', label: 'No, I will not be in the office tomorrow' }
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
                    disabled={!selectedValue || isPosting}
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
                        <Text className="text-gray-400 text-center text-base font-semibold">
                          {isPosting ? 'Submitting...' : 'Submit'}
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
                          {isPosting ? 'Submitting...' : isEditing ? 'Update' : 'Submit'}
                        </Text>
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
                Response {isEditing ? 'Updated' : 'Recorded'}
              </Text>
              <Text className="text-sm text-center text-gray-500 mt-2">
                Thank you for letting us know your plans for {getDisplayDate()}
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
    </ScrollView>
  );
};

export default FoodComponent;