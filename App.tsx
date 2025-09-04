import "./global.css"
import React, { useEffect } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "./src/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import { hydrateSession } from "./src/store/slices/authSlice";

const Stack = createStackNavigator();

function RootNavigation() {
  const dispatch = useDispatch();
  const { token, loading } = useSelector((s: any) => s.auth);

  useEffect(() => {
    dispatch<any>(hydrateSession());
  }, [dispatch]);

  if (loading) {
    return null; // simple splash; could be replaced with branded loader
  }

  return (
    <NavigationContainer>
      <AppNavigator token={token} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
}
