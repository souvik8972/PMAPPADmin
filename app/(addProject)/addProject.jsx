import React, { useState } from 'react';
import { ScrollView, TextInput, View, Text, Pressable, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const FormScreen = () => {
  // Form state
  const [formData, setFormData] = useState({
    projectName: '',
    region: '',
    client: null,
    status: null,
    projectCode: '',
    startDate: '',
    endDate: '',
    projectOwner: '',
    includeBuyingCenter: false,
    buyingCenter: '',
    financialYear: null,
    poValue: '',
    predictedCost: '',
    outsourcingCost: ''
  });

  // DropDown state management with zIndex control
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownZIndex, setDropdownZIndex] = useState(1000);

  const [clientItems, setClientItems] = useState([
    { label: 'Client A', value: 'client_a' },
    { label: 'Client B', value: 'client_b' },
  ]);

  const [statusItems, setStatusItems] = useState([
    { label: 'Planned', value: 'planned' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Completed', value: 'completed' },
  ]);

  const [yearItems, setYearItems] = useState([
    { label: 'FY-2020-21', value: '2020-21' },
    { label: 'FY-2021-22', value: '2021-22' },
  ]);

  const handleDropdownOpen = (dropdownName) => {
    setOpenDropdown(dropdownName);
    // Increase zIndex when opening to bring to front
    setDropdownZIndex(10000);
  };

  const handleDropdownClose = () => {
    setOpenDropdown(null);
    // Reset zIndex when closing
    setDropdownZIndex(1000);
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const toggleBuyingCenter = () => {
    const newValue = !formData.includeBuyingCenter;
    setFormData({
      ...formData,
      includeBuyingCenter: newValue,
      ...(newValue === false ? {
        buyingCenter: '',
        financialYear: null,
        poValue: '',
        predictedCost: '',
        outsourcingCost: ''
      } : {})
    });
  };

  const handleSubmit = () => {
    // console.log('Form submitted:', formData);
    alert('Project created successfully!');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1"
    >
      <ScrollView 
        className="flex-1 p-6 bg-gray-50"
        contentContainerStyle={{ paddingBottom: 100 }} // Add extra space at bottom
      >
        <Text className="text-2xl font-bold text-gray-800 mb-6">Create New Project</Text>

        {/* Project Information Section */}
        <View className="bg-white p-5 rounded-lg shadow-sm mb-6">
          <Text className="text-lg font-semibold text-gray-700 mb-4">Project Information</Text>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Project Name*</Text>
            <TextInput 
              className="border border-gray-200 p-3 rounded-lg bg-gray-50" 
              placeholder="Enter Project Name"
              value={formData.projectName}
              onChangeText={(text) => handleInputChange('projectName', text)}
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Region*</Text>
            <TextInput 
              className="border border-gray-200 p-3 rounded-lg bg-gray-50" 
              placeholder="Enter Region"
              value={formData.region}
              onChangeText={(text) => handleInputChange('region', text)}
            />
          </View>

          {/* Client Dropdown - Highest zIndex when open */}
          <View className="mb-4" style={{ zIndex: openDropdown === 'client' ? dropdownZIndex : 1000 }}>
            <Text className="text-sm text-gray-600 mb-1">Client*</Text>
            <DropDownPicker
              open={openDropdown === 'client'}
              value={formData.client}
              items={clientItems}
              setOpen={(isOpen) => isOpen ? handleDropdownOpen('client') : handleDropdownClose()}
              onSelectItem={(item) => handleInputChange('client', item.value)}
              setItems={setClientItems}
              placeholder="Select client"
              style={{ 
                borderColor: '#e5e7eb',
                backgroundColor: '#f9fafb',
                minHeight: 48,
              }}
              dropDownContainerStyle={{
                borderColor: '#e5e7eb',
                backgroundColor: '#f9fafb',
              }}
              textStyle={{
                fontSize: 14,
              }}
              placeholderStyle={{
                color: '#9ca3af',
              }}
              listMode="SCROLLVIEW"
            />
          </View>

          {/* Status Dropdown */}
          <View className="mb-4" style={{ zIndex: openDropdown === 'status' ? dropdownZIndex : 900 }}>
            <Text className="text-sm text-gray-600 mb-1">Project Status*</Text>
            <DropDownPicker
              open={openDropdown === 'status'}
              value={formData.status}
              items={statusItems}
              setOpen={(isOpen) => isOpen ? handleDropdownOpen('status') : handleDropdownClose()}
              onSelectItem={(item) => handleInputChange('status', item.value)}
              setItems={setStatusItems}
              placeholder="Select status"
              style={{ 
                borderColor: '#e5e7eb',
                backgroundColor: '#f9fafb',
                minHeight: 48,
              }}
              dropDownContainerStyle={{
                borderColor: '#e5e7eb',
                backgroundColor: '#f9fafb',
              }}
              textStyle={{
                fontSize: 14,
              }}
              placeholderStyle={{
                color: '#9ca3af',
              }}
              listMode="SCROLLVIEW"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Project Code</Text>
            <TextInput 
              className="border border-gray-200 p-3 rounded-lg bg-gray-50" 
              placeholder="Enter Project Code"
              value={formData.projectCode}
              onChangeText={(text) => handleInputChange('projectCode', text)}
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Start Date</Text>
            <TextInput 
              className="border border-gray-200 p-3 rounded-lg bg-gray-50" 
              placeholder="MM/DD/YYYY"
              value={formData.startDate}
              onChangeText={(text) => handleInputChange('startDate', text)}
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">End Date</Text>
            <TextInput 
              className="border border-gray-200 p-3 rounded-lg bg-gray-50" 
              placeholder="MM/DD/YYYY"
              value={formData.endDate}
              onChangeText={(text) => handleInputChange('endDate', text)}
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Project Owner</Text>
            <TextInput 
              className="border border-gray-200 p-3 rounded-lg bg-gray-50" 
              placeholder="Enter Owner Name"
              value={formData.projectOwner}
              onChangeText={(text) => handleInputChange('projectOwner', text)}
            />
          </View>
        </View>

        {/* Budget Section */}
        <View className="bg-white p-5 rounded-lg shadow-sm mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-700">Budget Details</Text>
            <View className="flex-row items-center">
              <Switch 
                value={formData.includeBuyingCenter} 
                onValueChange={toggleBuyingCenter}
                trackColor={{ false: '#e5e7eb', true: '#dc2626' }}
                thumbColor="#fff"
              />
              <Text className="ml-2 text-sm text-gray-600">Include Buying Center</Text>
            </View>
          </View>

          {formData.includeBuyingCenter && (
            <>
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-1">Buying Center</Text>
                <TextInput 
                  className="border border-gray-200 p-3 rounded-lg bg-gray-50" 
                  placeholder="Berlin Chemie"
                  value={formData.buyingCenter}
                  onChangeText={(text) => handleInputChange('buyingCenter', text)}
                />
              </View>

              {/* Year Dropdown */}
              <View className="mb-4" style={{ zIndex: openDropdown === 'year' ? dropdownZIndex : 800 }}>
                <Text className="text-sm text-gray-600 mb-1">Financial Year</Text>
                <DropDownPicker
                  open={openDropdown === 'year'}
                  value={formData.financialYear}
                  items={yearItems}
                  setOpen={(isOpen) => isOpen ? handleDropdownOpen('year') : handleDropdownClose()}
                  onSelectItem={(item) => handleInputChange('financialYear', item.value)}
                  setItems={setYearItems}
                  placeholder="Select Year"
                  style={{ 
                    borderColor: '#e5e7eb',
                    backgroundColor: '#f9fafb',
                    minHeight: 48,
                  }}
                  dropDownContainerStyle={{
                    borderColor: '#e5e7eb',
                    backgroundColor: '#f9fafb',
                  }}
                  textStyle={{
                    fontSize: 14,
                  }}
                  placeholderStyle={{
                    color: '#9ca3af',
                  }}
                  listMode="SCROLLVIEW"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-1">Purchase Order Value ($)</Text>
                <TextInput 
                  className="border border-gray-200 p-3 rounded-lg bg-gray-50" 
                  placeholder="Enter Value"
                  keyboardType="numeric"
                  value={formData.poValue}
                  onChangeText={(text) => handleInputChange('poValue', text)}
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-1">Predicted Cost ($)</Text>
                <TextInput 
                  className="border border-gray-200 p-3 rounded-lg bg-gray-50" 
                  placeholder="Enter Cost"
                  keyboardType="numeric"
                  value={formData.predictedCost}
                  onChangeText={(text) => handleInputChange('predictedCost', text)}
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-1">Outsourcing Cost ($)</Text>
                <TextInput 
                  className="border border-gray-200 p-3 rounded-lg bg-gray-50" 
                  placeholder="Enter Cost"
                  keyboardType="numeric"
                  value={formData.outsourcingCost}
                  onChangeText={(text) => handleInputChange('outsourcingCost', text)}
                />
              </View>
            </>
          )}
        </View>

        {/* Buttons */}
        <Pressable 
          className="bg-red-600 p-4 rounded-lg items-center mb-4 shadow-sm"
          onPress={handleSubmit}
        >
          <Text className="text-white font-semibold text-lg">Create Project</Text>
        </Pressable>

       
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FormScreen;