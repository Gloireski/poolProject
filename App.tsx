import "./global.css"
import { Text, View, StyleSheet } from "react-native";
 
export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Let's start our pool project!
      </Text>
      <Text className="text-lg font-semibold text-gray-700"> Key features</Text>
      <Text style={{ color: "gray", fontSize: 14, opacity: 0.8 }}> - Real-time chat</Text>
      <Text style={{ color: "gray", fontSize: 14, opacity: 0.7 }}> - Camera Page </Text>
      <Text style={{ color: "gray", fontSize: 14, opacity: 0.7 }}> - Map Page</Text>
      <Text style={{ color: "gray", fontSize: 14, opacity: 0.7 }}> - Calendar Page</Text>
      <Text style={{ color: "gray", fontSize: 14, opacity: 0.7 }}> - Pictures Page</Text>
      <Text style={{ color: "gray", fontSize: 14, opacity: 0.7 }}> - Profil and Auth Page</Text>
    </View>
  );
}