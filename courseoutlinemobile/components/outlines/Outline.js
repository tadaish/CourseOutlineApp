import { View } from "react-native";
import { Appbar, Icon, Searchbar, Text } from "react-native-paper";

const Outline = () => {
  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title="Trang chủ" />
        <Appbar.Action icon="plus" />
      </Appbar.Header>
      <Text>Hiện tại chưa có đề cương</Text>
    </View>
  );
};
export default Outline;
