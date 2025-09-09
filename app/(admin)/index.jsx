import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert, StyleSheet, Modal } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { DatePickerModal } from "react-native-paper-dates";
import { registerTranslation } from 'react-native-paper-dates'
import en from 'react-native-paper-dates/lib/module/translations/en'
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { Link } from "expo-router";
import { format } from "date-fns";
import { useFetchData } from "../../ReactQuery/hooks/useFetchData";
import { AuthContext } from "../../context/AuthContext";
import { deleteTask } from "../../ReactQuery/hooks/deleteTask";
import { API_URL } from '@env';
import {isTokenValid} from '@/utils/functions/checkTokenexp';
import  { Toast } from 'toastify-react-native'
import { fi } from "date-fns/locale";
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

// Memoized Task Item Component
const TaskItem = React.memo(({ 
  item, 
  isSelected, 
  details, 
  loadingDetails, 
  onPress, 
  onDelete,
  ActionType 
}) => {
  
  return (
    <TouchableOpacity 
      onPress={() => onPress(item.Task_Id)} 
      className="bg-white rounded-xl min-h-[60px] flex justify-center items-center p-3 mb-4 relative border shadow-sm border-gray-300"
    >
      {/* Basic Task Info (always visible) */}
      <View className="w-full">
        <View className=" flex-col justify-between items-start gap-2">
          <Text className="text-md w-[95%] bg-re font-semibold text-gray-800" numberOfLines={3}>
            {item.Task_Title}
          </Text>
          <View className="h-[28px] rounded-md  flex-row items-center justify-center " style={{ backgroundColor: isSelected ? '#fff' : '#fff', borderWidth: isSelected ? 1 : 1,
    borderColor: isSelected ? '#ec1c24' : '#0000001a',
    borderStyle: 'solid', }}>
            <Text className="text-sm font-semibold px-2" style={{color: isSelected ? '#ec1c24' : '#000'  }}>#Task ID: {item.Task_Id}</Text>
          </View>
        </View>
      </View>

      {/* Task Details (shown when expanded) */}
      {isSelected && (
        <View className="border-t border-gray-100 pt-4 mt-3 w-full">
          {loadingDetails ? (
            <View className="py-4">
              <ActivityIndicator size="small" color="#940101" />
            </View>
          ) : details ? (
            <>
              <View className="mb-1 space-y-3">
              
                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    {/* <Feather name="users" size={16} color="#EC1C24" /> */}
                    <Text className="text-sm font-medium text-gray-500">Assigned to:</Text>
                  </View>
                  <View className="flex-row flex-wrap gap-2">
                    {details.Employee_Name.split(',').map((employee, index) => (
                      <View 
                        key={`employee-${index}`} 
                        className="flex-row items-center rounded-full px-3 py-1 border border-gray-200"
                        style={{ backgroundColor: '#F3F4F6' }}
                      >
                        <View className="w-5 h-5 rounded-full bg-red-100 mr-2 flex items-center justify-center">
                          <Feather name="user" size={12} color="#940101" />
                        </View>
                        <Text className="text-sm font-semibold text-gray-700">{employee.trim()}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View className="flex-row justify-start mb-4 gap-4 items-center">
                <View className="">
                <View className="flex-row items-center">
                  <Text className="text-sm font-medium text-gray-500">Project ID</Text>
                </View>
                <View className="flex-row flex-wrap gap-2 mt-2">
                <View className="flex-row items-center rounded-full px-3 py-1 border border-gray-200" style={{ backgroundColor: '#F3F4F6'}}> 
                        <View className="w-5 h-5 rounded-full bg-red-100 mr-2 flex items-center justify-center">
                          <Feather name="hash" size={12} color="#940101" />
                        </View>
                        <Text className="text-sm font-semibold text-gray-700">{details.Project_Id}</Text>
                      </View>
                      </View>
                </View>
                <View className="">
                <View className="flex-row items-center">
                  {/* <Feather name="user" size={16} color="#EC1C24" /> */}
                  <Text className="text-sm font-medium text-gray-500">Task Owner:</Text>
                </View>
                <View className="flex-row flex-wrap gap-2 mt-2">
                <View className="flex-row items-center rounded-full px-3 py-1 border border-gray-200" style={{ backgroundColor: '#F3F4F6'}}> 
                        <View className="w-5 h-5 rounded-full bg-red-100 mr-2 flex items-center justify-center">
                          <Feather name="user" size={12} color="#940101" />
                        </View>
                        <Text className="text-sm font-semibold text-gray-700">{details.Task_owner}</Text>
                      </View>
                      </View>
                </View>
                </View>
                
                <View className="flex-row items-center gap-1">
                  <View className="flex-col items-start gap-1">
                    {/* <Feather name="calendar" size={16} color="#64748B" /> */}
                    <Text className="text-sm font-medium text-gray-500">Start</Text>
                    <Text className="text-sm font-semibold" >{details.Start_Date} -</Text>
                  </View>
                  <View className="flex-col items-start gap-1">
                    {/* <Feather name="calendar" size={16} color="#64748B" /> */}
                    <Text className="text-sm font-medium text-gray-500">End</Text>
                    <Text className="text-sm font-semibold" >{details.End_Date}</Text>
                  </View>
                  </View>
               
              </View>

              {/* Actions */}
              <View className="flex-row justify-end space-x-4 gap-2 mt-2">
                <Link href={`/(addTask)/${details.Project_Id}-${details.Task_Id}-${ActionType}-${details.BuyingCenterId}`} asChild>
                  <TouchableOpacity className="flex-row items-center bg-white border border-[#EC1C24] px-4 py-2 rounded-lg shadow-sm">
                    <Feather name="edit-3" size={16} color="#EC1C24" />
                    <Text className="ml-2  text-sm font-medium" style={{color:'#EC1C24'}}>Edit</Text>
                  </TouchableOpacity>
                </Link>
                <TouchableOpacity 
                  className="flex-row items-center px-4 py-2 rounded-lg shadow-sm" style={{ backgroundColor: '#EC1C24' }}
                  onPress={() => onDelete(details.Task_Id)}
                >
                  <Feather name="trash-2" size={16} color="white" />
                  <Text className="ml-2 text-white text-sm font-medium">Delete</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text className="text-gray-500 text-center py-3">Failed to load details</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
});

export default function TaskScreen() {
  const { user,logout,accessTokenGetter } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState({ startDate: new Date(), endDate: null });
  const [basicTaskList, setBasicTaskList] = useState([]);
  const [taskDetails, setTaskDetails] = useState({});
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const ActionType = 0;
  const token = user?.token;

  registerTranslation('en', en);

  const formattedStartDate = selectedRange.startDate ? format(selectedRange.startDate, "MM/dd/yyyy") : "";
  const formattedEndDate = selectedRange.endDate ? format(selectedRange.endDate, "MM/dd/yyyy") : formattedStartDate;

  const basicTaskEndpoint = `Task/GetTskNameByDate?st_dt=${formattedStartDate}&ed_dt=${formattedEndDate}`;
  const taskDetailsEndpoint = (taskId) => `${API_URL}Task/getTaskDetailsByID?taskid=${taskId}`;

  const { data: basicTaskData, isLoading: loadingBasicTasks, refetch: refetchBasicTasks } = useFetchData(basicTaskEndpoint, token);

  // Memoize filtered tasks
  const memoizedFilteredTasks = useMemo(() => {
    if (searchQuery.trim() === "") {
      return basicTaskList;
    }
    return basicTaskList.filter(task =>
      task.Task_Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.Task_Id.toString().includes(searchQuery)
    );
  }, [searchQuery, basicTaskList]);

  useEffect(() => {
    if (basicTaskData?._Tasks) {
      setBasicTaskList(basicTaskData._Tasks || []);
    }
  }, [basicTaskData]);

  useEffect(() => {
    setFilteredTasks(memoizedFilteredTasks);
  }, [memoizedFilteredTasks]);

  const fetchTaskDetails = useCallback(async (taskId) => {
    if (taskDetails[taskId]) return;
    
    

    try {
        // const tokenvalid= await isTokenValid(user,logout)
    //  if(!tokenvalid) {
    //    Toast.error("Session expired. Please log in again.");
    //     return;
    //   }

      setLoadingDetails(true);
       const accessToken = await accessTokenGetter();
      const response = await fetch(taskDetailsEndpoint(taskId), {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data && data.task_data && data.task_data.length > 0) {
        setTaskDetails(prev => ({
          ...prev,
          [taskId]: data.task_data[0]
        }));
      }
    } catch (error) {
      console.error('Error fetching task details:', error);
    } finally {
      setLoadingDetails(false);
    }
  }, [taskDetails, token]);

  const handleDelete = useCallback((taskId) => {
    setTaskToDelete(taskId);
    setDeleteModalVisible(true);
  }, []);

  const confirmDelete = async (id) => {
    if (!id) return;

    
    
    try {
      setIsDeleting(true);
      const accessToken = await accessTokenGetter();
      const result = await deleteTask(id, accessToken);

      if (result.success) {
        setBasicTaskList(prev => prev.filter(task => task.Task_Id !== id));
        setTaskDetails(prev => {
          const newDetails = {...prev};
          delete newDetails[id];
          return newDetails;
        });
        
        setDeleteModalVisible(false);
        setTaskToDelete(null);
        Toast.success(result.message);
      }
    } catch (error) {
      Toast.error(error.message || 'Failed to delete task. Please try again.');
      
      setDeleteModalVisible(false);
      setTaskToDelete(null);
    }finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refetchBasicTasks().finally(() => setIsRefreshing(false));
  }, [refetchBasicTasks]);

  const handleTaskPress = useCallback((taskId) => {
    setSelectedTaskId(prevId => prevId === taskId ? null : taskId);
    if (!taskDetails[taskId]) {
      fetchTaskDetails(taskId);
    }
  }, [taskDetails, fetchTaskDetails]);

  const renderItem = useCallback(({ item }) => (
    <TaskItem
      item={item}
      isSelected={selectedTaskId === item.Task_Id}
      details={taskDetails[item.Task_Id]}
      loadingDetails={loadingDetails}
      onPress={handleTaskPress}
      onDelete={handleDelete}
      ActionType={ActionType}
    />
  ), [selectedTaskId, taskDetails, loadingDetails, handleTaskPress, handleDelete, ActionType]);

  const onDateConfirm = useCallback((params) => {
    setDatePickerOpen(false);
    if (params.startDate) {
      const startDate = params.startDate;
      const endDate = params.endDate || startDate;

      const diffInTime = endDate.getTime() - startDate.getTime();
      const diffInDays = diffInTime / (1000 * 3600 * 24);

      if (diffInDays > 7) {
        Toast.error('You can only select a date range of up to 7 days.');
        return;
      }

      setSelectedRange({ startDate, endDate });
      setBasicTaskList([]); // Clear previous tasks before loading new ones
      refetchBasicTasks();
    }
  }, [refetchBasicTasks]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          placeholder="Search tasks by title or ID"
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
  
      {/* Date Picker Button */}
      <TouchableOpacity onPress={() => setDatePickerOpen(true)} style={styles.datePickerButton}>
        <Text style={styles.datePickerText}>
          {selectedRange.endDate
            ? `${format(selectedRange.startDate, 'MMM dd, yyyy')} - ${format(selectedRange.endDate, 'MMM dd, yyyy')}`
            : format(selectedRange.startDate, 'MMM dd, yyyy')}
        </Text>
        <FontAwesome name="calendar" size={18} color="white" />
      </TouchableOpacity>
  
      {/* Date Picker Modal */}
      <DatePickerModal
        locale="en"
        mode="range"
        visible={datePickerOpen}
        onDismiss={() => setDatePickerOpen(false)}
        startDate={selectedRange.startDate}
        endDate={selectedRange.endDate}
        onConfirm={onDateConfirm}
        presentationStyle="fullScreen"
        allowFontScaling={true}
      />
  
      {/* Task List Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Task List</Text>
        <Text style={styles.taskCount}>{filteredTasks.length} tasks</Text>
      </View>
  
      {/* Loading shimmer when first loading */}
      {loadingBasicTasks && basicTaskList.length === 0 ? (
        <FlatList
          data={[1, 2, 3, 4]}
          renderItem={() => (
            <View style={styles.shimmerCard}>
              <ShimmerPlaceholder
                style={styles.shimmerPlaceholder}
                shimmerColors={['#F3F4F6', '#E5E7EB', '#F3F4F6']}
                autoRun={true}
              />
            </View>
          )}
          keyExtractor={(item) => item.toString()}
        />
      ) : filteredTasks.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 12 }}>No tasks found.</Text>
          <TouchableOpacity
            onPress={handleRefresh}
            style={{
              backgroundColor: '#940101',
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Reload Tasks</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.Task_Id.toString()}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={21}
          removeClippedSubviews={true}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={styles.modalText}>Are you sure you want to delete this task?</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]}
                onPress={() => confirmDelete(taskToDelete)}
              >
                {isDeleting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.deleteButtonText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 16,
    shadowColor: '#000',
    //shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height:45,
  
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#111827',
    fontSize: 14,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#940101',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    //shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  datePickerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  taskCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  listContent: {
    paddingBottom: 16,
  },
  footer: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shimmerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  shimmerPlaceholder: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 24,
    color: '#6B7280',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#940101',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});