import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { useFetchData } from '@/ReactQuery/hooks/useFetchData';
import { AuthContext } from '@/context/AuthContext';
import { usePostData } from '@/ReactQuery/hooks/usePostData';

const AllRequest = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localRequestStatus, setLocalRequestStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useContext(AuthContext);

  // Calculate dates for the API request
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  
  const formatDateForAPI = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const st_dt = formatDateForAPI(sevenDaysAgo);
  const ed_dt = formatDateForAPI(today);

  // Fetch requests data with refetch function from useFetchData
  const { data: apiResponse, isLoading, isError, error, refetch } = useFetchData(
    `Assests/GetAssestRequests?st_dt=${st_dt}&ed_dt=${ed_dt}`,
    user?.token
  );

  // Pull to refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => {
      setRefreshing(false);
    });
  }, [refetch]);

  // Status update mutation
  const { mutate: updateStatus, isLoading: isUpdatingStatus } = usePostData(
    'Assests/UpdateAssetStatus',
    ['Assests/GetAssestRequests']
  );

  // Track local status changes
  useEffect(() => {
    if (selectedRequest) {
      setLocalRequestStatus(selectedRequest.status);
    }
  }, [selectedRequest]);

  const handleStatusUpdate = (newStatus) => {
    if (!selectedRequest) return;
    
    // Optimistically update local state
    setLocalRequestStatus(newStatus);
    
    updateStatus({
      data: null,
      token: user?.token,
      queryParams: {
        reqid: selectedRequest.Id,
        status: newStatus
      }
    }, {
      onSuccess: () => {
        Alert.alert(
          'Success',
          `Status updated to ${getStatusDetails(newStatus).text}`,
          [{ text: 'OK' }]
        );
        refetch(); // Refresh data after successful update
      },
      onError: (error) => {
        // Revert on error
        setLocalRequestStatus(selectedRequest.status);
        Alert.alert(
          'Error',
          'Failed to update status',
          [{ text: 'OK' }]
        );
      }
    });
  };

  const getCurrentStatus = () => {
    return localRequestStatus !== null ? localRequestStatus : selectedRequest?.status;
  };

  const processApiData = (response) => {
    if (!response) return [];
    if (response.assests_requests && Array.isArray(response.assests_requests)) {
      return response.assests_requests;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  };

  const apiData = processApiData(apiResponse);
  const isEmptyResponse = apiData.length === 0;
  const data = apiData;

  const getStatusDetails = (status) => {
    switch(status) {
      case 1: return { text: 'Pending', color: '#F97316', bgColor: '#FFEDD5', icon: 'clockcircleo' };
      case 2: return { text: 'Active', color: '#10B981', bgColor: '#D1FAE5', icon: 'checkcircleo' };
      case 3: return { text: 'Returned', color: '#7C3AED', bgColor: '#EDE9FE', icon: 'swap' };
      default: return { text: 'Unknown', color: '#6B7280', bgColor: '#F3F4F6', icon: 'questioncircleo' };
    }
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString || (typeof dateString === 'object' && Object.keys(dateString).length === 0) || dateString === '{}') {
      return 'Not specified';
    }
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid date' : 
        date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const cleanText = (text) => {
    if (!text) return 'Not specified';
    return text.toString().trim().replace(/\s+/g, ' ') || 'Not specified';
  };

  const getItemList = (items) => {
    if (!items) return [];
    if (Array.isArray(items)) return items;
    if (typeof items === 'string') return items.split(',').map(item => item.trim());
    return [];
  };

  if (isLoading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-gray-600">Loading requests...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 font-medium mb-2">Error loading requests</Text>
        <Text className="text-gray-600">{error?.message || 'Unknown error occurred'}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className='w-full mt-3 mb-2 flex items-center justify-center'>
        <Text className="text-gray-800">
          {`Fetching data from `}
          <Text className="text-red-900">{st_dt}</Text>
          {` to ${ed_dt}`}
        </Text>
      </View>

      <ScrollView 
        className="px-4 pt-4 mb-6" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0000ff']}
            tintColor="#0000ff"
          />
        }
      >
        {isEmptyResponse && (
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-500">No requests found for this period</Text>
          </View>
        )}

        {data.map((request) => {
          const status = getStatusDetails(request?.status);
          const items = getItemList(request?.ItemList);
          const firstItem = items[0] || 'No items specified';
          const hasMultipleItems = items.length > 1;
          
          return (
            <TouchableOpacity 
              key={request?.Id || Math.random().toString()}
              onPress={() => {
                setSelectedRequest(request);
                setIsModalVisible(true);
              }}
              className="mb-4 p-4 rounded-lg border border-gray-200 bg-white"
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-semibold text-gray-900">
                  {request?.Request_Id || 'N/A'}
                </Text>
                <View 
                  className="px-2 py-1 rounded-full" 
                  style={{ backgroundColor: status.bgColor }}
                >
                  <Text 
                    className="text-xs font-medium" 
                    style={{ color: status.color }}
                  >
                    {status.text}
                  </Text>
                </View>
              </View>
              
              <View className="mb-3">
                <Text className="text-gray-800 font-medium">
                  {firstItem}
                </Text>
                {hasMultipleItems && (
                  <Text className="text-gray-500 text-sm mt-1">
                    +{items.length - 1} more items
                  </Text>
                )}
              </View>
              
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <View className="w-6 h-6 bg-gray-100 rounded-full items-center justify-center mr-2">
                    <FontAwesome name="user" size={12} color="#6B7280" />
                  </View>
                  <Text className="text-gray-700">
                    {cleanText(request?.EmpName) || 'Unknown'}
                  </Text>
                </View>
                <Text className="text-gray-500 text-xs">
                  {formatDisplayDate(request?.Request_RaisedDate)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => {
          setIsModalVisible(false);
          setLocalRequestStatus(null);
        }}
    >
        <View className="flex-1 bg-white mb-6">
          <View className="px-6 pb-4 border-b border-gray-200">
            <View className="flex-row mt-4 justify-center mb-4 items-center">
              <Text className="text-xl font-bold text-center text-gray-900">Request Details</Text>
            </View>
            
            <View className='flex items-center'>
              <Text className="text-gray-900 font-semibold text-lg mr-2">
                #{selectedRequest?.Request_Id || 'N/A'}
              </Text>
            </View>
          </View>
          
          <ScrollView className="p-6 pb-0 bg-white">
            {selectedRequest && (
              <>
                <View className="mb-0 flex-1 ">
                  <View className="flex-row justify-between items-center mb-6">
                    <View className="flex-row items-center">
                      <View 
                        className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-3"
                        style={{
                          borderWidth: 1, 
                          borderColor: getStatusDetails(getCurrentStatus()).color
                        }}
                      >
                        <FontAwesome 
                          name="user" 
                          size={20} 
                          style={{ color: getStatusDetails(getCurrentStatus()).color }} 
                        />
                      </View>
                      <View>
                        <Text className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                          Employee
                        </Text>
                        <Text className="text-gray-900 font-semibold text-lg">
                          {cleanText(selectedRequest.EmpName) || 'Unknown'}
                        </Text>
                      </View>
                    </View>
                    
                    <View className="items-end bg-red-400">
                      <View className="flex-row items-center">
                        <View 
                          className="px-3 py-1 rounded-full" 
                          style={{ 
                            backgroundColor: getStatusDetails(getCurrentStatus()).bgColor,
                            shadowColor: getStatusDetails(getCurrentStatus()).color,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 3
                          }}
                        >
                          <Text 
                            className="text-xs font-bold uppercase tracking-wider" 
                            style={{ color: getStatusDetails(getCurrentStatus()).color }}
                          >
                            {getStatusDetails(getCurrentStatus()).text}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  
                  <View className="mb-6">
                    <Text className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-3">
                      Items Requested
                    </Text>
                    <View  className="bg-gray-50   rounded-xl border text-center p-4   border-gray-100">
                      {getItemList(selectedRequest.ItemList).length > 0 ? (
                        getItemList(selectedRequest.ItemList).map((item, index) => (
                          <View key={index} className="flex-row items-start  last:mb-0">
                            <View className="rounded-full bg-gray-400 " />
                            <Text className="text-gray-800 flex-1 font-medium">{item}</Text>
                          </View>
                        ))
                      ) : (
                        <Text className="text-gray-500 italic">No items specified</Text>
                      )}
                    </View>
                  </View>
                  
                  <View className="mb-6">
                    <Text className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-3">
                      Reason
                    </Text>
                    <View className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <Text className="text-gray-800 font-medium leading-5">
                        {cleanText(selectedRequest.Reason) || 'No reason provided'}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="flex-row justify-between mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <View className="items-center flex-1">
                      <Text className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                        Requested
                      </Text>
                      <Text className="text-gray-600 text-xs">
                        {formatDisplayDate(selectedRequest.Request_RaisedDate)}
                      </Text>
                    </View>
                    
                    <View className="h-12 w-px bg-gray-200 mx-2" />
                    
                    <View className="items-center flex-1">
                      <Text className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                        Issued
                      </Text>
                      <Text className="text-gray-600 text-xs">
                        {formatDisplayDate(selectedRequest.Item_IssueDate)}
                      </Text>
                    </View>
                    
                    <View className="h-12 w-px bg-gray-200 mx-2" />
                    
                    <View className="items-center flex-1">
                      <Text className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                        Returned
                      </Text>
                      <Text className="text-gray-600 text-xs">
                        {formatDisplayDate(selectedRequest.Item_TakeBackDate)}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={{borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 5, marginTop: 2,marginBottom:10}}>
                  <Text style={{color: '#111827', fontWeight: '500', marginBottom: 16, textAlign: 'center'}}>
                    Update Status
                  </Text>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 24}}>
                    <TouchableOpacity 
                      style={[
                        {flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 8, borderWidth: 1},
                        getCurrentStatus() === 1 
                          ? {borderColor: '#fdba74', backgroundColor: '#fed7aa'} 
                          : {borderColor: '#e5e7eb', backgroundColor: 'white'}
                      ]}
                      onPress={() => handleStatusUpdate(1)}
                      disabled={isUpdatingStatus}
                    >
                      {isUpdatingStatus && getCurrentStatus() === 1 ? (
                        <ActivityIndicator size="small" color="#F97316" />
                      ) : (
                        <>
                          <AntDesign name="clockcircleo" size={16} color="#F97316" />
                          <Text style={[
                            {marginTop: 4, fontSize: 14, fontWeight: '500'},
                            getCurrentStatus() === 1 ? {color: '#9a3412'} : {color: '#374151'}
                          ]}>
                            Pending
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        {flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 8, borderWidth: 1},
                        getCurrentStatus() === 2 
                          ? {borderColor: '#86efac', backgroundColor: '#bbf7d0'} 
                          : {borderColor: '#e5e7eb', backgroundColor: 'white'}
                      ]}
                      onPress={() => handleStatusUpdate(2)}
                      disabled={isUpdatingStatus}
                    >
                      {isUpdatingStatus && getCurrentStatus() === 2 ? (
                        <ActivityIndicator size="small" color="#10B981" />
                      ) : (
                        <>
                          <AntDesign name="checkcircleo" size={16} color="#10B981" />
                          <Text style={[
                            {marginTop: 4, fontSize: 14, fontWeight: '500'},
                            getCurrentStatus() === 2 ? {color: '#166534'} : {color: '#374151'}
                          ]}>
                            Active
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        {flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 8, borderWidth: 1},
                        getCurrentStatus() === 3 
                          ? {borderColor: '#7e22ce', backgroundColor: '#e9d5ff'} 
                          : {borderColor: '#e5e7eb', backgroundColor: 'white'}
                      ]}
                      onPress={() => handleStatusUpdate(3)}
                      disabled={isUpdatingStatus}
                    >
                      {isUpdatingStatus && getCurrentStatus() === 3 ? (
                        <ActivityIndicator size="small" color="#7C3AED" />
                      ) : (
                        <>
                          <AntDesign name="swap" size={16} color="#7C3AED" />
                          <Text style={[
                            {marginTop: 4, fontSize: 14, fontWeight: '500'},
                            getCurrentStatus() === 3 ? {color: '#6b21a8'} : {color: '#374151'}
                          ]}>
                            Returned
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
          
          <View className="px-6 pb-8 pt-6 border-t border-gray-200">
            <TouchableOpacity 
              className=" py-3 bg-red-800 rounded-lg items-center"
              onPress={() => {
                setIsModalVisible(false);
                setLocalRequestStatus(null);
              }}
            >
              <Text className=" text-white font-medium">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AllRequest;