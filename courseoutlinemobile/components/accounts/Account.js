import { useContext } from "react";
import { Avatar, Text } from "react-native-paper";
import { MyUserContext } from "../../configs/Context";
import { View } from "react-native";

const Account = () => {
  const user = useContext(MyUserContext);
  return (
    <View>
      <Avatar.Image source={{ uri: user.avatar }} />
    </View>
  );
};
export default Account;
