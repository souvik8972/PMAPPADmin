import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const RenderItem = ({ item, selectedAssets, handlePress, itemWidth }) => {
  const isSelected = selectedAssets.includes(item.id);
  const isTaken = item.taken;

  const getBackgroundColor = () => {
    if (isTaken) return "#FEE2E2"; // Light red for taken items
    if (isSelected) return "#D1FAE5"; // Light green for selected items
    return "#F3F4F6"; // Gray for unselected items
  };

  const getTextColor = () => {
    if (isTaken) return "#DC2626"; // Red text for taken items
    if (isSelected) return "#065F46"; // Dark green text for selected items
    return "#4B5563"; // Gray text for unselected items
  };

  const getIconColor = () => {
    if (isTaken) return "#DC2626"; // Red icon for taken items
    if (isSelected) return "#10B981"; // Green icon for selected items
    return "#6B7280"; // Gray icon for unselected items
  };

  return (
    <TouchableOpacity
      onPress={() => !isTaken && handlePress(item.id)}
      disabled={isTaken}
      style={[
        styles.itemContainer,
        { 
          backgroundColor: getBackgroundColor(),
          width: itemWidth,
          marginBottom:15,
          paddingTop:10,
          opacity: isTaken ? 0.7 : 1,
        },
      ]}
    >
      <Icon
        name={item.icon}
        size={28}
        color={getIconColor()}
        style={styles.icon}
      />
      <Text
        style={[
          styles.itemText,
          { color: getTextColor() },
        ]}
        numberOfLines={8}
      >
        {item.name}
      </Text>
      {isTaken && (
        <Text style={styles.takenText}>Claimed</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: 150,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    //shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  takenText: {
    position: "absolute",
    bottom: 8,
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "bold",
  },
});

export default RenderItem;