import { NavigationContainer } from "@react-navigation/native";
import { MyDispatchContext, MyUserContext } from "./configs/Context";
import Home from "./components/outlines/Home";
import Login from "./components/users/Login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Register from "./components/users/Register";
import { Icon } from "react-native-paper";
import { useReducer } from "react";
import MyUserReducer from "./configs/Reducers";
import Outline from "./components/outlines/Outline";
import OutlineDetails from "./components/outlines/OutlineDetails";
import Profile from "./components/users/Profile";

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="HomeScreen"
    >
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="OutlineDetails" component={OutlineDetails} />
    </Stack.Navigator>
  );
};

const MyTab = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: "Trang chủ",
          tabBarIcon: () => <Icon source="home" size={30} />,
        }}
      />
      <Tab.Screen
        name="Outline"
        component={Outline}
        options={{
          title: "Tạo đề cương",
          tabBarIcon: () => <Icon source="post-outline" size={30} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Tài khoản",
          tabBarIcon: () => <Icon source="account" size={30} />,
        }}
      />
    </Tab.Navigator>
  );
};
const MyStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Main" component={MyTab} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
};

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  return (
    <NavigationContainer>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <MyStack />
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </NavigationContainer>
  );
};
export default App;
