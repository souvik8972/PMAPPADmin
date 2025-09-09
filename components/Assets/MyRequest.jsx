import { View, Text, FlatList, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useFetchData } from '@/ReactQuery/hooks/useFetchData';
import { format } from 'date-fns';
import RetryButton from '../Retry';

const MyRequest = () => {
  const { user } = useContext(AuthContext);
  const { data, isLoading, isFetching, refetch, error } = useFetchData(
    `Assests/GetAssestDetailsById?Empid=${user.empId}`,
    user.token
  );
  
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  // Shimmer animation effect
  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      shimmerAnim.setValue(-1);
    }
  }, [isLoading]);

  const formatDate = (dateValue) => {
    try {
      // Handle null/undefined/empty string
      if (!dateValue || typeof dateValue !== 'string') return 'N/A';
      
      // Handle invalid date strings
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return 'N/A';
      
      return format(date, 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  // Safely get asset data
  const getAssetData = () => {
    try {
      // Handle cases where data might be null/undefined
      if (!data) return [];
      
      // Handle cases where assests might be null/undefined or not an array
      if (!Array.isArray(data.assests)) return [];
      
      return data.assests;
    } catch {
      return [];
    }
  };

  const assetData = getAssetData();

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        {[1, 2, 3].map((_, index) => (
          <SkeletonCard key={`skeleton-${index}`} shimmerAnim={shimmerAnim} />
        ))}
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <RetryButton onRetry={refetch} message="Failed to load asset requests. Please try again." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {assetData.length > 0 ? (
        <FlatList
          data={assetData}
          renderItem={({ item }) => <RequestCard item={item} formatDate={formatDate} />}
          keyExtractor={(item) => item?.Id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No asset requests found</Text>
        </View>
      )}
    </View>
  );
};

const SkeletonCard = ({ shimmerAnim }) => {
  return (
    <View style={[styles.cardContainer, styles.skeletonCard]}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={[styles.skeletonLine, { width: 120, height: 20 }]}>
            <Animated.View style={[
              styles.shimmer,
              {
                transform: [{
                  translateX: shimmerAnim.interpolate({
                    inputRange: [-1, 1],
                    outputRange: [-50, 350]
                  })
                }]
              }
            ]} />
          </View>
          <View style={[styles.skeletonLine, { width: 80, height: 24, borderRadius: 12 }]}>
            <Animated.View style={[
              styles.shimmer,
              {
                transform: [{
                  translateX: shimmerAnim.interpolate({
                    inputRange: [-1, 1],
                    outputRange: [-50, 350]
                  })
                }]
              }
            ]} />
          </View>
        </View>
        
        <View style={styles.itemContainer}>
          <View style={[styles.skeletonLine, { width: 60, height: 16, marginBottom: 8 }]}>
            <Animated.View style={[
              styles.shimmer,
              {
                transform: [{
                  translateX: shimmerAnim.interpolate({
                    inputRange: [-1, 1],
                    outputRange: [-50, 350]
                  })
                }]
              }
            ]} />
          </View>
          <View style={[styles.skeletonLine, { width: '100%', height: 20 }]}>
            <Animated.View style={[
              styles.shimmer,
              {
                transform: [{
                  translateX: shimmerAnim.interpolate({
                    inputRange: [-1, 1],
                    outputRange: [-50, 350]
                  })
                }]
              }
            ]} />
          </View>
        </View>
        
        <View style={styles.datesContainer}>
          <View style={styles.dateBox}>
            <View style={[styles.skeletonLine, { width: 60, height: 16, marginBottom: 8 }]}>
              <Animated.View style={[
                styles.shimmer,
                {
                  transform: [{
                    translateX: shimmerAnim.interpolate({
                      inputRange: [-1, 1],
                      outputRange: [-50, 350]
                    })
                  }]
                }
              ]} />
            </View>
            <View style={[styles.skeletonLine, { width: 100, height: 18 }]}>
              <Animated.View style={[
                styles.shimmer,
                {
                  transform: [{
                    translateX: shimmerAnim.interpolate({
                      inputRange: [-1, 1],
                      outputRange: [-50, 350]
                    })
                  }]
                }
              ]} />
            </View>
          </View>
          <View style={styles.dateBox}>
            <View style={[styles.skeletonLine, { width: 70, height: 16, marginBottom: 8 }]}>
              <Animated.View style={[
                styles.shimmer,
                {
                  transform: [{
                    translateX: shimmerAnim.interpolate({
                      inputRange: [-1, 1],
                      outputRange: [-50, 350]
                    })
                  }]
                }
              ]} />
            </View>
            <View style={[styles.skeletonLine, { width: 100, height: 18 }]}>
              <Animated.View style={[
                styles.shimmer,
                {
                  transform: [{
                    translateX: shimmerAnim.interpolate({
                      inputRange: [-1, 1],
                      outputRange: [-50, 350]
                    })
                  }]
                }
              ]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const RequestCard = ({ item, formatDate }) => {
  // Safely get and format all item properties with fallbacks
  const requestId = item?.Request_Id ? String(item.Request_Id) : 'N/A';
  const status = item?.status || 0;
  const statusName = item?.statusName ? String(item.statusName) : 'Unknown';
  
  // Handle ItemList which might be an object or array
  let itemList = 'No items specified';
  if (item?.ItemList) {
    if (typeof item.ItemList === 'string') {
      itemList = item.ItemList;
    } else if (Array.isArray(item.ItemList)) {
      itemList = item.ItemList.join(', ');
    } else if (typeof item.ItemList === 'object') {
      try {
        itemList = JSON.stringify(item.ItemList);
      } catch {
        itemList = 'Invalid items data';
      }
    }
  }

  const requestDate = item?.Request_RaisedDate;
  const returnDate = item?.Item_TakeBackDate;
  
  // Handle reason which might be an object
  let reason = null;
  if (item?.Reason) {
    if (typeof item.Reason === 'string') {
      reason = item.Reason.trim();
    } else if (typeof item.Reason === 'object') {
      try {
        reason = JSON.stringify(item.Reason);
      } catch {
        reason = 'Invalid reason format';
      }
    }
  }

  return (
    <TouchableOpacity activeOpacity={1}>
      <View style={styles.cardContainer}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.requestId}>Request #{requestId}</Text>
            <View style={[
              styles.statusBadge, 
              { 
                backgroundColor: status === 3 ? '#DCFCE7' : '#FEE2E2',
                borderColor: status === 3 ? '#166534' : '#B91C1C'
              }
            ]}>
              <Text style={[
                styles.statusText, 
                { color: status === 3 ? '#166534' : '#B91C1C' }
              ]}>
                {statusName}
              </Text>
            </View>
          </View>
          
          <View style={styles.itemContainer}>
            <Text style={styles.itemLabel}>Items:</Text>
            <Text style={styles.itemText}>{itemList}</Text>
          </View>
          
          <View style={styles.datesContainer}>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Issued</Text>
              <Text style={styles.dateText}>{formatDate(requestDate)}</Text>
            </View>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Returned</Text>
              <Text style={styles.dateText}>{formatDate(returnDate)}</Text>
            </View>
          </View>
          
          {reason && (
            <View style={styles.reasonContainer}>
              <Text style={styles.reasonLabel}>Reason:</Text>
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  cardContainer: {
    marginBottom: 16,
    shadowColor: '#000',
    //shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  skeletonCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardBorder: {
    borderRadius: 16,
  },
  cardContent: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  skeletonLine: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '30%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    transform: [{ skewX: '20deg' }],
  },
  requestId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemContainer: {
    marginBottom: 12,
  },
  itemLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  itemText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateBox: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  reasonContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  reasonLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    color: '#4B5563',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
});

export default MyRequest;