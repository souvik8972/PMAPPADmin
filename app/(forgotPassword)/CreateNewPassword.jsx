import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';

const CreateNewPassword = () => {
  const params = useLocalSearchParams();
  const email = params.email;

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate password as user types
    if (name === 'password') {
      validatePassword(value);
    }
  };

  // Validate password against all requirements
  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('At least 8 characters');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('At least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('At least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('At least one digit');
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('At least one special character');
    }
    
    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    // Dismiss keyboard first
    Keyboard.dismiss();
    
    if (!formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Validate password meets all requirements
    if (!validatePassword(formData.password)) {
      Alert.alert('Error', 'Password does not meet all requirements');
      return;
    }

    setIsLoading(true);
    
    try {
      // Make API call to change password
      const response = await changePassword(email, formData.password);
      
      if (response.success) {
        Alert.alert('Success', 'Password has been reset successfully');
        
        // Navigate to login screen after successful password reset
        setTimeout(() => {
          router.replace('/(auth)/login');
        }, 1500);
      } else {
        Alert.alert('Error', response.message || 'Failed to reset password');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to reset password. Please try again.');
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // API call to change password
  const changePassword = async (email, newPassword) => {
    try {
      const response = await fetch(
        `https://projectmanagement.medtrixhealthcare.com/ProjectManagmentApi/api/Auth/ChangePassword?newPassword=${encodeURIComponent(newPassword)}&Email=${encodeURIComponent(email)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            {/* Animation Container */}
            <View style={styles.animationContainer}>
              <LottieView
                source={require('../../assets/animation/createPassword.json')}
                autoPlay
                loop={true}
                style={styles.animation}
              />
            </View>
          
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Create New Password</Text>
              <Text style={styles.subtitle}>
                Your new password must have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.
              </Text>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={formData.password}
                  onChangeText={(value) => handleChange('password', value)}
                  secureTextEntry={!showPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#A0AEC0"
                  returnKeyType="done"
                />
                <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
                  <Ionicons 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={24} 
                    color="#64748B" 
                  />
                </TouchableOpacity>
              </View>
              
              {/* Password Requirements */}
             
            </View>
  {/* <View style={styles.requirementsContainer}>
                <Text style={styles.requirementsTitle}>Password must contain:</Text>
                <View style={styles.requirementsList}>
                  <View style={styles.requirementItem}>
                    <Ionicons 
                      name={formData.password.length >= 8 ? 'checkmark-circle' : 'ellipse-outline'} 
                      size={16} 
                      color={formData.password.length >= 8 ? '#10B981' : '#64748B'} 
                    />
                    <Text style={[
                      styles.requirementText,
                      formData.password.length >= 8 && styles.requirementMet
                    ]}>
                      At least 8 characters
                    </Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <Ionicons 
                      name={/[A-Z]/.test(formData.password) ? 'checkmark-circle' : 'ellipse-outline'} 
                      size={16} 
                      color={/[A-Z]/.test(formData.password) ? '#10B981' : '#64748B'} 
                    />
                    <Text style={[
                      styles.requirementText,
                      /[A-Z]/.test(formData.password) && styles.requirementMet
                    ]}>
                      One uppercase letter
                    </Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <Ionicons 
                      name={/[a-z]/.test(formData.password) ? 'checkmark-circle' : 'ellipse-outline'} 
                      size={16} 
                      color={/[a-z]/.test(formData.password) ? '#10B981' : '#64748B'} 
                    />
                    <Text style={[
                      styles.requirementText,
                      /[a-z]/.test(formData.password) && styles.requirementMet
                    ]}>
                      One lowercase letter
                    </Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <Ionicons 
                      name={/[0-9]/.test(formData.password) ? 'checkmark-circle' : 'ellipse-outline'} 
                      size={16} 
                      color={/[0-9]/.test(formData.password) ? '#10B981' : '#64748B'} 
                    />
                    <Text style={[
                      styles.requirementText,
                      /[0-9]/.test(formData.password) && styles.requirementMet
                    ]}>
                      One digit
                    </Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <Ionicons 
                      name={/[^A-Za-z0-9]/.test(formData.password) ? 'checkmark-circle' : 'ellipse-outline'} 
                      size={16} 
                      color={/[^A-Za-z0-9]/.test(formData.password) ? '#10B981' : '#64748B'} 
                    />
                    <Text style={[
                      styles.requirementText,
                      /[^A-Za-z0-9]/.test(formData.password) && styles.requirementMet
                    ]}>
                      One special character
                    </Text>
                  </View>
                </View>
              </View> */}
            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleChange('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Confirm your password"
                  placeholderTextColor="#A0AEC0"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
                <TouchableOpacity onPress={toggleShowConfirmPassword} style={styles.eyeIcon}>
                  <Ionicons 
                    name={showConfirmPassword ? 'eye-off' : 'eye'} 
                    size={24} 
                    color="#64748B" 
                  />
                </TouchableOpacity>
              </View>
              
              {/* Password Match Indicator */}
              {formData.confirmPassword.length > 0 && (
                <View style={styles.matchContainer}>
                  <Ionicons 
                    name={formData.password === formData.confirmPassword ? 'checkmark-circle' : 'close-circle'} 
                    size={16} 
                    color={formData.password === formData.confirmPassword ? '#10B981' : '#EF4444'} 
                  />
                  <Text style={[
                    styles.matchText,
                    { color: formData.password === formData.confirmPassword ? '#10B981' : '#EF4444' }
                  ]}>
                    {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                  </Text>
                </View>
              )}
            </View>
 
            {/* Submit Button */}
            <TouchableOpacity 
              onPress={handleSubmit} 
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
                  <Text style={styles.buttonText}>Reset Password</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Back to Login Button */}
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => {
                Keyboard.dismiss();
                router.back();
              }}
              disabled={isLoading}
            >
              <Text style={styles.backButtonText}>
                <Ionicons name="arrow-back" size={16} color="#64748B" /> Back to Login
              </Text>
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
    padding: 30,
    paddingTop: 10,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  animation: {
    width: 200,
    height: 200,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A0A0A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 16,
  },
  requirementsContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  requirementsList: {
    gap: 6,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementText: {
    fontSize: 14,
    color: '#64748B',
  },
  requirementMet: {
    color: '#10B981',
    fontWeight: '500',
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  matchText: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 25,
    shadowColor: '#D01313',
    //shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CreateNewPassword;