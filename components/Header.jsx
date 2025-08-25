import { View, Text, Image, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from '@/context/AuthContext';
import { Platform } from 'react-native';

const Header = ({ navigation }) => { // ✅ Receive navigation prop
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const {logout} = useContext(AuthContext);
  const [userName, setUserName] = useState("Guest");
  const {user} = useContext(AuthContext);

  useEffect(() => {  
    setUserName(user.name);
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true); // Show loader
    try {
      await logout(); // Call the logout function from AuthContext
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
      setModalVisible(false);
      router.replace('/login'); // Navigate to login screen
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-row pt-0 justify-between items-center bg-white">
      {/* Hamburger Menu */}
      {user.userType == 3 ? (
        <View className="flex-row w-full p-4 pt-0 pb-0 justify-between items-center">
          {/* Left Logo */}
          <Image source={require('../assets/images/icon.png')} className="w-14 h-14" resizeMode="contain" />
          
          {/* Right Profile Image */}
          <TouchableOpacity className="py-3 flex flex-row items-center" onPress={() => setModalVisible(true)}>
            <Text className="text-[20px] mr-2 font-bold capitalize ">Hello {userName}</Text>
            <Image source={require('../assets/images/Avatar.png')} className="w-12 h-12" resizeMode="contain" />
          </TouchableOpacity>
        </View>
      ) : (
        <View className='flex-row w-full p-4 pl-0 justify-between items-center'>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()} className="p-2"> 
            <Ionicons name="menu" size={28} color="black" />
          </TouchableOpacity>

          {/* Right Profile Image */}
          <TouchableOpacity className="flex flex-row items-center" onPress={() => setModalVisible(true)}>
            <Text className="text-[20px] mr-2 font-bold">Hello {userName}</Text>
            <Image source={require('../assets/images/Avatar.png')} className="w-12 h-12" resizeMode="contain" />
          </TouchableOpacity>
        </View>
      )}

      {/* Modal */}
      <Modal animationType="fade" transparent={true} visible={isModalVisible} onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-80 items-center">
            <Text className="text-xl font-bold mb-6">Hello, {userName}</Text>
            
            <TouchableOpacity 
              onPress={handleLogout} 
              className="w-full rounded-full overflow-hidden"
              disabled={isLoggingOut} // Disable button while logging out
            >
              <LinearGradient
                colors={['#D01313', '#6A0A0A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 30 }}
              >
                {isLoggingOut ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Feather name="log-out" size={22} color="white" style={{ marginRight: 8 }} />
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Logout</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity 
              onPress={() => setModalVisible(false)} 
              className="mt-4"
              disabled={isLoggingOut} // Disable button while logging out
            >
              <Text style={{fontSize: 18}} className="text-gray-400 p-2 rounded-2xl">
                {isLoggingOut ? "Logging out..." : "Cancel"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Header;