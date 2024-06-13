import { useContext } from "react";
import { MyDispatchContext, MyUserContext } from "../../configs/Context";
import { FlatList, View } from "react-native";
import { Avatar, Button, Divider, List, Text } from "react-native-paper";
import Styles from "./Styles";

const Profile = ({ navigation }) => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);

  return (
    <View>
      <View style={Styles.profile_banner}>
        <Avatar.Image
          source={{ uri: user.avatar }}
          size={125}
          style={Styles.profile_avatar}
        />
        <Text style={Styles.profile_banner_text}>{user.fullname}</Text>
      </View>
      <View>
        <List.Section>
          <List.Subheader>Thông tin cá nhân</List.Subheader>
          <List.Item
            title={user.username}
            left={(props) => <List.Icon {...props} icon="text-account" />}
          />
          <Text variant="bodySmall" style={Styles.profile_info_label}>
            Username
          </Text>
          <Divider />
          <List.Item
            title={user.email}
            left={(props) => <List.Icon {...props} icon="email" />}
          />
          <Text variant="bodySmall" style={Styles.profile_info_label}>
            Email
          </Text>
        </List.Section>
        <Divider />
        <Button
          icon="logout"
          onPress={() => {
            dispatch({ type: "logout" }), navigation.navigate("Login");
          }}
          style={{ marginTop: "3%" }}
          textColor="red"
        >
          Đăng xuất
        </Button>
      </View>
    </View>
  );
};

export default Profile;
