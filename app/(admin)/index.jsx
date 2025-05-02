import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { DatePickerModal } from "react-native-paper-dates";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { Link } from "expo-router";
import { format } from "date-fns";
import { useFetchData } from "../../ReactQuery/hooks/useFetchData";
import { AuthContext } from "../../context/AuthContext";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export default function TaskScreen() {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState({ startDate: new Date(), endDate: null });
  const [taskData, setTaskData] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
const ActionType=0
  const token = user?.token;

  const formattedStartDate = selectedRange.startDate ? format(selectedRange.startDate, "MM/dd/yyyy") : "";
  const formattedEndDate = selectedRange.endDate ? format(selectedRange.endDate, "MM/dd/yyyy") : formattedStartDate;

  const endpoint = `Task/GetTasks?st_dt=${formattedStartDate}&ed_dt=${formattedEndDate}&page=${page}&limit=20&serach=${searchQuery}`;

  const { data, isLoading: loading, refetch } = useFetchData(endpoint, token);

  useEffect(() => {
    if (data?._Tasks) {
      const newTasks = data._Tasks || [];
      if (page === 1) {
        setTaskData(newTasks);
      } else {
        setTaskData(prev => [...prev, ...newTasks]);
      }
      setHasMore(newTasks.length === 20);
    }
  }, [data]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTasks(taskData);
    } else {
      const filtered = taskData.filter(task =>
        task.Task_Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.Employee_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.Task_Id.toString().includes(searchQuery)
      );
      setFilteredTasks(filtered);
    }
  }, [searchQuery, taskData]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setPage(1);
    setHasMore(true);
    refetch().finally(() => setIsRefreshing(false));
  }, []);

  const renderFooter = useCallback(() => {
    if (!loading || page === 1) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#D01313" />
      </View>
    );
  }, [loading, page]);

  const renderItem = useCallback(({ item }) => (
    <View className="bg-white rounded-xl p-4 mb-4  relative">
      
      {/* Status badge */}
      {item.status && (
        <View
          className="absolute top-2 right-2 px-2 py-1 rounded-full"
          style={{ backgroundColor: getStatusColor(item.status) }}
        >
          <Text className="text-white text-xs font-semibold">
            {item.status.toUpperCase()}
          </Text>
        </View>
      )}
  
      {/* Header */}
      <View className="mb-2 flex-row  justify-between">
        <Text className="text-lg w-[80%] font-semibold text-gray-800">
          {item.Task_Title}
        </Text>
      <View className="w-[15%] shadow-md h-[25px] bg-gray-100 rounded-lg px-2 py-1 flex-row items-center justify-center">
      <Text className="text-sm shadow-md   text-gray-500">{item.Project_Id}</Text>
      </View>
      </View>
  
      {/* Body */}
      <View className="mb-3">
        <View className="flex-row justify-between mb-2">
          <View className="flex-row items-center space-x-1">
            <Feather name="user" size={14} color="#64748B" />
            <Text className="text-sm text-gray-600">{item.Employee_Name}</Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <Feather name="hash" size={14} color="#64748B" />
            <Text className="text-sm text-gray-600">{item.Task_Id}</Text>
          </View>
        </View>
  
        <View className="flex-row justify-between">
          <View className="flex-row items-center space-x-1">
            <Feather name="calendar" size={14} color="#64748B" />
            <Text className="text-sm text-gray-500"> Start: </Text>
            <Text className="text-sm text-gray-700">{item.Start_Date}</Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <Feather name="calendar" size={14} color="#64748B" />
            <Text className="text-sm text-gray-500"> End:</Text>
            <Text className="text-sm text-gray-700">{item.End_Date}</Text>
          </View>
        </View>
      </View>
  
      {/* Actions */}
      <View className="flex-row justify-end space-x-3 gap-3 mt-2">
        <Link href={`/(addTask)/${item.Project_Id}-${item.Task_Id}-${ActionType}-${item.BuyingCenterId}`} asChild>
          <TouchableOpacity className="flex-row items-center bg-white shadow-md  px-3 py-1.5 rounded-lg">
            <Feather name="edit-3" size={16} color="red" />
            <Text className="ml-1 text-red-500 text-sm font-medium">Edit</Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity className="flex-row items-center shadow-md bg-red-500 px-3 py-1.5 rounded-lg">
          <Feather name="trash-2" size={16} color="white" />
          <Text className="ml-1 text-white text-sm font-medium">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), []);
  

  

  const getDisabledDates = (startDate) => {
    const disabledDates = [];
    for (let i = 1; i <= 30; i++) {
      const disabledDate = new Date(startDate);
      disabledDate.setDate(startDate.getDate() + i);
      if (disabledDate > new Date(startDate).setDate(startDate.getDate() + 7)) {
        disabledDates.push(disabledDate);
      }
    }
    return disabledDates;
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#F59E0B';
      case 'completed': return '#10B981';
      case 'in progress': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const onDateConfirm = (params) => {
    setDatePickerOpen(false);
    if (params.startDate) {
      const startDate = params.startDate;
      const endDate = params.endDate || startDate;

      const diffInTime = endDate.getTime() - startDate.getTime();
      const diffInDays = diffInTime / (1000 * 3600 * 24);

      if (diffInDays > 7) {
        Alert.alert('Error', 'You can only select a date range of up to 7 days.');
        return;
      }

      setSelectedRange({ startDate, endDate });
      setPage(1);
      setTaskData([]);
      setFilteredTasks([]);
      setHasMore(true);
      refetch();
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          placeholder="Search tasks by title, employee or ID"
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
        locale="en-GB"
        mode="range"
        visible={datePickerOpen}
        onDismiss={() => setDatePickerOpen(false)}
        startDate={selectedRange.startDate}
        endDate={selectedRange.endDate}
        onConfirm={onDateConfirm}
        dateDisabled={getDisabledDates(selectedRange.startDate)}
      />
  
      {/* Task List Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Task List</Text>
        <Text style={styles.taskCount}>{filteredTasks.length} tasks</Text>
      </View>
  
      {/* Loading shimmer when first loading */}
      {loading && page === 1 ? (
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
        // No task fallback
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 12 }}>No tasks found.</Text>
          <TouchableOpacity
            onPress={handleRefresh}
            style={{
              backgroundColor: '#D01313',
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
          keyExtractor={(item) =>
            `${item.Task_Id}_${item.Employee_Id || Math.random().toString(36).substring(2, 9)}`
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={21}
        />
      )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#111827',
    fontSize: 16,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D01313',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradientButton: {
    padding: 8,
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  cardContent: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  metaContainer: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },

});