import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { Image } from 'react-native';
import { useFetchData } from '@/ReactQuery/hooks/useFetchData'
import { AuthContext } from '@/context/AuthContext';
import { usePostData } from '@/ReactQuery/hooks/usePostData';

import RetryButton from '@/components/Retry';
import { API_URL } from '@env';
import {isTokenValid} from '@/utils/functions/checkTokenexp';
import { Toast } from 'toastify-react-native';

const IssueTracker = () => {
  const { user, logout, accessTokenGetter } = useContext(AuthContext);
  const token = user?.token || null;
  const isAdmin = user?.userType == 5;
  
  // States for report issue modal
  const [modalVisible, setModalVisible] = useState(false);
  const [issues, setIssues] = useState([]);
  const [type, setType] = useState(null);
  const [subType, setSubType] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [description, setDescription] = useState('');
  const [openType, setOpenType] = useState(false);
  const [openSubType, setOpenSubType] = useState(false);
  const [openSeverity, setOpenSeverity] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // States for update issue modal
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [updateReason, setUpdateReason] = useState('');
  const [openStatus, setOpenStatus] = useState(false);
  const [expandedIssueId, setExpandedIssueId] = useState(null);

  // States for categories and subcategories
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  const { data, isLoading, error, refetch, isFetching } = useFetchData("Ticket/GetAllTickets", token);
  const { data: categoryData, isLoading: categoryLoading } = useFetchData("Ticket/GetIssuesCategory", token);

  const { mutate: submitMutate, isPending: isSubmitPending } = usePostData('Ticket/RaiseTicket', ["Ticket/GetAllTickets"]);
 
  useEffect(() => {
    if (data && Array.isArray(data.ticketingIssuesClient)) {
      const formattedIssues = data.ticketingIssuesClient.map(issue => ({
        id: issue.Issue_Id.toString(),
        type: issue.Issue_Type,
        subType: issue.Subcategory || 'Not specified',
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

  useEffect(() => {
    if (categoryData && categoryData.ticket_issues_Category) {
      // Format categories for dropdown
      const formattedCategories = categoryData.ticket_issues_Category.map(cat => ({
        label: cat.Issue_Type,
        value: cat.Id,
        original: cat
      }));
      setCategories(formattedCategories);
    }
  }, [categoryData]);

  // Fetch subcategories when type changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!type) return;
      
      setLoadingSubcategories(true);
      try {
        const newToken = await accessTokenGetter();
        
        const response = await fetch(`${API_URL}Ticket/GetSubIssuesCategory?issueId=${type}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${newToken}`,
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch subcategories");
        }
        
        const subcategoryData = await response.json();
        
        if (subcategoryData && subcategoryData.ticket_Subissues_Category) {
          const formattedSubcategories = subcategoryData.ticket_Subissues_Category.map((sub,index) => ({
            label: sub.Subcategory,
            value: `${sub.Id}-${index}`,
            parentId: sub.ParentIssueType,
            original: sub
          }));
          setFilteredSubcategories(formattedSubcategories);
        }
      } catch (err) {
        // console.error("Error fetching subcategories:", err);
        Toast.error("Failed to load subcategories");
      } finally {
        setLoadingSubcategories(false);
      }
    };
    
    fetchSubcategories();
    
    // Reset subType when type changes
    setSubType(null);
  }, [type]);

  // Close other dropdowns when one opens
  useEffect(() => {
    if (openType) {
      setOpenSubType(false);
      setOpenSeverity(false);
    }
  }, [openType]);

  useEffect(() => {
    if (openSubType) {
      setOpenType(false);
      setOpenSeverity(false);
    }
  }, [openSubType]);

  useEffect(() => {
    if (openSeverity) {
      setOpenType(false);
      setOpenSubType(false);
    }
  }, [openSeverity]);

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
    'Hardware Issues': 'hardware-chip-outline',
    'Software Issues': 'logo-windows',
    'Network Issues': 'wifi-outline',
    'Account & Access Management': 'key-outline',
    'Service Requests': 'document-text-outline',
    'Incident Management': 'warning-outline',
    'Change Management': 'swap-horizontal-outline',
    'Security': 'shield-checkmark-outline',
    'General Help & Support': 'help-circle-outline',
  };

  const severityColors = {
   "Low": "bg-green-200 text-green-800",
   "Medium": "bg-yellow-200 text-yellow-800",
   "High": "bg-red-200 text-red-800",
  };

  const statusColors = {
    'Open': "bg-blue-200 text-blue-800",
    'In Progress': "bg-orange-200 text-orange-800",
    'Resolved': "bg-green-200 text-green-800",
    'Closed': "bg-gray-200 text-gray-800",
  };

  const handleSubmit = async () => {
setSubmitting(true);
const token =await accessTokenGetter();


    try {
      const issueData = {
        IssueType: type,
        selectedSubIssue:  parseInt(subType.split("-")[0]) || null, // in api the subtype is 2 time present so i have addaed index after - to make it unique now here i am removing it
        Severity: severity,
        Issue_Description: description,
      };
      console.log(issueData,"IssueData")

      submitMutate({
        data: {}, 
        token:token,
        queryParams: issueData,
      }, {
        onSuccess: () => {
          Toast.success("Ticket Submitted Successfully",{position: "top"});
          setModalVisible(false);
          setDescription('');
          setType(null);
          setSubType(null);
          setSeverity(null);
          refetch(); 
          setSubmitting(false);
        },
        onError: (error) => {
          Toast.error("Failed to submit ticket.",error);
          console.log(error);
          setSubmitting(false);
        }
      });
    } catch (err) {
      console.error('Error submitting issue:', err);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      setSubmitting(true);
const token =await accessTokenGetter();
      // const tokenvalid = await isTokenValid(user, logout);
      // if (!tokenvalid) {
      //   alert("Session expired. Please log in again.");
      //   return;
      // }
    
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
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update issue");
      }

      Toast.success("Issue updated successfully");
      setUpdateModalVisible(false);
      setUpdateStatus(null);
      setUpdateReason("");
      setExpandedIssueId(null);
       setSubmitting(false);
      // setSelectedIssue(null);
      refetch();
    } catch (err) {
      console.error("Error updating issue:", err);
      Toast.error("Failed to update issue");
    }
  };

  const handleCancelModal=()=>{
    setModalVisible(false);
     setDescription('');
          setType(null);
          setSubType(null);
          setSeverity(null);
  }

  const isSubmitDisabled = type === null || severity === null || !description;
  const isUpdateDisabled = !updateStatus || !updateReason;

  if (isLoading || isFetching || categoryLoading) {
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
      {/* <Text className="text-lg font-bold text-center mb-6 up text-black">Ticket Tracker</Text> */}

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
                      {item.subType !== 'Not specified' && (
                        <Text className="text-xs text-gray-400">{item.subType}</Text>
                      )}
                    </View>
                  </View>
                  <View className="flex-col items-end gap-2">
                    <Text
                      className={`px-2 py-1 rounded-lg text-xs font-semibold ${severityColors[item.severity] || 'bg-gray-200 text-gray-800'}`}
                    >
                      {item.severity }
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
            <View className="w-4/5 bg-white p-5 rounded-lg ">
              <ScrollView
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
              >
                <Text className="text-xl font-bold text-center text-black mb-3">
                  Report an Issue
                </Text>
                
                {/* Issue Type */}
                <View className="mb-4" style={{zIndex: openType ? 6000 : 1}}>
                  <View className="mb-4" style={{zIndex: openType ? 6000 : 1}}>
  <DropDownPicker
    open={openType}
    value={type}
    items={categories}
    setOpen={setOpenType}
    setValue={setType}
    placeholder="Select issue type"
    placeholderStyle={{ color: 'gray' }}
    style={{ 
      borderColor: 'gray',
      zIndex: openType ? 6000 : 1,
      backgroundColor: 'white',
    }}
    textStyle={{ 
      color: 'black',
      fontSize: 14,
    }}
    dropDownContainerStyle={{
      borderColor: 'gray',
      backgroundColor: 'white',
      zIndex: 6000,
      elevation: 6000,
      overflow:'scroll',
position:'static',
top:0,
      // backgroundColor: 'red',
      // maxHeight: 1000,
    }}
    itemStyle={{
      justifyContent: 'flex-start',
    }}
    selectedItemContainerStyle={{
      backgroundColor: '#F9E6E6',
    }}
    selectedItemLabelStyle={{
      color: '#D01313',
      fontWeight: 'bold',
    }}
    labelStyle={{
      color: 'black',
      fontSize: 14,
    }}
    // listItemContainerStyle={{
    //   height: 40,
    // }}
    listItemLabelStyle={{
      color: '#333',
      fontSize: 14,
    }}
    listMode="SCROLLVIEW"
    scrollViewProps={{
      nestedScrollEnabled: true,
    }}
    onOpen={() => {
      setOpenSubType(false);
      setOpenSeverity(false);
    }}
  />
</View>
                </View>

                {/* Subcategory */}
                {type &&  <View className="mb-4" style={{zIndex: openSubType ? 5000 : 1}}>
                  {loadingSubcategories ? (
                    <View className="border border-gray-300 p-3 rounded-lg items-center">
                      <ActivityIndicator size="small" color="#D01313" />
                      <Text className="text-gray-500 mt-1">Loading subcategories...</Text>
                    </View>
                  ) : (
                    <DropDownPicker
                      open={openSubType}
                      value={subType}
                      items={filteredSubcategories}
                      setOpen={setOpenSubType}
                      setValue={setSubType}
                      placeholder="Select subcategory"
                      placeholderStyle={{ color: 'gray' }}
                      style={{ 
                        borderColor: 'gray',
                        zIndex: openSubType ? 5000 : 1,
                      }}
                      textStyle={{ color: 'black' }}
                      dropDownContainerStyle={{
      borderColor: 'gray',
      backgroundColor: 'white',
      zIndex: 5000,
      elevation: 5000,
      overflow:'scroll',
position:'static',
top:0,
      // backgroundColor: 'red',
      // maxHeight: 1000,
    }}
                      disabled={!type}
                      listMode="SCROLLVIEW"
                        portal={true}
                      scrollViewProps={{
                        nestedScrollEnabled: true,
                      }}
                      onOpen={() => {
                        setOpenType(false);
                        setOpenSeverity(false);
                      }}
                    />
                  )}
                </View>}
               

                {/* Severity */}
                <View className="mb-4" style={{zIndex: openSeverity ? 4000 : 1}}>
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
                    style={{ 
                      borderColor: 'gray',
                      zIndex: openSeverity ? 4000 : 1,
                    }}
                    textStyle={{ color: 'black' }}
                    dropDownContainerStyle={{
      borderColor: 'gray',
      backgroundColor: 'white',
      zIndex: 6000,
      elevation: 6000,
      overflow:'scroll',
position:'static',
top:0,
      // backgroundColor: 'red',
      // maxHeight: 1000,
    }}
                    listMode="SCROLLVIEW"
                    scrollViewProps={{
                      nestedScrollEnabled: true,
                    }}
                    onOpen={() => {
                      setOpenType(false);
                      setOpenSubType(false);
                    }}
                  />
                </View>

                {/* Description */}
                <TextInput
                  className="border border-gray-300 p-2 h-24 rounded-lg text-black mt-3"
                  placeholder="Describe your issue..."
                  placeholderTextColor="gray"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  textAlignVertical="top"
                />

                {/* Buttons */}
                <View className="flex-row justify-center mt-4">
                  <TouchableOpacity
                    className="p-3 rounded-lg items-center mr-4"
                    onPress={() => handleCancelModal()}
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
                      {submitting ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <Text className="text-white font-bold">Submit</Text>
                      )}
                      {/*<ActivityIndicator color="white" />*/}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </ScrollView>
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
                    dropDownContainerStyle={{
                      zIndex: 5000,
                      elevation: 5000,
                    }}
                    listMode="SCROLLVIEW"
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
                      {submitting ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <Text className="text-white font-bold">Update</Text>
                      )}
                      {/*<ActivityIndicator color="white" />*/}
                      
                      {/* <Text className="text-white font-bold">Update</Text> */}
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