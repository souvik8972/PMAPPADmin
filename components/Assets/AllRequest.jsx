import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Ionicons, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import ComingSoonScreen from "../ComingSoonScreen"
const AllRequest = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

 const data = [
    {
      "Id": 1416,
      "Emp_Id": 113,
      "Reason": "U know why",
      "Item_IssueDate": {},
      "Item_TakeBackDate": {},
      "status": 1,
      "Request_RaisedDate": "2025-05-22T00:00:00",
      "Request_Id": "MTHA1416",
      "EmpName": "Yukta Damanekar",
      "ItemList": "Android Tab Chargers"
    },
    {
      "Id": 1415,
      "Emp_Id": 113,
      "Reason": "Bggt",
      "Item_IssueDate": {},
      "Item_TakeBackDate": {},
      "status": 1,
      "Request_RaisedDate": "2025-05-21T00:00:00",
      "Request_Id": "MTHA1415",
      "EmpName": "Yukta Damanekar",
      "ItemList": "IPAD PRO(12.9) 4TH GEN(MHC-003)"
    },
    {
      "Id": 433,
      "Emp_Id": 122,
      "Reason": "Bybybub",
      "Item_IssueDate": "2025-05-15T00:00:00",
      "Item_TakeBackDate": "2025-05-15T00:00:00",
      "status": 2,
      "Request_RaisedDate": "2025-04-24T00:00:00",
      "Request_Id": "MTHA433",
      "EmpName": "Souvik Das",
      "ItemList": "Camera Stand"
    },
    {
      "Id": 432,
      "Emp_Id": 122,
      "Reason": "Ubububunn",
      "Item_IssueDate": {},
      "Item_TakeBackDate": "2025-05-21T00:00:00",
      "status": 3,
      "Request_RaisedDate": "2025-04-24T00:00:00",
      "Request_Id": "MTHA432",
      "EmpName": "Souvik Das",
      "ItemList": "PenDrive, Phone Chargers, IPAD PRO(12.9) 4TH GEN(MHC-003), Ipad Chargers, Ipad Cables, I pad pro 5G 13Inch(MHC-008), Android Tab Chargers"
    },
    {
      "Id": 431,
      "Emp_Id": 122,
      "Reason": "Hjk",
      "Item_IssueDate": {},
      "Item_TakeBackDate": {},
      "status": 1,
      "Request_RaisedDate": "2025-04-24T00:00:00",
      "Request_Id": "MTHA431",
      "EmpName": "Souvik Das",
      "ItemList": "Phone Cables"
    },
  ];


  const getStatusDetails = (status) => {
    switch(status) {
      case 1: 
        return { 
          text: 'Pending', 
          color: '#F97316', // Orange
          bgColor: '#FFEDD5',
          icon: 'clockcircleo'
        };
      case 2: 
        return { 
          text: 'Active', 
          color: '#10B981', // Green
          bgColor: '#D1FAE5',
          icon: 'checkcircleo'
        };
      case 3: 
        return { 
          text: 'Returned', 
          color: '#7C3AED', // Purple
          bgColor: '#EDE9FE',
          icon: 'swap'
        };
      default: 
        return { 
          text: 'Unknown', 
          color: '#6B7280', // Gray
          bgColor: '#F3F4F6',
          icon: 'questioncircleo'
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || Object.keys(dateString).length === 0) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <ComingSoonScreen/>

      {/* Request List */}
      {/* <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false}>
        {data.map((request) => {
          const status = getStatusDetails(request.status);
          
          return (
            <TouchableOpacity 
              key={request.Id}
              onPress={() => {
                setSelectedRequest(request);
                setIsModalVisible(true);
              }}
              className="mb-4 p-5 rounded-xl border border-gray-100"
              activeOpacity={0.9}
            >
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-lg font-semibold text-gray-900">{request.Request_Id}</Text>
                <View 
                  className="px-3 py-1 rounded-full" 
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
              
              <View className="mb-4">
                <Text className="text-gray-800 font-medium mb-1">{request.ItemList.split(',')[0]}</Text>
                {request.ItemList.split(',').length > 1 && (
                  <Text className="text-gray-500 text-sm">
                    +{request.ItemList.split(',').length - 1} more items
                  </Text>
                )}
              </View>
              
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <View className="w-6 h-6 bg-gray-100 rounded-full items-center justify-center mr-2">
                    <FontAwesome name="user" size={12} color="#6B7280" />
                  </View>
                  <Text className="text-gray-700">{request.EmpName}</Text>
                </View>
                <Text className="text-gray-500 text-sm">{formatDate(request.Request_RaisedDate)}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView> */}

      {/* Request Details Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-white p-8">
          {/* Modal Header */}
          <View className="pt-12 px-6 pb-4 border-b border-gray-100">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-2xl font-bold text-gray-900">Request Details</Text>
              
            </View>
            <View className="flex-row items-center">
              <Text className="text-gray-700 font-medium mr-3">{selectedRequest?.Request_Id}</Text>
              <View 
                className="px-2 py-1 rounded-full" 
                style={{ backgroundColor: selectedRequest ? getStatusDetails(selectedRequest.status).bgColor : '#F3F4F6' }}
              >
                <Text 
                  className="text-xs font-medium" 
                  style={{ color: selectedRequest ? getStatusDetails(selectedRequest.status).color : '#6B7280' }}
                >
                  {selectedRequest ? getStatusDetails(selectedRequest.status).text : 'Unknown'}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Modal Content */}
          <ScrollView showsVerticalScrollIndicator={false} className="p-6  ">
            {selectedRequest && (
              <>
                <View className="mb-6">
                  <View className="flex-row items-center mb-5">
                    <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-3">
                      <FontAwesome name="user" size={16} color="#6B7280" />
                    </View>
                    <View>
                      <Text className="text-gray-500 text-sm mb-1">Employee</Text>
                      <Text className="text-gray-900 font-medium text-lg">{selectedRequest.EmpName}</Text>
                    </View>
                  </View>
                  
                  <View className="mb-6">
                    <Text className="text-gray-500 text-sm mb-2">Items Requested</Text>
                    <View className="bg-gray-50 p-4 rounded-lg">
                      {selectedRequest.ItemList.split(',').map((item, index) => (
                        <View key={index} className="flex-row items-center mb-2 last:mb-0">
                          <View className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                          <Text className="text-gray-800">{item.trim()}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  
                  <View className="mb-6">
                    <Text className="text-gray-500 text-sm mb-2">Reason</Text>
                    <View className="bg-gray-50 p-4 rounded-lg">
                      <Text className="text-gray-800">
                        {selectedRequest.Reason.trim() || "No reason provided"}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="space-y-4 mb-6">
                    <View>
                      <Text className="text-gray-500 text-sm mb-1">Requested Date</Text>
                      <Text className="text-gray-800">{formatDate(selectedRequest.Request_RaisedDate)}</Text>
                    </View>
                    
                    {selectedRequest.Item_IssueDate && Object.keys(selectedRequest.Item_IssueDate).length > 0 && (
                      <View>
                        <Text className="text-gray-500 text-sm mb-1">Issued Date</Text>
                        <Text className="text-gray-800">{formatDate(selectedRequest.Item_IssueDate)}</Text>
                      </View>
                    )}
                    
                    {selectedRequest.Item_TakeBackDate && Object.keys(selectedRequest.Item_TakeBackDate).length > 0 && (
                      <View>
                        <Text className="text-gray-500 text-sm mb-1">Returned Date</Text>
                        <Text className="text-gray-800">{formatDate(selectedRequest.Item_TakeBackDate)}</Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <View className="border-t border-gray-200 pt-6">
                  <Text className="text-gray-900 font-medium mb-4 text-center">Update Status</Text>
                  <View className="flex-row justify-between gap-2 mb-6">
                    <TouchableOpacity 
                      className={`flex-1 items-center py-3 rounded-lg border ${
                        selectedRequest.status === 1 ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <AntDesign name="clockcircleo" size={16} color="#F97316" />
                      <Text 
                        className={`mt-1 text-sm font-medium ${
                          selectedRequest.status === 1 ? 'text-orange-800' : 'text-gray-700'
                        }`}
                      >
                        Pending
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      className={`flex-1 items-center py-3 rounded-lg border ${
                        selectedRequest.status === 2 ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <AntDesign name="checkcircleo" size={16} color="#10B981" />
                      <Text 
                        className={`mt-1 text-sm font-medium ${
                          selectedRequest.status === 2 ? 'text-green-800' : 'text-gray-700'
                        }`}
                      >
                        Active
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      className={`flex-1 items-center py-3 rounded-lg border ${
                        selectedRequest.status === 3 ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <AntDesign name="swap" size={16} color="#7C3AED" />
                      <Text 
                        className={`mt-1 text-sm font-medium ${
                          selectedRequest.status === 3 ? 'text-purple-800' : 'text-gray-700'
                        }`}
                      >
                        Returned
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
          
          {/* Modal Footer */}
          <View className="px-6 pb-8 pt-4 border-t border-gray-100">
            <TouchableOpacity 
              className="bg-gray-900 py-4 rounded-lg items-center"
              onPress={() => setIsModalVisible(false)}
            >
              <Text className="text-black font-medium">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AllRequest;