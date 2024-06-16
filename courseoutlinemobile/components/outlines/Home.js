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
import { useIsFocused } from "@react-navigation/native";

const Home = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [outlines, setOutlines] = useState([]);
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState("");
  const user = useContext(MyUserContext);
  const userId = user.id;
  const isFocus = useIsFocused();

  const loadOutlines = async () => {
    try {
      let url = `${endpoints["get_outlines"](userId)}?q=${q}`;
      let res = await APIs.get(url);

      setOutlines(res.data);
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
    loadOutlines();
    loadCourses();
  }, [refreshing, q, isFocus]);

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

        {!outlines ? (
          <Text>Chưa có đề cương nào...</Text>
        ) : (
          <View style={Styles.outline_container}>
            <View>
              <Searchbar
                placeholder="Nhập tên đề cương..."
                onChangeText={(t) => search(t, setQ)}
              />
            </View>
            {outlines.map((o) => (
              <TouchableOpacity key={o.id}>
                <View>
                  {(() => {
                    const course = courses.find((c) => c.id === o.course);
                    if (!course) return false;
                    return (
                      <Card
                        style={Styles.card}
                        mode="outlined"
                        onPress={() =>
                          navigation.navigate("OutlineDetails", {
                            outlineId: o.id,
                          })
                        }
                      >
                        <Card.Title title={course.name} />
                        <Card.Content>
                          <Text>Khoa: {course.category.name}</Text>
                          <Text>Phương thức: {course.delivery_mode}</Text>
                          <Text>Học kỳ: {course.term}</Text>
                        </Card.Content>
                      </Card>
                    );
                  })()}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};
export default Home;
