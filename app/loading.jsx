import { View, Text, Animated, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';

const Loading = () => {
    const { user } = useContext(AuthContext);
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // console.log("User from AuthContext:", user); // ✅ Check user value in console

        // Start animation immediately
        Animated.sequence([
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1.2,
                    friction: 2,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]),
            Animated.delay(1000),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();

        // Check auth and redirect with delay
        const timeout = setTimeout(() => {
            if (!user) {
                // console.log("Redirecting to login");
                router.replace("/Landing");
            } else if (typeof user === 'string' && user.toLowerCase() === "admin") {
                // console.log("Redirecting to admin");
                router.replace("/(admin)");
            } else {
                // console.log("Redirecting to tabs");
                router.replace("/(tabs)");
            }
        }, 2500); // Wait for animation (~2.5s total)

        return () => clearTimeout(timeout); // Cleanup on unmount
    }, [user]); // 🔁 Also rerun if `user` changes

    return (
        <View style={styles.container}>
            <Animated.Text
                style={[
                    styles.text,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                Medtrix
            </Animated.Text>
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

export default Loading;
