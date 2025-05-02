import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { id } from 'react-native-paper-dates'
import tw from "tailwind-react-native-classnames";
import { MaterialIcons } from '@expo/vector-icons';
import {Ionicons} from '@expo/vector-icons'
import { Link } from 'expo-router';
 
import ClientList from '../../components/StaticClientData'
 
 
const finance = () => {
  console.log(ClientList);
 
 
 
 
  return (
    <View style={{ flexGrow: 1 }} className="ml-2 mr-2">
      <Text className="text-lg font-semibold mb-2 ">Clients</Text>
 
      <>
        {ClientList.map((ele) => (
          <View
            style={[
              tw`p-3 rounded-lg shadow-lg my-4 w-full`,
              { backgroundColor: "#EBEBEB" },
            ]}
          >
            <TouchableOpacity className="flex-row">
              <Link href={`/(finance)/${ele.id}`}>
                <View className="flex-row items-start">
                  {/* Company Logo */}
                  <Image
                    source={{ uri: ele.companyLogo }}
                    style={{ width: 40, height: 40 }}
                  />
 
                  {/* Company Details */}
                  <View className="ml-3 flex-1">
                    <Text className="text-lg mb-2 font-semibold">
                      {ele.companyName}
                    </Text>
 
                    {/* Values Section */}
                    <View className="flex-row justify-between items-center">
                      {/* PO Value */}
                      <View className="justify-center items-center">
                        <Text className="text-[#00D09E] text-2xl font-bold">
                          |
                        </Text>
                      </View>
                      <View className="items-start">
                        <Text className="text-gray-600">PO value</Text>
                        <Text className="font-semibold text-left">
                          ${ele.PoValue}
                        </Text>
                      </View>
 
                      {/* Divider Bar */}
                      <View className="justify-center items-center">
                        <Text className="text-[#00D09E] text-2xl font-bold">
                          |
                        </Text>
                      </View>
 
                      {/* Predicted GP */}
                      <View className="items-start">
                        <Text className="text-gray-600">Predicted GP</Text>
                        <Text className="font-semibold text-left">
                          ${ele.PredicatedGp}
                        </Text>
                      </View>
 
                      {/* Divider Bar */}
                      <View className="justify-center items-center">
                        <Text className="text-[#00D09E] text-2xl font-bold">
                          |
                        </Text>
                      </View>
 
                      {/* Current GP */}
                      <View className=" items-start">
                        <Text className="text-gray-600">Current GP</Text>
                        <Text className="font-semibold text-left">
                          ${ele.currentGP}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Link>
            </TouchableOpacity>
          </View>
        ))}
      </>
    </View>
  );
}
 
 
 
 
export default finance