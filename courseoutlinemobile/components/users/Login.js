import React, { useContext, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import Styles from "./Styles";
import APIs, { authApi, endpoints } from "../../configs/APIs";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyDispatchContext } from "../../configs/Context";

const Login = ({ navigation }) => {
  const fields = [
    {
      label: "Tên đăng nhập",
      field: "username",
    },
    {
      label: "Mật khẩu",
      field: "password",
      secureTextEntry: true,
    },
  ];
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useContext(MyDispatchContext);

  const change = (field, value) => {
    setUser((current) => {
      return { ...current, [field]: value };
    });
  };

  const login = async () => {
    setLoading(true);
    try {
      let res = await APIs.post(
        endpoints["login"],
        {
          ...user,
          client_id: "0Rmo2Z6BKXWl3VGFfCIeXEQ4mqsf7kXTSDESoLSA",
          client_secret:
            "SX36IOJbJxARReQZvjmbYsN19q1T9psV1xK0pNx7NRqDIPrzK5WS7M60DsKE6QZXtHtCuEDKaRVYGGejvpCXfS7RnikuWUTkdQ5o6x3jgrTR4d3Ir2G5ZlwyEMZ3lRFu",
          grant_type: "password",
        },
        {
          //oauth2 can body dang x-www-form-urlencoded nhung axios lai chuyen dang json nen can chuyen lai
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.info(res.data);
      AsyncStorage.setItem("token", res.data.access_token);
      setTimeout(async () => {
        let user = await authApi(res.data.access_token).get(
          endpoints["current_user"]
        );
        console.info(user.data);
        try {
          dispatch({
            type: "login",
            payload: user.data,
          });
        } catch (error) {
          console.error(error);
        }

        navigation.navigate("Main");
      }, 100);
    } catch (ex) {
      console.error(ex.response.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={Styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }
  return (
    <>
      <View style={Styles.login_container}>
        <Text style={Styles.label}>Đăng nhập</Text>
        {fields.map((f) => (
          <TextInput
            value={user[f.field]}
            onChangeText={(t) => change(f.field, t)}
            key={f.field}
            style={Styles.input}
            label={f.label}
            secureTextEntry={f.secureTextEntry}
          />
        ))}
        <Button style={Styles.button} mode="contained" onPress={login}>
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
