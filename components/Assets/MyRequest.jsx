import { View, Text, FlatList, ActivityIndicator, StyleSheet, ImageBackground, TouchableOpacity, Animated } from 'react-native';
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
  
  // Handle data properly - assuming data comes as direct array
 


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
      if (!dateValue || typeof dateValue !== 'string') return 'N/A';
      return format(new Date(dateValue), 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

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
  if(error) {
    return (
      <View style={styles.errorContainer}>
        <RetryButton onRetry={refetch} message="Failed to load asset requests. Please try again." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data?.assests.length > 0 ? (
        <FlatList
          data={data?.assests}
          renderItem={({ item }) => <RequestCard item={item} formatDate={formatDate} />}
          keyExtractor={(item) => item.Id.toString()}
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

// Separate component for skeleton loading
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
  return (
    <TouchableOpacity activeOpacity={1}>
      <ImageBackground 
        source={require('@/assets/images/border.png')}
        resizeMode="stretch"
        style={styles.cardContainer}
        imageStyle={styles.cardBorder}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.requestId}>Request #{item.Request_Id}</Text>
            <View style={[
              styles.statusBadge, 
              { 
                backgroundColor: item.status === 3 ? '#DCFCE7' : '#FEE2E2',
                borderColor: item.status === 3 ? '#166534' : '#B91C1C'
              }
            ]}>
              <Text style={[
                styles.statusText, 
                { color: item.status === 3 ? '#166534' : '#B91C1C' }
              ]}>
                {item?.statusName}
              </Text>
            </View>
          </View>
          
          <View style={styles.itemContainer}>
            <Text style={styles.itemLabel}>Items:</Text>
            <Text style={styles.itemText}>{item.ItemList}</Text>
          </View>
          
          <View style={styles.datesContainer}>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Issued</Text>
              <Text style={styles.dateText}>{formatDate(item?.Request_RaisedDate)}</Text>
            </View>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Returned</Text>
              <Text style={styles.dateText}>{formatDate(item?.Item_TakeBackDate)}</Text>
            </View>
          </View>
          
          {item.Reason && (
            <View style={styles.reasonContainer}>
              <Text style={styles.reasonLabel}>Reason:</Text>
              <Text style={styles.reasonText}>{item?.Reason.trim()}</Text>
            </View>
          )}
        </View>
      </ImageBackground>
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
    shadowOffset: { width: 0, height: 4 },
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