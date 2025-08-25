import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { color } from "react-native-elements/dist/helpers";

export default function GradientCard({ icon, label, count, gradient,outOf }) {
  return (
    <LinearGradient colors={["white",'white']} style={styles.card}>
      <View style={{backgroundColor: gradient[0],width:"100",height:"100",opacity:0.1,left:80}} className=" rounded-full  absolute top-48 left-0 opacity-20"><Text className="text-white"></Text></View>
      <View style={{backgroundColor: gradient[0],width:"90",height:"90",opacity:0.1,left:100,top:0}} className=" rounded-full  absolute top-48 left-0 opacity-20"><Text className="text-white"></Text></View>
     
      <View>
        <Text  style={[styles.label,{color:gradient[0]}]}>{label}</Text>
        <View style={styles.box}><Text style={[styles.count,{color:gradient[0]}]}>{count}</Text>{outOf&& <Text  style={[styles.outof,{color:gradient[1]}]}>/{outOf}</Text>}</View>
      </View>
      <Icon name={icon} size={30} color={gradient[0]} />
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
    position: 'relative',
    overflow: 'hidden',
  },
 
  label: {
    // color: gradient[0],
    fontSize: 13,
    fontWeight: "bold",
    paddingBottom:4,
  },
  count: {
    color: "white",
    fontSize: 25,
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