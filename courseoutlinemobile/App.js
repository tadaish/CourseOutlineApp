import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Course from "./components/courses/Course";
import Login from "./components/users/Login";
import Register from "./components/users/Register";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
