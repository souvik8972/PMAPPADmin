import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import the LinearGradient component

const MyTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View  style={{ flexDirection: 'row', height: 60,padding:8 ,backgroundColor:'white' }}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];

        const handlePress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Define the gradient colors
        const gradientColors = isFocused ? ["#D01313", "#6A0A0A"] : ['white','white']; // Active gradient and inactive solid color

        return (
          <TouchableOpacity
            key={route.key}
            onPress={handlePress}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 12,
              
               // Optional: add padding to space out icons
            }}
          >
            <LinearGradient
              colors={gradientColors} // Apply the gradient colors based on whether the tab is focused
              start={[0, 0]} // Gradient start position (left)
              end={[1, 1]} // Gradient end position (bottom-right)
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 12,
                width: '100%',
                height: '100%', // Make sure the gradient covers the whole button
                paddingVertical: 10, // Optional: maintain padding if desired
              }}
            >
              {options.tabBarIcon && options.tabBarIcon({ focused: isFocused, color: isFocused ? 'white' : 'gray' })}
            </LinearGradient>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default MyTabBar;
