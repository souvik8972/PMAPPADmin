import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MyTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={{ flexDirection: 'row', height: 80, padding: 8, backgroundColor: 'white' }}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];
        
        // Get the label from options
        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;

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
        const gradientColors = isFocused ? ["#D01313", "#6A0A0A"] : ['white','white'];

        return (
          <TouchableOpacity
            key={route.key}
            onPress={handlePress}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 12,
            }}
          >
            <LinearGradient
              colors={gradientColors}
              start={[0, 0]}
              end={[1, 1]}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 12,
                width: '100%',
                height: '100%',
                paddingVertical: 10,
              }}
            >
              {options.tabBarIcon && options.tabBarIcon({ 
                focused: isFocused, 
                color: isFocused ? 'white' : 'gray' 
              })}
              
              {/* Add the tab label */}
              <Text style={{ 
                color: isFocused ? 'white' : 'gray', 
                fontSize: 10,
                marginTop: 4,
                fontWeight: isFocused ? 'bold' : 'normal'
              }}>
                {label}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default MyTabBar;