import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreen from "../screens/MapScreen";
import CameraScreen from "../screens/CameraScreen";
import CalendarScreen from "../screens/CalendarScreen";
import PhotosScreen from "../screens/GalleryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AuthStack from "./AuthStack";

const Tab = createBottomTabNavigator();

export default function AppNavigator({ token}: { token: string | null }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: "#0F4C81" },
        headerTintColor: "#ffffff",
        tabBarActiveTintColor: "#14B8A6",
        tabBarStyle: { backgroundColor: "#002F47" },
        headerShown: false,
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          const map: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
            Carte: "map",
            Camera: "camera",
            Calendrier: "calendar",
            Photos: "image-multiple",
            Profile: "account",
            Auth: "login"
          };
          return <MaterialCommunityIcons name={map[route.name]} color={color} size={size} />;
        }
      })}
    >
      <Tab.Screen name="Camera" component={CameraScreen}/>
      <Tab.Screen name="Carte" component={MapScreen} />
      <Tab.Screen name="Photos" component={PhotosScreen} />
      {token && (
        <>
          <Tab.Screen name="Calendrier" component={CalendarScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </>
      )}
      {/* ajouter un onglet auth si user n'est pas connecté */}
      {!token && <Tab.Screen name="Auth" component={AuthStack} options={{ title: "Connexion" }} />}
    </Tab.Navigator>
  );
}
