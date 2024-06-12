import { useCallback, useContext, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Appbar, Card, Icon, Searchbar, Text } from "react-native-paper";
import APIs, { endpoints } from "../../configs/APIs";
import { MyUserContext } from "../../configs/Context";
import Styles from "./Styles";

const Home = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [outline, setOutline] = useState([]);
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState("");
  const user = useContext(MyUserContext);
  const userId = user.id;

  const loadOutline = async () => {
    try {
      let url = `${endpoints["get_outlines"](userId)}?q=${q}`;
      let res = await APIs.get(url);

      setOutline(res.data);
    } catch (ex) {
      console.error(ex.response.data);
    }
  };

  const loadCourses = async () => {
    try {
      let res = await APIs.get(endpoints["courses"]);

      setCourses(res.data);
    } catch (ex) {
      console.error(ex.response.data);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const search = (value, callback) => {
    callback(value);
  };

  useEffect(() => {
    loadOutline();
    loadCourses();
  }, [refreshing, q]);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Trang chủ" />
      </Appbar.Header>
      <ScrollView
        style={Styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Text style={Styles.home_label}>
            Chào mừng trở lại {user.fullname}
          </Text>
          <Icon source="hand-wave-outline" size={30} />
        </View>
        <View>
          <Searchbar
            placeholder="Nhập tên đề cương..."
            onChangeText={(t) => search(t, setQ)}
          />
        </View>
        {outline === null ? (
          <Text>Chưa có đề cương nào...</Text>
        ) : (
          <View style={Styles.outline_container}>
            {outline.map((o) => (
              <TouchableOpacity key={o.id}>
                <Card
                  style={Styles.card}
                  mode="outlined"
                  onPress={() =>
                    navigation.navigate("OutlineDetails", {
                      outlineId: o.id,
                    })
                  }
                >
                  <Card.Title title={o.title} />
                  <Card.Content>
                    <Text>
                      Môn: {courses.find((c) => c.id === o.course).name}
                    </Text>
                    <Text>
                      Khoa:{" "}
                      {courses.find((c) => c.id === o.course).category.name}
                    </Text>
                    <Text>Số tín chỉ: {o.credit} </Text>

                    <Text>
                      Học kỳ: {courses.find((c) => c.id === o.course).term}
                    </Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};
export default Home;
