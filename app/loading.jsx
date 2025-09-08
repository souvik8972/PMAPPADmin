import { View, Text, Animated, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import LottieView from 'lottie-react-native';

const Loading = ({setLoading}) => {


    
    return (
        <View style={styles.container}>
            <View style={styles.lottieContainer}>
                <LottieView
                    source={require('../assets/animation/load2.json')}
                    autoPlay
                    loop={false}
                    onAnimationFinish={() => {setLoading(false)}}
                    style={styles.lottie}
                />
                <View style={styles.overlay}></View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    lottieContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    lottie: {
        width: "100%",
        height: "130%",
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '30%', // Adjust this value to control how much of the bottom is covered
        backgroundColor: 'white',
        opacity: 1,
    },
});

export default Loading;