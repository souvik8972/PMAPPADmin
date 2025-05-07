import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import tw from "tailwind-react-native-classnames";
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useFetchData } from '../../ReactQuery/hooks/useFetchData';
import { AuthContext } from '../../context/AuthContext';

const Finance = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const { user } = useContext(AuthContext);
  const token = user?.token || null;

  // Fetch financial years
  const yearsEndpoint = `FinanceModule/GetFinancialyearData`;
  const { 
    data: financialYears, 
    isLoading: loadingYears 
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

  // Helper function to format currency
  const formatCurrency = (value) => {
    if (!value) return '$0.00';
    if (value.includes('$') && value.includes(',')) return value;
    const num = parseFloat(value.replace(/[^0-9.-]+/g,""));
    return isNaN(num) ? '$0.00' : '$' + num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  return (
    <View style={{ flexGrow: 1 }} className="ml-2 mr-2">
      {/* Financial Year Dropdown */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold">Clients</Text>
        
        {!loadingYears && (
          <TouchableOpacity 
            onPress={() => setShowDropdown(!showDropdown)}
            style={[tw`p-2 rounded-lg`, { backgroundColor: "#EBEBEB" }]}
          >
            <View className="flex-row items-center">
              <Text className="mr-2 font-semibold">
                {selectedYear ? selectedYear.year : 'Select Year'}
              </Text>
              <MaterialIcons 
                name={showDropdown ? "arrow-drop-up" : "arrow-drop-down"} 
                size={24} 
                color="black" 
              />
            </View>
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
          <View style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center`}>
            <TouchableWithoutFeedback>
              <View style={[tw`w-4/5 p-4 rounded-lg`, { backgroundColor: "white" }]}>
                <FlatList
                  data={financialYears ? [{ id: 0, year: "All Years" }, ...financialYears] : []}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      onPress={() => handleYearSelect(item)}
                      style={tw`p-3 border-b border-gray-200`}
                    >
                      <Text className={`text-lg ${selectedYear?.id === item.id ? 'font-bold text-blue-500' : ''}`}>
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
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {!loadingYears && loadingClients && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-2">Loading client data...</Text>
        </View>
      )}

      {/* Client List */}
      {!loadingYears && !loadingClients && clientData?.length > 0 ? (
        <FlatList
          data={clientData}
          keyExtractor={(item) => item.Client_ID.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                tw`p-3 rounded-lg shadow-lg my-4 w-full`,
                { backgroundColor: "#EBEBEB" },
              ]}
            >
              <TouchableOpacity className="flex-row">
                <Link href={`/finance/${item.Client_ID}-${selectedYear?.id}`} >

                  <View className="flex-row items-start w-full">
                    {/* Placeholder for Company Logo */}
                    <View className="w-10 h-10 rounded-full bg-gray-300 justify-center items-center">
                      <Text className="font-bold">
                        {item.Client_Title?.charAt(0) || '?'}
                      </Text>
                    </View>

                    {/* Company Details */}
                    <View className="ml-3 flex-1">
                      <Text className="text-lg mb-2 font-semibold">
                        {item.Client_Title || 'Unknown Client'}
                      </Text>

                      {/* Values Section */}
                      <View className="flex-row justify-between items-center">
                        {/* PO Value */}
                        <View className="justify-center items-center">
                          <Text className="text-[#00D09E] text-2xl font-bold">
                            |
                          </Text>
                        </View>
                        <View className="items-start">
                          <Text className="text-gray-600">PO value</Text>
                          <Text className="font-semibold text-left">
                           { (item.PoValue)}
                          </Text>
                        </View>

                        {/* Divider Bar */}
                        <View className="justify-center items-center">
                          <Text className="text-[#00D09E] text-2xl font-bold">
                            |
                          </Text>
                        </View>

                        {/* Predicted GP */}
                        <View className="items-start">
                          <Text className="text-gray-600">Predicted GP</Text>
                          <Text className="font-semibold text-left">
                             {(item.Predicted_Gp)}
                          </Text>
                          <Text className="text-xs text-gray-500">
                            ({item.Predicted_percentage}%)
                          </Text>
                        </View>

                        {/* Divider Bar */}
                        <View className="justify-center items-center">
                          <Text className="text-[#00D09E] text-2xl font-bold">
                            |
                          </Text>
                        </View>

                        {/* Actual GP */}
                        <View className="items-start">
                          <Text className="text-gray-600">Actual GP</Text>
                          <Text className="font-semibold text-left">
                             {(item.Actual_Gp)}
                          </Text>
                          <Text className="text-xs text-gray-500">
                            ({item.Actual_percentage}%)
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Link>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : !loadingYears && !loadingClients && (!clientData || clientData.length === 0) ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">No client data available</Text>
        </View>
      ) : null}
    </View>
  );
}

export default Finance;