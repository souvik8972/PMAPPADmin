import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, FlatList } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Image } from 'react-native';

const IssueTracker = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [issues, setIssues] = useState([]);
  const [type, setType] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [openType, setOpenType] = useState(false);
  const [openSeverity, setOpenSeverity] = useState(false);

  const issueIcons = {
    Hardware: 'hardware-chip-outline',
    Software: 'logo-windows',
    Server: 'server-outline',
    Internet: 'globe',  
    Other: 'help-circle',  
  };
  

  const handleSubmit = () => {
    const newIssue = {
      id: issues.length + 1,
      type,
      severity,
      description,
      status: 'Open',
    };
    setIssues([...issues, newIssue]);
    setModalVisible(false);
    setDescription('');
  };

  const isSubmitDisabled = !type || !severity || !description;

  return (
    <View className="flex-1 p-5 pt-0 ">
      <Text className="text-lg font-bold text-center mb-2 text-black ">Issue Tracker</Text>
      
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
      source={require('../../assets/images/noIssue.png')}  // Replace with your image path
      style={{ width: 350, height: 350, resizeMode: 'contain' }}
    />
    <Text className="text-xl font-bold text-red-800 text-center mt-2">
  YooHoo! No Issues Present 
</Text>
  </View>
) : (
        <FlatList
        data={issues}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const severityColors = {
            Low: "bg-green-200 text-green-800",
            Medium: "bg-yellow-200 text-yellow-800",
            High: "bg-red-200 text-red-800",
          };
      
          return (
            <View className="bg-white rounded-xl p-4 my-2 flex-row items-center justify-between">
              {/* Left Side: Icon and Type Info */}
              <View className="flex-row items-center">
                <View className="p-3 bg-gray-100 rounded-full">
                  <Ionicons name={issueIcons[item.type] || 'help-circle'} size={28} color="black" />
                </View>
      
                <View className="ml-4">
                  <Text className="text-lg font-bold text-black">{item.type} Issue</Text>
                  <Text className="text-gray-600">ID: {item.id}</Text>
                  <Text className={`px-2 py-1 w-[70px] text-center rounded-full text-xs font-semibold ${severityColors[item.severity]}`}>
                    {item.severity}
                  </Text>
                </View>
              </View>
      
              {/* Right Side: Status in the Middle */}
              <View className="self-center">
                <Text
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === "Open" ? "bg-blue-200 text-blue-800" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          );
        }}
      />
      
      
      )}

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-4/5 bg-white p-5 rounded-lg">
            <Text className="text-xl font-bold text-center text-black mb-3">Report an Issue</Text>
            <View className="z-50 mb-4">
              <DropDownPicker
                open={openType}
                value={type}
                items={[
                  { label: 'Hardware', value: 'Hardware' },
                  { label: 'Software', value: 'Software' },
                  { label: 'Server', value: 'Server' },
                  { label: 'Internet', value: 'Internet' },  
                  { label: 'Other', value: 'Other' },  
                ]}
                
                setOpen={setOpenType}
                setValue={setType}
                style={{ borderColor: 'gray' }}
                textStyle={{ color: 'black' }}
                dropDownContainerStyle={{ zIndex: 3000, elevation: 3000 }}
              />
            </View>

            <View className="z-40 mb-4">
              <DropDownPicker
                open={openSeverity}
                value={severity}
                items={[
                  { label: 'Low', value: 'Low' },
                  { label: 'Medium', value: 'Medium' },
                  { label: 'High', value: 'High' },
                ]}
                setOpen={setOpenSeverity}
                setValue={setSeverity}
                style={{ borderColor: 'gray' }}
                textStyle={{ color: 'black' }}
                dropDownContainerStyle={{ zIndex: 2000, elevation: 2000 }}
              />
            </View>

            <TextInput
              className="border border-gray-800 p-2 h-16  rounded-lg text-black mt-3"
              placeholder="Description"
              placeholderTextColor="black"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <TouchableOpacity
              className="p-3 rounded-lg items-center mt-3"
              onPress={handleSubmit}
              disabled={isSubmitDisabled}
              style={{ opacity: isSubmitDisabled ? 0.5 : 1 }}
            >
              <LinearGradient
                colors={["#D01313", "#6A0A0A"]}
                style={{
                  padding: 12,
                  borderRadius: 9999,
                  width: 160,
                  alignItems: 'center',
                }}
              >
                <Text className="text-white font-bold">Submit</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              className=" w-20 absolute -right-3 -top-3 p-3 rounded-lg items-center mt-3"
              onPress={() => setModalVisible(false)}
            >
             <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default IssueTracker;