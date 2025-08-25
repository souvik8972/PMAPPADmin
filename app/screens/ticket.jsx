import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, KeyboardAvoidingView, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { Image } from 'react-native';
import { useFetchData } from '@/ReactQuery/hooks/useFetchData'
import { AuthContext } from '@/context/AuthContext';
import { usePostData } from '@/ReactQuery/hooks/usePostData';
import { usePostDataParam } from '@/ReactQuery/hooks/usePostDataParam';
import RetryButton from '@/components/Retry';
import { API_URL } from '@env';
import {isTokenValid} from '@/utils/functions/checkTokenexp';

const IssueTracker = () => {
  const { user, logout } = useContext(AuthContext);
  const token = user?.token || null;
  const isAdmin = user?.userType == 5;
  
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
  const [expandedIssueId, setExpandedIssueId] = useState(null);

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
        resolvedDate: typeof issue.Resolved_Date === 'string' && issue.Resolved_Date.includes('T')
          ? issue.Resolved_Date.split('T')[0]
          : 'Pending',
        comments: typeof issue?.Comments==="string" ? issue?.Comments:"Not present"
      }));
      setIssues(formattedIssues);
    }
  }, [data]);

  const toggleExpand = (issueId) => {
    setExpandedIssueId(expandedIssueId === issueId ? null : issueId);
  };

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
          alert("Failed to submit ticket.");
        }
      });
    } catch (err) {
      console.error('Error submitting issue:', err);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const tokenvalid = await isTokenValid(user, logout);
      if (!tokenvalid) {
        alert("Session expired. Please log in again.");
        return;
      }
    
      if (!selectedIssue || !updateStatus || !updateReason) return;
  
      const queryParams = new URLSearchParams({
        issue_id: selectedIssue.id.toString(),
        status: updateStatus.toString(),
        comments: updateReason,
      });
  
      const fullUrl = `${API_URL}Ticket/UpdateIssueStatus?${queryParams.toString()}`;
  
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update issue");
      }
  
      alert("Issue updated successfully");
      setUpdateModalVisible(false);
      setUpdateStatus(null);
      setUpdateReason("");
      setExpandedIssueId(null);
      refetch();
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
      <Text className="text-lg font-bold text-center mb-6 up text-black">Ticket Tracker</Text>

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
          <Text className="text-white font-bold">Create a Ticket</Text>
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
              colors={['#D01313']}
              tintColor="#D01313"
            />
          }
          renderItem={({ item }) => (
            <View className="bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-3 mb-4">
              <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                <View className="flex-row items-center  justify-between">
                  <View className="flex-row items-center">
                    <View className="mr-3">
                      <View className="p-3 bg-red-100 rounded-full items-center justify-center">
                        <Ionicons
                          name={issueIcons[item.type] || 'help-circle'}
                          size={26}
                          color="#D01313"
                        />
                      </View>
                    </View>
                    <View style={{width: '50%'}} className=''>
                       {isAdmin? 
                      <Text className="text-sm font-semibold text-gray-700">{item.employeeName}</Text>:<Text className="text-sm font-semibold text-gray-700">#{item.id}</Text>}
                     
                      <Text className="text-sm  text-gray-500">{item.type}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text
                      className={`px-2 py-1 rounded-lg text-xs font-semibold ${severityColors[item.severity] || 'bg-gray-200 text-gray-800'}`}
                    >
                      {item.severity === 1 ? 'Low' : item.severity === 2 ? 'Medium' : 'High'}
                    </Text>
                    <Text
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusColors[item.status] || 'bg-gray-200 text-gray-800'}`}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {expandedIssueId === item.id && (
                <View className="mt-3 pt-3 border-t border-gray-100">
                  <View className="mb-2">
                    <Text className="text-sm font-semibold text-gray-700">Description:</Text>
                    <Text className="text-sm text-gray-600">{item.description.trim()}</Text>
                  </View>
                  
                  {isAdmin && (
                    <View className="mb-2 w-fit flex-row justify-between items-center">
                      <View className="flex-row items-center bg-gray-100  pr-6 rounded-3xl w-fit">
                        <View className='  flex justify-center items-center p-2 rounded-full'><Feather name="user" size={14} color="#940101" className="mr-1" /></View>
                        <Text className="text-sm font-semibold text-gray-700">{item.employeeName}</Text>
                      </View>
                       <View className="flex-row items-center bg-gray-100 p-4 pt-2 pb-2 rounded-3xl w-fit">
                        
                        <Text className="text-sm font-semibold text-gray-700">#{item.id}</Text>
                      </View>
                    </View>
                  )}
                  
                  <View className="mb-2">
                    <Text className="text-sm font-semibold text-gray-700">Reported on: {item.date}</Text>
                  </View>
                  
                  {item.resolvedDate !== 'Pending' && (
                    <View className="mb-2">
                      <Text className="text-sm font-semibold text-gray-700">Resolved on: {item.resolvedDate}</Text>
                    </View>
                  )}
                  
                  {!item.comments=="Not present" && (
                    <View className="mt-2 bg-gray-50 p-2 rounded-md border border-gray-100">
                      <Text className="text-sm font-semibold text-gray-800 mb-1">Admin Comments:</Text>
                      <Text className="text-sm text-gray-600">{item.comments}</Text>
                    </View>
                  )}
                  
                  {isAdmin && (
                    <TouchableOpacity 
                      className="mt-3 self-center"
                      onPress={() => {
                        setSelectedIssue(item);
                        setUpdateModalVisible(true);
                      }}
                    >
                      <LinearGradient
                        colors={["#D01313", "#6A0A0A"]}
                        style={{
                          padding: 8,
                          borderRadius: 9999,
                          width: 100,
                          alignItems: 'center',
                        }}
                      >
                        <Text className="text-white font-bold text-sm">Update</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          )}
        />
      )}

      {/* Report Issue Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
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
        </KeyboardAvoidingView>
      </Modal>

      {/* Update Issue Modal (only for admin) */}
      {isAdmin && (
        <Modal visible={updateModalVisible} animationType="fade" transparent>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
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
          </KeyboardAvoidingView>
        </Modal>
      )}
    </View>
  );
};

export default IssueTracker;