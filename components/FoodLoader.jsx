import { View, Text, Animated, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import LottieView from 'lottie-react-native';
const FoodLoader = ({}) => {
    
    
    return (
        <View style={styles.container}>
            
                  <LottieView
        source={require('../assets/animation/food.json')}
        autoPlay
        loop={true}
        style={{ width: 200, height: 200 }}
        resizeMode="contain"
       
      />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4a6da7',
    },
});

export default FoodLoader;
