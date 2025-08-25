import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import RenderItem from "../../components/Assets/RenderItem";
import { useFetchDataNoCache } from "@/ReactQuery/hooks/userFetchWithoutCache";
import { usePostData } from "../../ReactQuery/hooks/usePostData";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import Retry from "../../components/Retry";
import RetryButton from "../../components/Retry";
import { Toast } from "toastify-react-native";

const windowWidth = Dimensions.get("window").width;
const itemWidth = (windowWidth - 60) / 3;

const ShimmerItem = () => (
  <View style={[styles.shimmerItem, { width: itemWidth }]}>
    <View style={styles.shimmerIcon} />
    <View style={styles.shimmerText} />
  </View>
);

const AssetManagement = () => {
  // console.log("AssetManagement");
  const { mutate } = usePostData("Assests/SendAssestdetails", ["Assests/GetAllAssests"]);
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const { data, isLoading, error, refetch } = useFetchDataNoCache(
    "Assests/GetAllAssests",
    user?.token
  );
 
  const [refreshing, setRefreshing] = useState(false);
  const [assets, setAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Pull to refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => {
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetch();
    });
    return unsubscribe;
  }, [navigation, refetch]);

  const getIconName = (pId, brandName) => {
    if (
      brandName.includes("Apple") ||
      brandName.includes("iPhone") ||
      brandName.includes("MacBook")
    ) {
      return pId === 6 ? "smartphone" : "laptop-mac";
    }

    switch (pId) {
      case 1:
      case 2:
        return "laptop";
      case 3:
      case 4:
        return "tablet";
      case 5:
        return "smartphone";
      case 7:
        return "power";
      case 8:
        return "vrpano";
      case 9:
        return "storage";
      default:
        return "devices";
    }
  };

  useEffect(() => {
    if (data?.assests) {
      setIsProcessing(true);
      const transformedData = data.assests.map((item) => ({
        id: item.Id,
        name: item.Product_Name,
        icon: getIconName(item.P_Id, item.BrandName),
        taken: item.P_Status === "U",
        brand: item.BrandName,
        typeId: item.P_Id,
      }));
      setAssets(transformedData);
      setIsProcessing(false);
    }
  }, [data]);

  const handlePress = (id) => {
    setSelectedAssets((prev) =>
      prev.includes(id) ? prev.filter((assetId) => assetId !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (selectedAssets.length === 0) {
      // alert("Please select at least one asset.");
      Toast.success('Please select at least one asset.');
      return;
    }
    setModalVisible(true);
  };

  const handleModalSubmit = () => {
    if (!textInput.trim()) {
      Toast.error("Please enter some text before submitting.");
      return;
    }

    const payload = {
      empId: user?.empId || user?.id || "default-emp-id",
      reason: textInput.trim(),
      productDetail: selectedAssets.join(","),
    };

    console.log("Submitting payload:", payload);

    mutate(
      { data: payload, token: user.token },
      {
        onSuccess: () => {
          const updatedAssets = assets.map((asset) =>
            selectedAssets.includes(asset.id) ? { ...asset, taken: true } : asset
          );
          setAssets(updatedAssets);
          setModalVisible(false);
          setTextInput("");
          setSelectedAssets([]);
          Toast.success("Asset checkout submitted successfully.");
        },
        onError: (error) => {
          Toast.error("Failed to submit asset checkout.");
        },
      }
    );
  };

  const handleCancelModal = () => {
    setModalVisible(false);
    setTextInput("");
  };

  if (isLoading || isProcessing) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.shimmerContainer}>
          {[...Array(6)].map((_, index) => (
            <ShimmerItem key={index} />
          ))}
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <RetryButton onRetry={refetch} message={"Failed to load assets"}/>
      </View>
    );
  }

  return (
<>
          <View className="flex  mt-8  justify-center items-center" style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSubmit} activeOpacity={0.8}>
          <LinearGradient
            colors={
              selectedAssets.length > 0 ? ["#D01313", "#6A0A0A"] : ["#E5E7EB", "#E5E7EB"]
            }
            style={[
              styles.proceedButton,
              selectedAssets.length === 0 && styles.disabledButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                selectedAssets.length === 0 && styles.disabledButtonText,
              ]}
            >
              {selectedAssets.length > 0 ? "Proceed" : "Select Assets"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#D01313']} // Android
          tintColor="#D01313" // iOS
        />
      }
    >


      <View style={styles.assetsGrid}>
        {assets.map((item) => (
          <RenderItem
            key={item.id}
            item={item}
            selectedAssets={selectedAssets}
            handlePress={handlePress}
            itemWidth={itemWidth}
          />
        ))}
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
       
  <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    className="flex-1"
  >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reason for Checkout</Text>
            <TextInput
              value={textInput}
              onChangeText={setTextInput}
              placeholder="Enter reason..."
              style={styles.modalInput}
              placeholderTextColor="#9CA3AF"
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleModalSubmit}
                style={styles.submitButtonWrapper}
              >
                <LinearGradient
                  colors={["#D01313", "#6A0A0A"]}
                  style={styles.submitButton}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancelModal}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    // paddingTop: 20,
    paddingBottom: 48,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    
  },
  shimmerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  shimmerItem: {
    height: 150,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    marginBottom: 20,
  },
  shimmerIcon: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D1D5DB",
  },
  shimmerText: {
    position: "absolute",
    bottom: 16,
    left: 16,
    width: "70%",
    height: 16,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  errorText: {
    color: "#DC2626",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  proceedButton: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  disabledButton: {
    opacity: 1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  disabledButtonText: {
    color: "#6B7280",
  },
  assetsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#F3F4F6",
    marginBottom: 20,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButtonWrapper: {
    flex: 1,
    marginRight: 10,
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#E5E7EB",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#DC2626",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default AssetManagement;
