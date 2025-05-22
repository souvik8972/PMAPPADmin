import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Ionicons, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';

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
      "ItemList": "PenDrive,Phone Chargers,IPAD PRO(12.9) 4TH GEN(MHC-003),Ipad Chargers,Ipad Cables,I pad pro 5G 13Inch(MHC-008),Android Tab Chargers"
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
        return { text: 'Request', color: 'bg-blue-500', icon: 'clockcircleo', iconLib: AntDesign };
      case 2: 
        return { text: 'Active', color: 'bg-green-500', icon: 'checkcircleo', iconLib: AntDesign };
      case 3: 
        return { text: 'Returned', color: 'bg-purple-500', icon: 'swap', iconLib: AntDesign };
      default: 
        return { text: 'Unknown', color: 'bg-gray-500', icon: 'questioncircleo', iconLib: AntDesign };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || Object.keys(dateString).length === 0) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      

      {/* Request List */}
      <ScrollView showsVerticalScrollIndicator={false} className="px-4 pt-4">
        {data.map((request) => {
          const status = getStatusDetails(request.status);
          const IconComponent = status.iconLib;
          
          return (
            <TouchableOpacity 
              key={request.Id}
              onPress={() => {
                setSelectedRequest(request);
                setIsModalVisible(true);
              }}
              className="mb-4 bg-white rounded-xl shadow-sm p-5 border border-gray-100"
              activeOpacity={0.9}
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center">
                  <View className={`w-3 h-3 rounded-full ${status.color} mr-2`} />
                  <Text className="text-lg font-semibold text-gray-900">{request.Request_Id}</Text>
                </View>
                <View className={`flex-row items-center px-3 py-1 rounded-full ${status.color} bg-opacity-10`}>
                  <IconComponent 
                    name={status.icon} 
                    size={14} 
                    color={status.color.replace('bg-', '')} 
                  />
                  <Text className={`ml-2 text-xs font-medium ${status.color.replace('bg-', 'text-')}`}>
                    {status.text}
                  </Text>
                </View>
              </View>
              
              <View className="mb-3">
                <Text className="text-gray-500 text-sm font-medium mb-1">Employee</Text>
                <View className="flex-row items-center">
                  <View className="w-6 h-6 bg-indigo-100 rounded-full items-center justify-center mr-2">
                    <FontAwesome name="user" size={12} color="#6366f1" />
                  </View>
                  <Text className="text-gray-800">{request.EmpName}</Text>
                </View>
              </View>
              
              <View className="flex-row justify-between items-end">
                <View className="flex-1">
                  <Text className="text-gray-500 text-sm font-medium mb-1">Items</Text>
                  <Text className="text-gray-800" numberOfLines={1}>
                    <MaterialIcons name="inventory" size={14} color="#4b5563" /> {request.ItemList}
                  </Text>
                </View>
                <View className="flex-1 items-end">
                  <Text className="text-gray-500 text-sm font-medium mb-1">Requested</Text>
                  <Text className="text-gray-800 text-right">
                    <Ionicons name="calendar" size={14} color="#4b5563" /> {formatDate(request.Request_RaisedDate)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Status Update Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-40 p-4">
          <View className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <View className="bg-indigo-600 p-5">
              <View className="flex-row justify-between items-center">
                <Text className="text-white text-xl font-bold">Request Details</Text>
                <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <Text className="text-indigo-100 mt-1">{selectedRequest?.Request_Id}</Text>
            </View>
            
            {/* Modal Content */}
            <ScrollView className="p-5 max-h-96">
              {selectedRequest && (
                <>
                  <View className="mb-6">
                    <View className="flex-row items-center mb-4">
                      <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center mr-3">
                        <FontAwesome name="user" size={16} color="#6366f1" />
                      </View>
                      <View>
                        <Text className="text-gray-500 text-sm">Employee</Text>
                        <Text className="text-gray-900 font-medium">{selectedRequest.EmpName}</Text>
                      </View>
                    </View>
                    
                    <View className="mb-4">
                      <Text className="text-gray-500 text-sm mb-1">Items Requested</Text>
                      <View className="bg-gray-50 p-3 rounded-lg">
                        <Text className="text-gray-800">{selectedRequest.ItemList}</Text>
                      </View>
                    </View>
                    
                    <View className="mb-4">
                      <Text className="text-gray-500 text-sm mb-1">Reason</Text>
                      <View className="bg-gray-50 p-3 rounded-lg">
                        <Text className="text-gray-800">{selectedRequest.Reason.trim()}</Text>
                      </View>
                    </View>
                    
                    <View className="flex-row justify-between mb-2">
                      <View>
                        <Text className="text-gray-500 text-sm">Requested</Text>
                        <Text className="text-gray-800">{formatDate(selectedRequest.Request_RaisedDate)}</Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-gray-500 text-sm">Status</Text>
                        <View className="flex-row items-center">
                          <View className={`w-2 h-2 rounded-full ${getStatusDetails(selectedRequest.status).color} mr-2`} />
                          <Text className="text-gray-800">{getStatusDetails(selectedRequest.status).text}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  
                  <View className="border-t border-gray-200 pt-4">
                    <Text className="text-gray-800 font-medium mb-3">Update Request Status</Text>
                    <View className="flex-row justify-between space-x-2">
                      <TouchableOpacity 
                        className="bg-blue-50 px-4 py-3 rounded-lg flex-1 items-center"
                        onPress={() => {
                          // Update to Request status (1)
                          setIsModalVisible(false);
                        }}
                      >
                        <View className="flex-row items-center">
                          <AntDesign name="clockcircleo" size={16} color="#3b82f6" />
                          <Text className="text-blue-800 ml-2 font-medium">Request</Text>
                        </View>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        className="bg-green-50 px-4 py-3 rounded-lg flex-1 items-center"
                        onPress={() => {
                          // Update to Active status (2)
                          setIsModalVisible(false);
                        }}
                      >
                        <View className="flex-row items-center">
                          <AntDesign name="checkcircleo" size={16} color="#10b981" />
                          <Text className="text-green-800 ml-2 font-medium">Active</Text>
                        </View>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        className="bg-purple-50 px-4 py-3 rounded-lg flex-1 items-center"
                        onPress={() => {
                          // Update to Returned status (3)
                          setIsModalVisible(false);
                        }}
                      >
                        <View className="flex-row items-center">
                          <AntDesign name="swap" size={16} color="#8b5cf6" />
                          <Text className="text-purple-800 ml-2 font-medium">Returned</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
            
            {/* Modal Footer */}
            <View className="border-t border-gray-200 p-4">
              <TouchableOpacity 
                className="bg-gray-100 py-3 rounded-lg items-center"
                onPress={() => setIsModalVisible(false)}
              >
                <Text className="text-gray-800 font-medium">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AllRequest;