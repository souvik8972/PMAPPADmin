import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList, ActivityIndicator, Pressable, RefreshControl } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import tw from "tailwind-react-native-classnames";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useFetchData } from '../../ReactQuery/hooks/useFetchData';
import { AuthContext } from '../../context/AuthContext';

const Finance = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { user } = useContext(AuthContext);
  const token = user?.token || null;

  // Fetch financial years
  const yearsEndpoint = `FinanceModule/GetFinancialyearData`;
  const { 
    data: financialYears, 
    isLoading: loadingYears,
    refetch: refetchYears
  } = useFetchData(yearsEndpoint, token);

  // Fetch client data - default to -1 to get all clients
  const clientsEndpoint = `FinanceModule/GetClient_Gp_Details_FY?fincYear=${selectedYear?.id || 0}`;
  const { 
    data: clientData, 
    isLoading: loadingClients,
    refetch: refetchClients
  } = useFetchData(clientsEndpoint, token);

  // Set initial year when years data loads
  useEffect(() => {
    if (financialYears && financialYears.length > 0 && !selectedYear) {
      // Create a special "All Years" option with id=-1 and add it to the beginning
      const allYearsOption = { id: 0, year: "All Years" };
      const updatedYears = [allYearsOption, ...financialYears];
      
      // Set the default selected year to "All Years"
      setSelectedYear(updatedYears[0]);
    }
  }, [financialYears]);

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setShowDropdown(false);
    refetchClients();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchYears(), refetchClients()]);
    } catch (error) {
      // console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Helper function to format currency
  const formatCurrency = (value) => {
    if (!value) return '$0.00';
    if (value.includes('$') && value.includes(',')) return value;
    const num = parseFloat(value.replace(/[^0-9.-]+/g,""));
    return isNaN(num) ? '$0.00' : '$' + num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  // Shimmer Loading Component
  const ShimmerItem = () => (
    <View style={tw`mb-4 bg-gray-50 rounded-xl overflow-hidden`}>
      <View style={tw`p-5`}>
        {/* Client Header Shimmer */}
        <View style={tw`flex-row items-center mb-4`}>
          <View style={tw`w-12 h-12 rounded-full bg-gray-200 mr-3`} />
          <View style={tw`flex-1`}>
            <View style={tw`h-5 bg-gray-200 rounded w-3/4 mb-2`} />
            <View style={tw`h-3 bg-gray-200 rounded w-1/2`} />
          </View>
        </View>
        
        {/* Financial Metrics Shimmer */}
        <View style={tw`bg-white rounded-lg p-4`}>
          {[1, 2, 3].map((_, i) => (
            <View key={i} style={tw`flex-row justify-between items-center mb-3`}>
              <View style={tw`h-4 bg-gray-200 rounded w-1/3`} />
              <View style={tw`h-4 bg-gray-200 rounded w-1/4`} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={[tw`flex-1 bg-white`, { paddingHorizontal: 16 }]}>
      {/* Header Section */}
      <View style={tw`flex-row justify-between items-center mb-6`}>
        <View>
          <Text style={tw`text-2xl  text-gray-900 `}>Client </Text>
        </View>
        
        {!loadingYears && (
          <TouchableOpacity 
            onPress={() => setShowDropdown(!showDropdown)}
            style={[
              tw`p-3 rounded-lg flex-row items-center justify-between`,
              { 
                backgroundColor: "#9d0208",
                borderWidth: 1,
                borderColor: "#E5E7EB",
                width: 180,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 1,
              }
            ]}
          >
            <Text style={tw`text-white `}>
              {selectedYear ? selectedYear.year : 'Select Year'}
            </Text>
            <MaterialIcons 
              name={showDropdown ? "arrow-drop-up" : "arrow-drop-down"} 
              size={20} 
              color="white" 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Year Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
          <View style={tw`flex-1 bg-black bg-opacity-30  justify-center items-center`}>
            <TouchableWithoutFeedback>
              <View style={[
                tw`w-4/5 rounded-lg p-2`,
                { 
                  backgroundColor: "white",
                  maxHeight: '60%',
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 20,
                }
              ]}>
                <Text style={tw`p-4  text-gray-700 border-b border-gray-100`}>
                  Select Financial Year
                </Text>
                <FlatList
                  data={financialYears ? [{ id: 0, year: "All Years" }, ...financialYears] : []}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      onPress={() => handleYearSelect(item)}
                      style={[
                        tw`p-4`,
                        { 
                          backgroundColor: selectedYear?.id === item.id ? '#F3F4F6' : 'white',
                          borderBottomWidth: 1,
                          borderBottomColor: '#F3F4F6'
                        }
                      ]}
                    >
                      <Text style={[
                        tw`text-base`,
                        selectedYear?.id === item.id ? 
                          { color: '#6a040f', fontWeight: '600' } : 
                          { color: '#4B5563' }
                      ]}>
                        {item.year}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Loading indicators */}
      {loadingYears && (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={tw`mt-4 text-gray-600`}>Loading financial years...</Text>
        </View>
      )}

      {/* Client List with Pull to Refresh */}
      {!loadingYears && (
        <FlatList
          data={clientData || []}
          keyExtractor={(item) => item.Client_ID.toString()}
          contentContainerStyle={tw`pb-6 p-2`}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3B82F6"
              colors={['#3B82F6']}
            />
          }
          ListEmptyComponent={
            loadingClients ? (
              <View>
                {[1, 2, 3, 4].map((_, index) => (
                  <ShimmerItem key={index} />
                ))}
              </View>
            ) : (
              <View style={tw`flex-1 justify-center items-center mt-10`}>
                <MaterialIcons name="attach-money" size={48} color="#9CA3AF" />
                <Text style={tw`text-lg  text-gray-500 mt-4 mb-1`}>
                  No financial data available
                </Text>
                <Text style={tw`text-sm text-gray-400 text-center`}>
                  {selectedYear?.id === 0 ? 
                    "No clients found across all financial years" : 
                    `No clients found for ${selectedYear?.year || 'selected year'}`
                  }
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <Link href={`/finance/${item.Client_ID}-${selectedYear?.id}-${item.Client_Title}`} asChild>
              <Pressable style={tw`mb-4 bg-gray-50 rounded-xl shadow-sm overflow-hidden`}>
                <View style={tw`p-5`}>
                  {/* Client Header */}
                  <View style={tw`flex-row items-center mb-4`}>
                    <View style={tw`w-12 h-12 rounded-full bg-red-800 justify-center items-center mr-3`}>
                      <Text style={tw`text-lg font-bold text-white`}>
                        {item.Client_Title?.charAt(0) || '?'}
                      </Text>
                    </View>
                    
                    <View style={tw`flex-1`}>
                      <Text 
                        style={tw`text-lg font-bold text-gray-900`}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.Client_Title || 'Unknown Client'}
                      </Text>
                      {/* <Text style={tw`text-xs text-gray-400 mt-1`}>
                        Client ID: {item.Client_ID}
                      </Text> */}
                    </View>
                  </View>
        
                  {/* Financial Metrics - Single Column */}
                  <View style={tw` bg-white rounded-lg p-4`}>
                    {/* PO Value */}
                    <View style={tw`flex-row justify-between items-center`}>
                      <Text style={tw`text-sm  text-gray-500`}>PO Value</Text>
                      <Text style={tw`text-base  text-gray-900`}>
                        {item.PoValue}
                      </Text>
                    </View>
        
                    {/* Predicted GP */}
                    <View style={tw`flex-row justify-between items-center`}>
                      <View>
                        <Text style={tw`text-sm  text-gray-500`}>Predicted GP</Text>
                      </View>
                      <Text style={tw`text-base  text-gray-900`}>
                        {item.Predicted_Gp}
                      </Text>
                    </View>
        
                    {/* Actual GP */}
                    <View style={tw`flex-row justify-between items-center`}>
                      <View>
                        <Text style={tw`text-sm  text-gray-500`}>Actual GP</Text>
                      </View>
                      <Text style={tw`text-base  text-gray-900`}>
                        {item.Actual_Gp}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </Link>
          )}
        />
      )}
    </View>
  );
}

export default Finance;
