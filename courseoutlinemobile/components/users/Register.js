import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  Avatar,
  Button,
  HelperText,
  Provider,
  TextInput,
} from "react-native-paper";
import Styles from "./Styles";
import DropDown from "react-native-paper-dropdown";
import * as ImagePicker from "expo-image-picker";
import APIs, { endpoints } from "../../configs/APIs";

const Register = ({ navigation }) => {
  const [user, setUser] = React.useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    confirmPass: "",
    role: "",
  });
  const [showDropDown, setShowDropDown] = React.useState(false);
  const [avatar, setAvatar] = React.useState(null);
  const [error, setError] = React.useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    role: "",
  });

  const change = (e, field) => {
    setUser((current) => {
      return { ...current, [field]: e.target.value };
    });
  };

  const roleList = [
    {
      label: "Giảng viên",
      value: "giảng viên",
    },
    {
      label: "Sinh viên",
      value: "sinh viên",
    },
  ];

  const pickAvatar = async () => {
    let avatar = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    console.log(avatar);

    if (!avatar.canceled) {
      setAvatar(avatar.assets[0].uri);
    }
  };
  const validate = () => {
    if (!user.fullname) setError(fullname, "Họ tên không được bỏ trống !");
    if (!user.username)
      setError(username, "Tên người dùng không được bỏ trống !");
    if (!user.email) setError(email, "Email không được bỏ trống !");
    if (user.password !== user.confirmPass)
      setError(password, "Mật khẩu không khớp");

    if (error) return true;
    else {
      return false;
    }
  };

  const register = () => {
    const process = async () => {
      let formData = new FormData();
      for (let field in user) formData.append(field, user[field]);

      formData.append("avatar", avatar.assets[0]);

      let res = await APIs.post(endpoints["register"], formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) navigation.navigate("Login");

      if (validate) return false;
      else {
        console.log(res);
      }
    };
    if (user.password !== user.confirmPass)
      setError(password, "Mật khẩu không khớp");
    else {
      process();
    }
  };

  return (
    <Provider>
      <View style={Styles.register_container}>
        <TouchableOpacity style={Styles.register_avatar} onPress={pickAvatar}>
          {!avatar ? (
            <Avatar.Icon size={100} icon="account" />
          ) : (
            <Avatar.Image size={100} source={{ uri: avatar }} />
          )}
          <Text style={{ marginTop: "2%" }}> Chọn avatar </Text>
        </TouchableOpacity>
        <TextInput
          style={Styles.input}
          mode="outlined"
          underlineColor="transparent"
          label="Họ tên"
          value={user.fullname}
          onChangeText={(e) => change(e, "fullname")}
        />
        <HelperText type="error">{error.fullname}</HelperText>
        <TextInput
          style={Styles.input}
          mode="outlined"
          underlineColor="transparent"
          label="Email"
          value={user.email}
          onChangeText={(e) => change(e, "email")}
        />
        <HelperText type="error">{error.email}</HelperText>
        <TextInput
          style={Styles.input}
          mode="outlined"
          underlineColor="transparent"
          label="Tên người dùng"
          value={user.username}
          onChangeText={(e) => change(e, "username")}
        />
        <HelperText type="error">{error.username}</HelperText>
        <TextInput
          style={Styles.input}
          mode="outlined"
          underlineColor="transparent"
          label="Mật khẩu"
          value={user.password}
          onChangeText={(e) => change(e, "password")}
          secureTextEntry
        />
        <HelperText type="error">{error.password}</HelperText>
        <TextInput
          style={Styles.input}
          mode="outlined"
          underlineColor="transparent"
          label="Nhập lại mật khẩu"
          value={user.confirmPass}
          onChangeText={(e) => change(e, "confirmPass")}
          secureTextEntry
        />
        <HelperText type="error">{error.password}</HelperText>
        <View style={Styles.input}>
          <DropDown
            label={"Vai trò"}
            mode={"outlined"}
            visible={showDropDown}
            showDropDown={() => setShowDropDown(true)}
            onDismiss={() => setShowDropDown(false)}
            value={user.role}
            setValue={(e) => change(e, "role")}
            list={roleList}
          />
        </View>

        <Button style={Styles.button} mode="contained" onPress={register}>
          Đăng ký
        </Button>
        <View style={Styles.row}>
          <Text>Đã có tài khoản?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={Styles.link}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Provider>
  );
};

export default Register;
