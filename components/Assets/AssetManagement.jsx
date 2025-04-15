import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import "nativewind";
import RenderItem from "../../components/Assets/RenderItem";
import { useFetchData } from "../../ReactQuery/hooks/useFetchData";
import { AuthContext } from "../../context/AuthContext";

const ShimmerItem = () => (
  <View className="m-2 w-[150px] h-[150px] rounded-lg overflow-hidden">
    <View className="bg-gray-200 w-full h-full animate-pulse">
      <View className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gray-300" />
      <View className="absolute bottom-4 left-4 w-[100px] h-4 rounded bg-gray-300" />
    </View>
  </View>
);

const Assets = () => {
  const { user } = useContext(AuthContext);
  const { data, isLoading, error } = useFetchData("Assests/GetAllAssests", user.token);
  
  const [assets, setAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [textInput, setTextInput] = useState("");

  // Improved icon mapping based on P_Id and BrandName
  const getIconName = (pId, brandName) => {
    // Handle Apple products first
    if (brandName.includes("Apple") || brandName.includes("iPhone") || brandName.includes("MacBook")) {
      return pId === 6 ? "smartphone" : "laptop-mac";
    }

    // Handle other products by type
    switch(pId) {
      case 1: // MacBook
      case 2: // Lenovo
        return "laptop";
      case 3: // iPad
      case 4: // Android Tablets
        return "tablet";
      case 5: // Android Phone
        return "smartphone";
      case 7: // Accessories
        return "power";
      case 8: // Microsoft (Hololens)
        return "vrpano";
      case 9: // Hardware
        return "storage";
      default:
        return "devices";
    }
  };

  useEffect(() => {
    if (data) {
      const transformedData = data.map(item => ({
        id: item.Id,
        name: item.Product_Name,
        icon: getIconName(item.P_Id, item.BrandName),
        taken: item.P_Status === "U",
        brand: item.BrandName,
        typeId: item.P_Id
      }));
      setAssets(transformedData);
    }
  }, [data]);

  const handlePress = (id) => {
    setSelectedAssets((prev) =>
      prev.includes(id) ? prev.filter((assetId) => assetId !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (selectedAssets.length > 0) {
      setModalVisible(true);
    } else {
      alert("Please select at least one asset.");
    }
  };

  const handleModalSubmit = () => {
    if (!textInput.trim()) {
      alert("Please enter some text before submitting.");
      return;
    }
    const updatedAssets = assets.map((asset) =>
      selectedAssets.includes(asset.id) ? { ...asset, taken: true } : asset
    );
    setAssets(updatedAssets);
    setModalVisible(false);
    setTextInput("");
    setSelectedAssets([]);
  };

  const handleCancelModal = () => {
    setModalVisible(false);
    setTextInput("");
  };

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error loading assets: {error.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1">
      <View className="flex items-center"> 
        <TouchableOpacity onPress={handleSubmit} disabled={selectedAssets.length === 0}>
          <LinearGradient
            colors={selectedAssets.length > 0 ? ["#D01313", "#6A0A0A"] : ['#D1D5DB', '#D1D5DB']}
            style={{ padding: 12, borderRadius: 9999, width: 160, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {selectedAssets.length === 0 ? "Select assets" : "Proceed"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ScrollView className="flex-1">
          <View className="flex-row flex-wrap justify-center mt-4">
            {[...Array(8)].map((_, index) => (
              <ShimmerItem key={index} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-row flex-wrap justify-center mt-4">
          {assets.map((item) => (
            <RenderItem 
              key={item.id} 
              item={item} 
              selectedAssets={selectedAssets} 
              handlePress={handlePress} 
            />
          ))}
        </View>
      )}

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-[90%]">
            <Text className="text-lg font-bold mb-4">Enter Details</Text>
            <TextInput
              value={textInput}
              onChangeText={setTextInput}
              placeholder="Enter reason for checkout"
              className="border border-gray-300 h-12 p-2 rounded mb-4"
            />
            <View className="flex-row justify-between">
              <TouchableOpacity onPress={handleModalSubmit} className="flex-1 mr-2">
                <LinearGradient colors={['#D01313', '#6A0A0A']} style={{ padding: 10, borderRadius: 9999, alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancelModal} className="flex-1">
                <View className="bg-gray-100 p-3 rounded-full justify-center items-center">
                  <Text className="text-red-500 text-center font-bold">Cancel</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Assets;