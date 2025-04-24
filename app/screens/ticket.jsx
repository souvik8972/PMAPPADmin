import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { Image } from 'react-native';
import { useFetchData } from '@/ReactQuery/hooks/useFetchData'
import { AuthContext } from '@/context/AuthContext';
import { usePostData } from '@/ReactQuery/hooks/usePostData';

const IssueTracker = () => {
  const { user } = useContext(AuthContext);
  const token = user?.token || null;
  const [modalVisible, setModalVisible] = useState(false);
  const [issues, setIssues] = useState([]);
  const [type, setType] = useState(null); // Store type as a number (1 to 5)
  const [severity, setSeverity] = useState(null); // Store severity as a number (1 to 3)
  const [description, setDescription] = useState('');
  const [openType, setOpenType] = useState(false);
  const [openSeverity, setOpenSeverity] = useState(false);

  const { data, isLoading, error, refetch, isFetching } = useFetchData("Ticket/GetAllTickets", token);
  const { mutate, isPending } = usePostData('Ticket/RaiseTicket',["Ticket/GetAllTickets"]);


  useEffect(() => {
    console.log(data, "Data from API")
    
    if (data && Array.isArray(data.ticketingIssuesClient)) {
      const formattedIssues = data.ticketingIssuesClient.map(issue => ({
        id: issue.Issue_Id.toString(),
        type: issue.Issue_Type,
        severity: issue.Severity,
        description: issue.Issue_Description.replace(/"/g, ''),
        status: issue.Status,
        date: issue.Issue_Date,
        employeeName: issue.Employee_Name,
        email: issue.EmailId,
        resolvedDate: issue.Resolved_Date,
        comments: issue.Comments
      }));
      setIssues(formattedIssues);
    }
  }, [data]);

  const issueIcons = {
    'Hardware': 'hardware-chip-outline',
    'Software': 'logo-windows',
    'Server Access': 'server-outline',
    'Internet': 'globe',
    'Other': 'help-circle',
  };
  const severityColors = {
    1: "bg-green-200 text-green-800",  
    2: "bg-yellow-200 text-yellow-800", 
    3: "bg-red-200 text-red-800",     
  };

  const statusColors = {
    Open: "bg-blue-200 text-blue-800",
    'In Progress': "bg-orange-200 text-orange-800",
    Resolved: "bg-green-200 text-green-800",
    Closed: "bg-gray-200 text-gray-800",
  };

  const handleSubmit = async () => {
    try {
      const issueData = {
        IssueType: type, // numeric
        Severity: severity, // numeric
        Issue_Description: description,
      };
  
      console.log('Submitting issue with data:', issueData);
  
      mutate({
        data: {}, 
        token: user.token, 
        queryParams: issueData,
      }, {
        onSuccess: () => {
          alert("Ticket Submitted Successfully");
          setModalVisible(false);
          setDescription('');
          setType(null);
          setSeverity(null);
          refetch(); 
        },
        onError: (error) => {
          console.error('Error submitting issue:', error);
          alert("Failed to submit ticket.");
        }
      });
  
    } catch (err) {
      console.error('Error submitting issue:', err);
    }
  };
  

  const isSubmitDisabled = type === null || severity === null || !description;

  if (isLoading || isFetching) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#D01313" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-red-600 text-lg mb-4">Error loading issues</Text>
        <TouchableOpacity 
          onPress={refetch}
          className="bg-red-100 p-3 rounded-lg"
        >
          <Text className="text-red-800">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 p-5 pt-0">
      <Text className="text-lg font-bold text-center mb-2 text-black">Issue Tracker</Text>
      
      <TouchableOpacity className="rounded-lg items-center mb-4" onPress={() => setModalVisible(true)}>
        <LinearGradient
          colors={["#D01313", "#6A0A0A"]}
          style={{
            padding: 12,
            borderRadius: 9999,
            width: 160,
            alignItems: 'center',
          }}
        >
          <Text className="text-white font-bold">Report an Issue</Text>
        </LinearGradient>
      </TouchableOpacity>

      {issues.length === 0 ? (
        <View className="items-center justify-center mt-10">
          <Image 
            source={require('../../assets/images/noIssue.png')}
            style={{ width: 350, height: 350, resizeMode: 'contain' }}
          />
          <Text className="text-xl font-bold text-red-800 text-center mt-2">
            YooHoo! No Issues Present 
          </Text>
        </View>
      ) : (
        <FlatList
          data={issues}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-white rounded-xl p-4 my-2">
              <View className="flex-row items-center justify-between">
                {/* Left Side: Icon and Type Info */}
                <View className="flex-row items-center">
                  <View className="p-3 bg-gray-100 rounded-full">
                    <Ionicons 
                      name={issueIcons[item.type] || 'help-circle'} 
                      size={28} 
                      color="black" 
                    />
                  </View>
          
                  <View className="ml-4">
                    <Text className="text-lg font-bold text-black">{item.type}</Text>
                    <Text className="text-gray-600">ID: {item.id}</Text>
                    <Text className={`px-2 py-1 w-[70px] text-center rounded-full text-xs font-semibold ${severityColors[item.severity] || 'bg-gray-200 text-gray-800'}`}>
                      {item.severity}
                    </Text>
                  </View>
                </View>
        
                {/* Right Side: Status */}
                <View className="self-center">
                  <Text
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[item.status] || "bg-gray-200 text-gray-800"}`}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              {/* Additional Info */}
              <View className="mt-3">
                <Text className="text-gray-700">{item.description}</Text>
                <View className="flex-row justify-between mt-2">
                  <Text className="text-gray-500 text-sm">Reported on: {item.date}</Text>
                  {item.resolvedDate && Object.keys(item.resolvedDate).length > 0 && (
                    <Text className="text-gray-500 text-sm">Resolved: {item.resolvedDate}</Text>
                  )}
                </View>
                {item.comments && Object.keys(item.comments).length > 0 && (
                  <View className="mt-2 p-2 bg-gray-50 rounded">
                    <Text className="text-gray-700 font-semibold">Comments:</Text>
                    <Text className="text-gray-600">{item.comments}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-4/5 bg-white p-5 rounded-lg">
            <Text className="text-xl font-bold text-center text-black mb-3">Report an Issue</Text>
            
            <View className="z-50 mb-4">
              <DropDownPicker
                open={openType}
                value={type}
                items={[
                  { label: 'Hardware', value: 1 },
                  { label: 'Software', value: 2 },
                  { label: 'Server Access', value: 3 },
                  { label: 'Internet', value: 4 },
                  { label: 'Other', value: 5 },
                ]}
                setOpen={setOpenType}
                setValue={setType}
                placeholder="Select issue type"
                placeholderStyle={{ color: 'gray' }}
                style={{ borderColor: 'gray' }}
                textStyle={{ color: 'black' }}
                dropDownContainerStyle={{ 
                  zIndex: 3000, 
                  elevation: 3000,
                  borderColor: 'gray'
                }}
              />
            </View>

            <View className="z-40 mb-4">
              <DropDownPicker
                open={openSeverity}
                value={severity}
                items={[
                  { label: 'Low', value: 1 },
                  { label: 'Medium', value: 2 },
                  { label: 'High', value: 3 },
                ]}
                setOpen={setOpenSeverity}
                setValue={setSeverity}
                placeholder="Select severity"
                placeholderStyle={{ color: 'gray' }}
                style={{ borderColor: 'gray' }}
                textStyle={{ color: 'black' }}
                dropDownContainerStyle={{ 
                  zIndex: 2000, 
                  elevation: 2000,
                  borderColor: 'gray'
                }}
              />
            </View>

            <TextInput
              className="border border-gray-300 p-2 h-24 rounded-lg text-black mt-3"
              placeholder="Describe your issue..."
              placeholderTextColor="gray"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />

            <View className="flex-row justify-center mt-4">
              <TouchableOpacity
                className="p-3 rounded-lg items-center mr-4"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-gray-700 font-bold">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitDisabled}
                style={{ opacity: isSubmitDisabled ? 0.5 : 1 }}
              >
                <LinearGradient
                  colors={["#D01313", "#6A0A0A"]}
                  style={{
                    padding: 12,
                    borderRadius: 9999,
                    width: 120,
                    alignItems: 'center',
                  }}
                >
                  <Text className="text-white font-bold">Submit</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default IssueTracker;
