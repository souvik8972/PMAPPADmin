import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RetryButton = ({ onRetry, message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        {message || 'Failed to load data. Please try again.'}
      </Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={onRetry}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 160,
    alignItems: 'center',
    shadowColor: '#007AFF',
    //shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default RetryButton;