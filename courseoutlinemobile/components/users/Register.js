import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Avatar, Button, Provider, TextInput } from "react-native-paper";
import Styles from "./Styles";
import DropDown from "react-native-paper-dropdown";
import * as ImagePicker from "expo-image-picker";

const Register = ({ navigation }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPass, setConfirmPass] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [fullname, setFullname] = React.useState("");
  const [showDropDown, setShowDropDown] = React.useState(false);
  const [role, setRole] = React.useState(null);
  const [avatar, setAvatar] = React.useState(null);

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

  return (
    <Provider>
      <View style={Styles.register_container}>
        <TouchableOpacity style={Styles.label} onPress={pickAvatar}>
          {!avatar ? (
            <Avatar.Icon size={100} icon="account" />
          ) : (
            <Avatar.Image size={100} source={{ uri: avatar }} />
          )}
        </TouchableOpacity>
        <TextInput
          style={Styles.input}
          mode="outlined"
          underlineColor="transparent"
          label="Họ tên"
          value={fullname}
          onChangeText={(fullname) => setFullname(fullname)}
        />
        <TextInput
          style={Styles.input}
          mode="outlined"
          underlineColor="transparent"
          label="Email"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          style={Styles.input}
          mode="outlined"
          underlineColor="transparent"
          label="Tên người dùng"
          value={username}
          onChangeText={(username) => setUsername(username)}
        />
        <TextInput
          style={Styles.input}
          mode="outlined"
          underlineColor="transparent"
          label="Mật khẩu"
          value={password}
          onChangeText={(password) => setPassword(password)}
          secureTextEntry
        />
        <TextInput
          style={Styles.input}
          mode="outlined"
          underlineColor="transparent"
          label="Nhập lại mật khẩu"
          value={confirmPass}
          onChangeText={(confirmPass) => setConfirmPass(confirmPass)}
          secureTextEntry
        />

        <View style={Styles.input}>
          <DropDown
            label={"Vai trò"}
            mode={"outlined"}
            visible={showDropDown}
            showDropDown={() => setShowDropDown(true)}
            onDismiss={() => setShowDropDown(false)}
            value={role}
            setValue={setRole}
            list={roleList}
          />
        </View>

        <Button
          style={Styles.button}
          mode="contained"
          onPress={() => console.log("Đăng ký")}
        >
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
