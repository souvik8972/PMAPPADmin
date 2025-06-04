import React, { useContext, useEffect, lazy, Suspense } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import { MaterialIcons, Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AuthContext } from "../../context/AuthContext";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Header from "../../components/Header";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";


// Create lazy-loaded components for each screen
const Task = lazy(() => import("./index"));
const Resource = lazy(() => import("../screens/resource"));
const Ticket = lazy(() => import("../screens/ticket"));
const Assets = lazy(() => import("../screens/assets"));
const Food = lazy(() => import("../screens/food"));
const FoodDashboard= lazy(()=> import("./FoodDashboard"));
const Project = lazy(() => import("./project"));
const TimeSheet = lazy(() => import("./timeSheet"));
const Finance = lazy(() => import("./finance"));

const Drawer = createDrawerNavigator();

// Loading component for Suspense fallback
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#D01313" />
  </View>
);

const CustomDrawerContent = (props) => {
  const { user } = useContext(AuthContext);
  const {logout}=useContext(AuthContext)
  const router = useRouter();
  const { state, navigation } = props;
  const isAdmin = user?.userType==5;

  const handleLogout = () => {
    logout()
    router.replace('/login');
  };

  return (
    
    <DrawerContentScrollView style={{}} {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.profileContainer}>
        <Image source={require('../../assets/images/icon.png')} style={styles.profileImage} />
        <Text style={styles.profileName}>Hello, {user?.name || "User"}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}> 
        {props.state.routes.map((route, index) => {
          const isActive = state.index === index;
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={[styles.drawerItem, isActive && styles.activeItem]}
            >
              {isActive ? (
                <LinearGradient
                  colors={["#D01313", "#6A0A0A"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 5 }}
                  style={styles.drawerGradient}
                >
                  {props.descriptors[route.key].options.drawerIcon?.({ color: "white" })}
                  <Text style={styles.drawerActiveText}>{route.name}</Text>
                </LinearGradient>
              ) : (
                <>
                  {props.descriptors[route.key].options.drawerIcon?.({ color: "#333" })}
                  <Text style={styles.drawerText}>{route.name}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.profileSection}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LinearGradient
            colors={["#D01313", "#6A0A0A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoutGradient}
          >
            <Feather name="log-out" size={22} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Image
        source={require('../../assets/images/wave1.png')}
        style={styles.waveImage}
        resizeMode="cover"
      />
    </DrawerContentScrollView>
    
  );
};

export default function DrawerLayout() {

  const { user } = useContext(AuthContext);

  const isSystemAdmin = user?.userType==5;
  const isFoodAdmin=user?.userType==6


  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        header: () => <Header navigation={navigation} />,
        drawerActiveBackgroundColor: "transparent",
        drawerActiveTintColor: "#ffffff",
        drawerInactiveTintColor: "#333",
        drawerLabelStyle: { fontSize: 14,  },
      })}
    >
      {isFoodAdmin ? (
        // Only show Food Dashboard for Food Admin
        <Drawer.Screen 
          name="Food Dashboard" 
          children={() => (
            <Suspense fallback={<LoadingScreen />}>
              <FoodDashboard />
            </Suspense>
          )}
          options={{
            drawerIcon: ({ color }) => (
              <View className="w-9">
                <Ionicons name="fast-food" size={26} color={color} />
              </View>
            ),
          }}
        />
      ) : (
        // Show all other screens for non-Food Admin users
        <>
          <Drawer.Screen 
            name="Resource Allocation" 
            children={() => (
              <Suspense fallback={<LoadingScreen />}>
                <Resource />
              </Suspense>
            )}
            options={{
              drawerIcon: ({ color }) => (
                <View className="w-9">
                  <Feather name="users" size={26} color={color} />
                </View>
              ),
            }}
          />
          
          {!isSystemAdmin && (
            <>
              <Drawer.Screen 
                name="Tasks" 
                children={() => (
                  <Suspense fallback={<LoadingScreen />}>
                    <Task />
                  </Suspense>
                )}
                options={{
                  drawerIcon: ({ color }) => (
                    <View className="w-9">
                      <FontAwesome5 name="calendar-alt" size={26} color={color} />
                    </View>
                  ),
                }}
              />
              
              <Drawer.Screen 
                name="Projects" 
                children={() => (
                  <Suspense fallback={<LoadingScreen />}>
                    <Project />
                  </Suspense>
                )}
                options={{
                  drawerIcon: ({ color }) => (
                    <View className="w-9">
                      <FontAwesome name="tasks" size={26} color={color}/>
                    </View>
                  ),
                }}
              />
            </>
          )}
          
          <Drawer.Screen 
            name="Time Sheet" 
            children={() => (
              <Suspense fallback={<LoadingScreen />}>
                <TimeSheet />
              </Suspense>
            )}
            options={{
              drawerIcon: ({ color }) => (
                <View className="w-9">
                  <MaterialCommunityIcons name="timetable" size={26} color={color} />
                </View>
              ),
            }}
          />
          
          <Drawer.Screen 
            name="Ticket" 
            children={() => (
              <Suspense fallback={<LoadingScreen />}>
                <Ticket />
              </Suspense>
            )}
            options={{
              drawerIcon: ({ color }) => (
                <View className="w-9">
                  <Ionicons name="ticket" size={26} color={color} />
                </View>
              ),
            }}
          />
          
          <Drawer.Screen 
            name="Assets" 
            children={() => (
              <Suspense fallback={<LoadingScreen />}>
                <Assets />
              </Suspense>
            )}
            options={{
              drawerIcon: ({ color }) => (
                <View className="w-9">
                  <FontAwesome5 name="mobile" size={26} color={color} />
                </View>
              ),
            }}
          />
          
          <Drawer.Screen 
            name="Food" 
            children={() => (
              <Suspense fallback={<LoadingScreen />}>
                <Food />
              </Suspense>
            )}
            options={{
              drawerIcon: ({ color }) => (
                <View className="w-9">
                  <Ionicons name="fast-food" size={26} color={color} />
                </View>
              ),
            }}
          />
          
          {/* {isSystemAdmin && (
            <Drawer.Screen 
              name="Food Dashboard" 
              children={() => (
                <Suspense fallback={<LoadingScreen />}>
                  <FoodDashboard />
                </Suspense>
              )}
              options={{
                drawerIcon: ({ color }) => (
                  <View className="w-9">
                    <FontAwesome name="tasks" size={26} color={color}/>
                  </View>
                ),
              }}
            />
          )} */}
          
          {!isSystemAdmin && (
            <Drawer.Screen 
              name="Finance Module" 
              children={() => (
                <Suspense fallback={<LoadingScreen />}>
                  <Finance />
                </Suspense>
              )}
              options={{
                drawerIcon: ({ color }) => (
                  <View className="w-9">
                    <FontAwesome name="money" size={26} color={color} />
                  </View>
                ),
              }}
            />
          )}
        </>
      )}

    </Drawer.Navigator>
  );
}



const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", alignItems: "center" },

  profileSection: {
   
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
  },
  profileContainer: {
   
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'space-between',
    backgroundColor:'white',
  width:"90%",
    marginBottom: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    marginLeft: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  drawerItem: {
    flexDirection: "row",
    // backgroundColor:'red',
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 100,
    marginBottom: 5,
    marginLeft:10,
    // backgroundColor:'red',
     // Ensure left margin is consistent
    width: "100%", // Set a consistent width for both active and inactive items
  },
  
  activeItem: {
    backgroundColor: "transparent",
  margin:0
     // Remove any background that might push it
  },
  
  drawerGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 100,
    marginLeft:-10,
    width: "100%", 
    margin:0
  },
  
  drawerText: {
    fontSize: 16,
    // fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  drawerActiveText: {
    fontSize: 16,
    // fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  logoutButton: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 30,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  waveImage: {
    width: "120%",
    height: 400,  // Adjust height as needed
    position: "absolute",
    objectFit:'cover',
    opacity:1,
    zIndex:-10,
    right:-20,
    bottom: -10,
   
  },
});
