import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { Image } from 'react-native';
import { useFetchData } from '@/ReactQuery/hooks/useFetchData'
import { AuthContext } from '@/context/AuthContext';
import { usePostData } from '@/ReactQuery/hooks/usePostData';
import { usePostDataParam } from '@/ReactQuery/hooks/usePostDataParam';
import RetryButton from '@/components/Retry';
import { API_URL } from '@env';
const IssueTracker = () => {
  const { user } = useContext(AuthContext);
  const token = user?.token || null;
  const isAdmin = user?.userType==5;
  
  
  // States for report issue modal
  const [modalVisible, setModalVisible] = useState(false);
  const [issues, setIssues] = useState([]);
  const [type, setType] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [description, setDescription] = useState('');
  const [openType, setOpenType] = useState(false);
  const [openSeverity, setOpenSeverity] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // States for update issue modal
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [updateReason, setUpdateReason] = useState('');
  const [openStatus, setOpenStatus] = useState(false);

  const { data, isLoading, error, refetch, isFetching } = useFetchData("Ticket/GetAllTickets", token);

  const { mutate: submitMutate, isPending: isSubmitPending } = usePostData('Ticket/RaiseTicket', ["Ticket/GetAllTickets"]);
 
  useEffect(() => {
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
       resolvedDate: String(issue.Resolved_Date).split("T")[0],

        comments: issue.Comments
      }));
      setIssues(formattedIssues);
    }
  }, [data]);

  // Pull to refresh handler
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => {
      setRefreshing(false);
    });
  }, []);

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
    'Open': "bg-blue-200 text-blue-800",
    'In Progress': "bg-orange-200 text-orange-800",
    'Resolved': "bg-green-200 text-green-800",
    'Closed': "bg-gray-200 text-gray-800",
  };

  const handleSubmit = async () => {
    try {
      const issueData = {
        IssueType: type,
        Severity: severity,
        Issue_Description: description,
      };

      submitMutate({
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
        console.log(error,`Error submitting ticket`);
          alert("Failed to submit ticket.");
        }
      });
    } catch (err) {
      console.error('Error submitting issue:', err);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      if (!selectedIssue || !updateStatus || !updateReason) return;
  
      // Construct the query parameters
      const queryParams = new URLSearchParams({
        issue_id: selectedIssue.id.toString(),
        status: updateStatus.toString(),
        comments: updateReason,
      });
  
      // Full URL with query params
      const fullUrl = `${API_URL}Ticket/UpdateIssueStatus?${queryParams.toString()}`;
      console.log(fullUrl);
  
      const response = await fetch(fullUrl, {
        method: "POST", // Ensure it's a POST request
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json", // Optional if no body is sent
        },
        body: JSON.stringify({}), // Empty body (if required)
      });
  
      if (!response.ok) {
        throw new Error("Failed to update issue");
      }
  
      // Success case
      alert("Issue updated successfully");
      setUpdateModalVisible(false);
      setUpdateStatus(null);
      setUpdateReason("");
      refetch(); // Assuming this refetches data (e.g., from React Query)
    } catch (err) {
      console.error("Error updating issue:", err);
      alert("Failed to update issue");
    }
  };

  const isSubmitDisabled = type === null || severity === null || !description;
  const isUpdateDisabled = !updateStatus || !updateReason;

  if (isLoading || isFetching) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#D01313" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center bg-white items-center">
        <RetryButton onRetry={refetch} message="Failed to load issues. Please try again." />
      </View>
    );
  }

  return (
    <View className="flex-1 p-5 pt-0 bg-white">
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
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#D01313']} // Android
              tintColor="#D01313" // iOS
            />
          }
          renderItem={({ item }) => (
            <View className="bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-3 mb-4">
              {isAdmin ? (
                <TouchableOpacity onPress={() => {
                  setSelectedIssue(item);
                  setUpdateModalVisible(true);
                }}>
                  <IssueItemContent isAdmin={isAdmin} item={item} />
                </TouchableOpacity>
              ) : (
                <IssueItemContent isAdmin={isAdmin} item={item} />
              )}
            </View>
          )}
        />
      )}


      {/* Report Issue Modal */}
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

      {/* Update Issue Modal (only for admin) */}
      {isAdmin && (
        <Modal visible={updateModalVisible} animationType="fade" transparent>
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="w-4/5 bg-white p-5 rounded-lg">
              <Text className="text-xl font-bold text-center text-black mb-3">
                Update Issue #{selectedIssue?.id}
              </Text>
              
              <View className="mb-4">
                <Text className="text-sm text-gray-700 mb-1">Current Status:</Text>
                <Text className={`px-3 py-1 rounded-full text-xs font-semibold self-start ${statusColors[selectedIssue?.status] || 'bg-gray-200 text-gray-800'}`}>
                  {selectedIssue?.status}
                </Text>
              </View>

              <View className="z-50 mb-4">
                <DropDownPicker
                  open={openStatus}
                  value={updateStatus}
                  items={[
                    { label: 'In Progress', value: '3' },
                    { label: 'Open', value: '1' },
                    { label: 'Closed', value: '2' }
                  ]}
                  setOpen={setOpenStatus}
                  setValue={setUpdateStatus}
                  placeholder="Select new status"
                  placeholderStyle={{ color: 'gray' }}
                  style={{ borderColor: 'gray' }}
                  textStyle={{ color: 'black' }}
                />
              </View>

              <TextInput
                className="border border-gray-300 p-2 h-24 rounded-lg text-black mt-3"
                placeholder="Add reason/comment..."
                placeholderTextColor="gray"
                value={updateReason}
                onChangeText={setUpdateReason}
                multiline
                textAlignVertical="top"
              />

              <View className="flex-row justify-center mt-4">
                <TouchableOpacity
                  className="p-3 rounded-lg items-center mr-4"
                  onPress={() => {
                    setUpdateModalVisible(false);
                    setUpdateStatus(null);
                    setUpdateReason('');
                  }}
                >
                  <Text className="text-gray-700 font-bold">Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleUpdateSubmit}
                  disabled={isUpdateDisabled}
                  style={{ opacity: isUpdateDisabled ? 0.5 : 1 }}
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
                    <Text className="text-white font-bold">Update</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

// Helper component for issue item content
const IssueItemContent = ({ item,isAdmin }) => {




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
    'Open': "bg-blue-200 text-blue-800",
    'In Progress': "bg-orange-200 text-orange-800",
    'Resolved': "bg-green-200 text-green-800",
    'Closed': "bg-gray-200 text-gray-800",
  };

  return (
    <View className="flex-row items-center justify-between">
      <View className="mr-3">
        <View className="p-3 bg-red-100 rounded-full items-center justify-center">
          <Ionicons
            name={issueIcons[item.type] || 'help-circle'}
            size={26}
            color="#D01313"
          />
        </View>
      </View>

      <View className="flex-1 pr-2">
        {isAdmin && <Text className="text-base font-bold text-gray-900 mb-1">{item.employeeName}</Text>}
        <View className="flex-row items-center justify-between mb-1">
        <Text className="text-base font-bold text-gray-900">{item.type}</Text>
        <View className="flex-row items-center gap-2">
        <Text
          className={`self-start px-2 py-1 rounded-lg text-sm font-semibold w-fit ${severityColors[item.severity] || 'bg-gray-200 text-gray-800'}`}
        >
          {item.severity}
        </Text>
        <Text
          className={`px-3 py-1 rounded-lg text-sm font-semibold ${statusColors[item.status] || 'bg-gray-200 text-gray-800'}`}
        >
          {item.status}
        </Text>
        </View>
        </View>
        
        
        <Text className="text-sm font-semibold text-gray-500 mb-1">ID: #{item.id}</Text>
        <Text className="text-sm font-semibold text-gray-700 mb-1">{item.description}</Text>

       

        <Text className="text-sm font-semibold text-gray-500 mb-1">Reported: {item.date}</Text>
        {item.resolvedDate && Object.keys(item.resolvedDate).length > 0 && (
          <Text className="text-sm font-semibold text-gray-500">Resolved: {item.resolvedDate}</Text>
        )}

        {item.comments && Object.keys(item.comments).length > 0 && (
          <View className="mt-2 bg-gray-50 p-2 rounded-md border border-gray-100">
            <Text className="text-sm  font-semibold text-gray-800 mb-1">Admin Comments:</Text>
            <Text className="text-sm  text-gray-600">{item.comments}</Text>
          </View>
        )}
      </View>

      {/* <View className="pl-2 items-center justify-center">
        <Text
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[item.status] || 'bg-gray-200 text-gray-800'}`}
        >
          {item.status}
        </Text>
      </View> */}
    </View>
  );
};

export default IssueTracker;