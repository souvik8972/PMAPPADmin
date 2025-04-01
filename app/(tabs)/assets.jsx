import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import "nativewind";

const RenderItem = ({ item ,selectedAssets,handlePress}) => {
  

  
  return ( <TouchableOpacity
      onPress={() => !item.taken && handlePress(item.id)}
      className={`w-28 h-36 m-2 p-3 rounded-xl items-center justify-between 
      ${selectedAssets.includes(item.id) ? "bg-[#d0e4cd]" : item.taken ? "bg-red-400 opacity-50" : "bg-[#e3e6e3]"}`}
      disabled={item.taken}
    >
      <MaterialIcons name={item.icon} size={40} color="black" />
      <Text className="text-xs text-center mt-2">{item.name}</Text>
      <TouchableOpacity onPress={() => !item.taken && handlePress(item.id)}>
        {selectedAssets.includes(item.id) ? (
          <MaterialIcons name="check-box" size={24} color="gray" />
        ) : (
          <MaterialIcons name="check-box-outline-blank" size={24} color="black" />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );

 
}

const initialAssets = [
  { id: 1, name: "Samsung Tab S8", icon: "tablet", taken: false, category: "tablet" },
  { id: 2, name: "Laptop Lenovo", icon: "laptop", taken: false, category: "laptop" },
  { id: 3, name: "MacBook", icon: "laptop-mac", taken: true, category: "laptop" },
  { id: 4, name: "OnePlus 9R 5G", icon: "smartphone", taken: false, category: "mobile" },
  { id: 5, name: "iPad Pro (5th Gen)", icon: "tablet-android", taken: false, category: "tablet" },
  { id: 6, name: "iPad Mini (6th Gen)", icon: "tablet", taken: true, category: "tablet" },
  { id: 7, name: "Apple iPhone 13", icon: "smartphone", taken: false, category: "mobile" },
  { id: 8, name: "OnePlus 12", icon: "smartphone", taken: false, category: "mobile" },
  { id: 9, name: "iPad PRO(MNC-007)", icon: "tablet-android", taken: true, category: "tablet" },
  { id: 10, name: "Apple iPhone 15", icon: "smartphone", taken: false, category: "mobile" },
  { id: 11, name: "iPad Charging", icon: "power", taken: false, category: "accessory" },
  { id: 12, name: "Android Tab Charger", icon: "power", taken: true, category: "accessory" },
  { id: 13, name: "iPad Cables", icon: "cable", taken: false, category: "accessory" },
];

const Assets = () => {
  const [assets, setAssets] = useState(initialAssets);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const filteredAssets = selectedCategory
    ? assets.filter((asset) => asset.category === selectedCategory)
    : assets;

  return (
    <View className="flex-1">
      <Text className="text-black font-bold text-center text-lg mb-4">Assets Management</Text>
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

      <View className="flex-row justify-around mt-4">
        {['mobile', 'laptop', 'tablet', 'accessory'].map((category) => (
          <TouchableOpacity key={category} onPress={() => setSelectedCategory(category)}>
            <Text className={`p-2 px-4  rounded-lg ${selectedCategory === category ? 'bg-red-900 text-white' : 'bg-gray-200'}`}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-row flex-wrap justify-center mt-4">
        {filteredAssets.map((item) => (
          <RenderItem key={item.id} item={item} selectedAssets={selectedAssets} handlePress={handlePress} />
        ))}
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-[90%]">
            <Text className="text-lg font-bold mb-4">Enter Details</Text>
            <TextInput
              value={textInput}
              onChangeText={setTextInput}
              placeholder="Enter text"
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
    </View>
  );
};

export default Assets;
