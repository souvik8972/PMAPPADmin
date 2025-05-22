import { View, Text, TouchableOpacity, Image, TextInput, ActivityIndicator, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useContext } from 'react';
import Checkbox from 'expo-checkbox';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { parseJwt } from '../../utils/auth';

const Login = () => {
  // const [email, setEmail] = useState('souvik.d@medtrixhealthcare.com');
  // const [password, setPassword] = useState('lavgZzsS');
  const [email, setEmail] = useState('system_admin@medtrixhealthcare.com');
  const [password, setPassword] = useState('hello123');
  // const [email, setEmail] = useState('yukta.d@medtrixhealthcare.com');
  // const [password, setPassword] = useState('yoTxiPqF');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const { user } = useContext(AuthContext);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("Login successful", data.token);
      const userData = parseJwt(data.token);
      console.log("User data from token:", userData);

      login(data.token, userData).then(() => {
        if (userData?.UserType == "3") {
          router.replace('/(tabs)');
        } else {
          router.replace('/(admin)');
        }
      });
    },
    onError: (error) => {
      setError({
        email: error.message,
        password: error.message,
      });
    },
  });

  const handleLogin = () => {
    let newErrors = { email: '', password: '' };
    if (!email) newErrors.email = 'Enter your email';
    if (!password) newErrors.password = 'Enter your password';

    if (newErrors.email || newErrors.password) {
      setError(newErrors);
      return;
    }

    setError({ email: '', password: '' });
    mutation.mutate({ email, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-white px-6 relative items-center pb-10">
          <View style={{ marginTop: 80, marginBottom: 30 }} className="items-center mb-8">
            <Image source={require("../../assets/images/Medtrix_logo.jpg")} className="w-[250px]" resizeMode="contain" />
          </View>

          <View className="bg-[#F0F0F0] p-6 pt-8 pb-8 w-full min-h-[400px] justify-between z-[10] max-w-lg rounded-[20px] shadow-lg"
            style={{
              shadowColor: "#091E42",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
              marginBottom: 20,
            }}>
            
            {/* Error message at the very top */}
            {error.email === 'Invalid email or password' && (
              <Text className="text-red-700 text-center mt-1 mb-4 font-medium text-lg">
                Invalid email or password
              </Text>
            )}
            
            <Text className="text-[24px] font-semibold mb-4 text-center text-gray-800">Project Management Portal</Text>

            <View className="mb-4">
              <Text className="text-gray-700 text-[15px] pl-1 font-medium mb-1">Email</Text>
              <TextInput
                placeholder={error.email && error.email !== 'Invalid email or password' ? error.email : "Enter email"}
                keyboardType="email-address"
                placeholderTextColor={error.email ? "red" : "black"}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError((prev) => ({ ...prev, email: '' }));
                }}
                className="bg-white h-[50px] p-3 rounded-[12px] text-gray-700"
                style={{
                  borderWidth: error.email && error.email !== 'Invalid email or password' ? 1 : 0,
                  borderColor: error.email && error.email !== 'Invalid email or password' ? "red" : "transparent",
                  shadowColor: "rgba(0, 0, 0, 0.4)",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.4,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 text-[15px] pl-1 font-medium mb-1">Password</Text>
              <TextInput
                placeholder={error.password && error.password !== 'Invalid email or password' ? error.password : "Enter your password"}
                placeholderTextColor={error.password ? "red" : "black"}
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError((prev) => ({ ...prev, password: '' }));
                }}
                className="bg-white h-[50px] p-3 rounded-[12px] text-gray-700"
                style={{
                  borderWidth: error.password && error.password !== 'Invalid email or password' ? 1 : 0,
                  borderColor: error.password && error.password !== 'Invalid email or password' ? "red" : "transparent",
                  shadowColor: "rgba(0, 0, 0, 1)",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.4,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              />
            </View>

            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center">
                <Checkbox
                  value={rememberMe}
                  onValueChange={setRememberMe}
                  color={rememberMe ? 'red' : 'gray'}
                />
                <Text className="pl-2">Remember Me</Text>
              </View>
              <TouchableOpacity>
                <Text className="text-red-700 font-medium">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-black py-4 h-[50px] rounded-[12px] flex items-center justify-center"
              onPress={handleLogin}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center text-white font-semibold text-lg">Login</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.waveContainer}>
            <Image
              source={require('../../assets/images/svg2.png')}
              style={styles.waveImage}
              resizeMode="stretch"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  waveContainer: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 1,
  },
  waveImage: {
    width: '100%',
    height: '100%',
  },
});