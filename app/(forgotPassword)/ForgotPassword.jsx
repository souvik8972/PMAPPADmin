import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Toast } from 'toastify-react-native';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    Keyboard.dismiss(); 
    
    if (!email) {
      // Alert.alert('Error', 'Please enter your email address');
      Toast.error('Please enter your email address', { position: 'top' });
      return;
    }
    
    if (!isValidEmail(email)) {
      Toast.error('Please enter a valid email address', { position: 'top' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Make API call to validate email
      const response = await validateEmail(email);
      
      if (response.success) {
        // If email is valid, navigate to OTP verification page and pass the email
        router.push({
          pathname: '/(forgotPassword)/OTPVerification',
          params: { email: email }
        });
        Toast.success(`Password reset instructions sent to ${email}`, { position: 'top' });
        // Alert.alert('Success', `Password reset instructions sent to ${email}`);
      } else {
        Toast.error(response.message || 'Email validation failed', { position: 'top' });
      }
    } catch (error) {
      Toast.error('Failed to validate email. Please try again.', { position: 'top' });
      // console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // API call to validate email
  const validateEmail = async (email) => {
    try {
      const response = await fetch(
        `https://projectmanagement.medtrixhealthcare.com/ProjectManagmentApi/api/Auth/ValidateEmail?email=${encodeURIComponent(email)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        // throw new Error(`HTTP error! status: ${response.status}`);
        
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      // console.error('Error validating email:', error);
      // throw error;
    }
  };

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleBack = () => {
    Keyboard.dismiss(); 
    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.animationContainer}>
              <LottieView
                source={require('../../assets/animation/password.json')}
                autoPlay
                loop={true}
                style={styles.animation}
              />
            </View>
            
            <View style={styles.header}>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                Enter your email address and we'll send you a link to reset your password
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleSend}
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity 
              onPress={handleSend} 
              style={styles.buttonContainer}
              disabled={isLoading}
            >
              <LinearGradient
                colors={["#D01313", "#6A0A0A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.gradientButton, isLoading && styles.disabledButton]}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.sendButtonText}>Send Reset Link</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBack}
              disabled={isLoading}
            >
              <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 30,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 40,
    height: 200,
  },
  animation: {
    width: 200,
    height: 200,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6A0A0A',
    marginBottom: 15,
    marginTop: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 16,
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 18,
    fontSize: 16,
    color: '#1E293B',
    shadowColor: '#000',
    //shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#4A90E2',
    //shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientButton: {
    padding: 18,
    alignItems: 'center',
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 10,
  },
  backButtonText: {
    color: 'gray',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ForgotPassword;