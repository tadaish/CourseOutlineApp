import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import Styles from "./Styles";

const Login = ({ navigation }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <>
      <View style={Styles.login_container}>
        <Text style={Styles.label}>Đăng nhập</Text>
        <TextInput
          style={Styles.input}
          mode="outlined"
          underlineColor="transparent"
          label="Username"
          value={username}
          onChangeText={(username) => setUsername(username)}
        />
        <TextInput
          style={Styles.input}
          mode="outlined"
          underlineColor="transparent"
          label="Password"
          value={password}
          onChangeText={(password) => setPassword(password)}
          secureTextEntry
        />
        <Button
          style={Styles.button}
          mode="contained"
          onPress={() => console.log("Đăng nhập")}
        >
          Đăng nhập
        </Button>
        <View style={Styles.row}>
          <Text>Không có tài khoản?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={Styles.link}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Login;
