import React, { useState, useRef, useEffect } from 'react';
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
  ActivityIndicator
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

// Main OTP Verification component
const OTPVerification = () => {
  const params = useLocalSearchParams();
  const email = params.email;

  // State to store the OTP digits (initially an array of 6 empty strings)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  // State to track if OTP is being resent
  const [isResending, setIsResending] = useState(false);
  // State to track if OTP is being verified
  const [isVerifying, setIsVerifying] = useState(false);
  // State for the countdown timer (120 seconds = 2 minutes)
  const [timer, setTimer] = useState(120);
  // Ref to manage focus between OTP input fields
  const inputRefs = useRef([]);
  // Ref to store the interval ID
  const timerIntervalRef = useRef(null);

  // Effect to start timer on component mount
  useEffect(() => {
    startTimer();
    
    // Clean up interval on component unmount
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Function to format time as minutes:seconds
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Function to start the countdown timer
  const startTimer = () => {
    // Clear any existing interval
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    // Reset timer to 120 seconds
    setTimer(120);
    
    // Start countdown timer
    timerIntervalRef.current = setInterval(() => {
      setTimer(prev => {
        // Clear interval and stop timer when it reaches 0
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
          return 0;
        }
        // Decrement timer by 1 second
        return prev - 1;
      });
    }, 1000); // Run every second
  };

  // Function to handle text input in OTP fields
  const handleChangeText = (text, index) => {
    // Check if user is pasting text (more than 1 character)
    if (text.length > 1) {
      // Split pasted text into individual characters and take first 6
      const pastedOtp = text.split('').slice(0, 6);
      // Create a copy of current OTP state
      const newOtp = [...otp];
      // Update OTP array with pasted values
      pastedOtp.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      // Update state with new OTP values
      setOtp(newOtp);
      
      // Focus on the last input if full OTP was pasted
      if (pastedOtp.length === 6) {
        inputRefs.current[5]?.focus();
      } else if (pastedOtp.length > 0) {
        // Or focus on next empty field
        inputRefs.current[pastedOtp.length]?.focus();
      }
      return;
    }

    // For single character input
    // Create copy of current OTP state
    const newOtp = [...otp];
    // Update the specific digit at the given index
    newOtp[index] = text;
    // Update state
    setOtp(newOtp);

    // Auto focus to next input if current input has value and not last field
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Function to handle keyboard events (like backspace)
  const handleKeyPress = (e, index) => {
    // If backspace is pressed and current field is empty, move to previous field
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Function to verify the entered OTP
  const handleVerify = async () => {
    // Join OTP array into a single string
    const enteredOtp = otp.join('');
    // Validate that all 6 digits are entered
    if (enteredOtp.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    
    try {
      // Make API call to verify OTP
      const response = await verifyOtp(email, parseInt(enteredOtp));
      
      if (response.success) {
        Alert.alert('Success', 'OTP verified successfully!');
        // Navigate to create new password screen with email parameter
        router.replace({
          pathname: '/CreateNewPassword',
          params: { email: email }
        });
      } else {
        Alert.alert('Error', response.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
      console.error('API Error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  // API call to verify OTP
  const verifyOtp = async (email, otp) => {
    try {
      const response = await fetch(
        'https://projectmanagement.medtrixhealthcare.com/ProjectManagmentApi/api/Auth/VerifyOtp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            otp: otp
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };

  // Function to handle resending OTP
  const handleResend = async () => {
    // Don't allow resending if timer is still active
    if (timer > 0) return;
    
    // Set resending state to true (shows loading text)
    setIsResending(true);
    
    try {
      // Make API call to resend OTP
      const response = await validateEmail(email);
      
      if (response.success) {
        // Show success message
        Alert.alert('Success', 'New OTP has been sent to your email');
        // Start the timer again
        startTimer();
      } else {
        Alert.alert('Error', response.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
      console.error('API Error:', error);
    } finally {
      // Reset resending state
      setIsResending(false);
    }
  };

  // API call to validate email (resend OTP)
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error validating email:', error);
      throw error;
    }
  };

  // Function to navigate back to previous screen
  const handleBack = () => {
    router.back();
  };

  // Render the component UI
  return (
    // SafeAreaView ensures content is not hidden by notches or status bars
    <SafeAreaView style={styles.container}>
      {/* KeyboardAvoidingView prevents keyboard from covering input fields */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* ScrollView allows scrolling if content exceeds screen height */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Container for the animation */}
          <View style={styles.animationContainer}>
            <LottieView
              source={require('../../assets/animation/password.json')} // OTP animation file
              autoPlay // Automatically play the animation
              loop={true} // Loop the animation continuously
              style={styles.animation}
            />
          </View>
          
          {/* Header section with title and instructions */}
          <View style={styles.header}>
            <Text style={styles.title}>OTP Verification</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to your email address: <Text style={{fontWeight:'bold',color:'#D01313'}}>{email}</Text>
            </Text>
          </View>

          {/* Container for the 6 OTP input fields */}
          <View style={styles.otpContainer}>
            {/* Map through OTP array to create 6 input fields */}
            {otp.map((digit, index) => (
              <TextInput
                key={index} // Unique key for each input
                style={[styles.otpInput, digit && styles.otpInputFocused]} // Apply focused style if digit exists
                value={digit} // Current value of the input
                onChangeText={(text) => handleChangeText(text, index)} // Handle text input
                onKeyPress={(e) => handleKeyPress(e, index)} // Handle keyboard events
                keyboardType="number-pad" // Show number pad keyboard
                maxLength={index === 0 ? 6 : 1} // Allow pasting in first input
                ref={(ref) => (inputRefs.current[index] = ref)} // Store reference to input
                selectTextOnFocus // Select all text when input is focused
                editable={!isVerifying} // Disable editing while verifying
              />
            ))}
          </View>

          {/* Verify OTP button with gradient background */}
          <TouchableOpacity 
            onPress={handleVerify} 
            style={styles.buttonContainer}
            disabled={isVerifying}
          >
            <LinearGradient
              colors={["#D01313", "#6A0A0A"]} // Red gradient matching your theme
              start={{ x: 0, y: 0 }} // Gradient starts from left
              end={{ x: 1, y: 0 }} // Gradient ends at right
              style={[styles.gradientButton, isVerifying && styles.disabledButton]}
            >
              {isVerifying ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.verifyButtonText}>Verify OTP</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Resend OTP section */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            {/* Resend button - disabled while timer is active or resending */}
            <TouchableOpacity 
              onPress={handleResend} 
              disabled={timer > 0 || isResending}
            >
              <Text style={[
                styles.resendLink, 
                (timer > 0 || isResending) && styles.resendLinkDisabled // Apply disabled style when needed
              ]}>
                {/* Show appropriate text based on state */}
                {isResending ? 'Sending...' : `Resend ${timer > 0 ? `(${formatTime(timer)})` : ''}`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Back to login button */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            disabled={isVerifying}
          >
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Stylesheet for the component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up all available space
    backgroundColor: '#F8FAFC', // Light background color
  },
  keyboardAvoid: {
    flex: 1, // Take up all available space
  },
  scrollContainer: {
    flexGrow: 1, // Allow content to grow and scroll
    justifyContent: 'center', // Center content vertically
    padding: 30, // Padding around content
  },
  animationContainer: {
    alignItems: 'center', // Center animation horizontally
    justifyContent: 'center', // Center animation vertically
    height: 200, // Fixed height for animation container
  },
  animation: {
    marginLeft: 45,
    width: 200, // Fixed width for animation
    height: 200, // Fixed height for animation
  },
  header: {
    alignItems: 'center', // Center header content horizontally
    marginBottom: 30, // Space below header
  },
  title: {
    fontSize: 20, // Title font size
    fontWeight: 'bold', // Title font weight
    color: '#6A0A0A', // Dark red color matching your theme
    marginBottom: 15, // Space below title
    marginTop: 15, // Space above title
    textAlign: 'center', // Center align text
  },
  subtitle: {
    fontSize: 16, // Subtitle font size
    color: '#64748B', // Gray color for subtitle
    opacity: 0.8, // Slightly transparent
    textAlign: 'center', // Center align text
    lineHeight: 16, // Line height for better readability
  },
  otpContainer: {
    flexDirection: 'row', // Arrange OTP inputs in a row
    justifyContent: 'space-between', // Space evenly between inputs
    marginBottom: 40, // Space below OTP container
  },
  otpInput: {
    backgroundColor: '#FFFFFF', // White background for inputs
    borderWidth: 1, // Border width
    borderColor: '#E2E8F0', // Light border color
    borderRadius: 10, // Rounded corners
    width: 45, // Fixed width for each input
    height: 55, // Fixed height for each input
    textAlign: 'center', // Center text in input
    fontSize: 20, // Larger font size for better visibility
    fontWeight: 'bold', // Bold text
    color: '#6A0A0A', // Dark red text color
    shadowColor: '#000', // Shadow color
    //shadowOffset: { width: 0, height: 1 }, // Shadow position
    shadowOpacity: 0.05, // Shadow transparency
    shadowRadius: 3, // Shadow blur radius
    elevation: 2, // Android shadow
  },
  otpInputFocused: {
    borderColor: '#D01313', // Red border when input has value
    shadowColor: '#D01313', // Red shadow when input has value
    //shadowOffset: { width: 0, height: 2 }, // Slightly larger shadow
    shadowOpacity: 0.2, // More visible shadow
    shadowRadius: 4, // Slightly larger blur radius
    elevation: 3, // Android shadow elevation
  },
  buttonContainer: {
    borderRadius: 10, // Rounded corners for button
    overflow: 'hidden', // Clip gradient to rounded corners
    marginBottom: 25, // Space below button
    shadowColor: '#D01313', // Red shadow color
    //shadowOffset: { width: 0, height: 4 }, // Shadow position
    shadowOpacity: 0.3, // Shadow transparency
    shadowRadius: 8, // Shadow blur radius
    elevation: 5, // Android shadow
  },
  gradientButton: {
    padding: 18, // Padding inside button
    alignItems: 'center', // Center text horizontally
    borderRadius: 10, // Rounded corners
  },
  disabledButton: {
    opacity: 0.7, // Dim the button when disabled
  },
  verifyButtonText: {
    color: '#FFFFFF', // White text color
    fontSize: 18, // Button text size
    fontWeight: 'bold', // Bold text
  },
  resendContainer: {
    flexDirection: 'row', // Arrange text and link in a row
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    marginBottom: 30, // Space below resend container
  },
  resendText: {
    color: '#64748B', // Gray text color
    fontSize: 16, // Text size
  },
  resendLink: {
    color: '#D01313', // Red link color
    fontSize: 16, // Link text size
    fontWeight: '600', // Semi-bold weight
  },
  resendLinkDisabled: {
    color: '#ccc', // Light gray when disabled
  },
  backButton: {
    padding: 16, // Padding for back button
    alignItems: 'center', // Center text horizontally
    borderRadius: 10, // Rounded corners
  },
  backButtonText: {
    color: 'gray', // Gray text color
    fontSize: 16, // Text size
    fontWeight: '500', // Medium weight
  },
});

// Export the component for use in other files
export default OTPVerification;