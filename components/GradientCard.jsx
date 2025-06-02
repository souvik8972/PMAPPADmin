import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function GradientCard({ icon, label, count, gradient,outOf }) {
  return (
    <LinearGradient colors={gradient} style={styles.card}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.box}><Text style={styles.count}>{count}</Text>{outOf&& <Text  style={styles.outof}>/{outOf}</Text>}</View>
      </View>
      <Icon name={icon} size={36} color="white" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
  },
 
  label: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
    paddingBottom:4,
  },
  count: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 4,
  },
   box: {
    flexDirection: 'row',
    alignItems: 'baseline', 
    justifyContent: 'start',
  },
  
  outof: {
    fontSize: 12,
    marginLeft: 1,
    color: '#f0f3f9', 
  },
});