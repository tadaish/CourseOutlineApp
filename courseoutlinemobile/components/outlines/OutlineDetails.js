import { Appbar, Card, List, Provider, Text } from "react-native-paper";
import APIs, { endpoints } from "../../configs/APIs";
import { useContext, useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import Styles from "./Styles";
import { MyUserContext } from "../../configs/Context";
import RenderHTML from "react-native-render-html";
import Comment from "../comments/Comment";

const OutlineDetails = ({ route, navigation }) => {
  const outlineId = route.params?.outlineId;
  const [outline, setOutline] = useState(null);
  const [courses, setCourses] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [visible, setVisible] = useState(false);
  const user = useContext(MyUserContext);

  const handlePress = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const loadOutline = async () => {
    try {
      let res = await APIs.get(endpoints["outline_details"](outlineId));
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

  const deleteOutline = async () => {
    try {
      let res = await APIs.delete(endpoints["outline_details"](outlineId));
      if (res.status === 204) {
        Alert.alert("Thành công", "Xoá đề cương thành công!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("HomeScreen"),
          },
        ]);
      }
    } catch (ex) {
      console.error(ex.response.data);
    }
  };
  useEffect(() => {
    loadOutline();
    loadCourses();
  }, [outlineId]);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <Provider>
      <View style={{ flex: 1 }}>
        <Appbar.Header>
          <Appbar.Content title={"Đề cương chi tiết"} />

          <Appbar.Action icon="delete" color="red" onPress={deleteOutline} />
        </Appbar.Header>

        <ScrollView style={Styles.details_container}>
          {outline && courses && (
            <View>
              <Text variant="headlineMedium" style={Styles.details_title}>
                {outline.title}
              </Text>
              <Card mode="outlined">
                <Card.Title
                  title="Thông tin tổng quát"
                  titleStyle={{ fontWeight: "bold" }}
                />
                <Card.Content style={{ gap: 10 }}>
                  {(() => {
                    const course = courses.find((c) => c.id === outline.course);
                    return (
                      <>
                        <Text>Môn: {course.name}</Text>
                        <Text>Khoa: {course.category.name}</Text>
                        <Text>
                          Phương thức giảng dạy: {course.delivery_mode}
                        </Text>
                        <Text>Số tín chỉ: {course.credit}</Text>
                        <Text>Học kỳ: {course.term}</Text>
                      </>
                    );
                  })()}
                </Card.Content>
              </Card>
              <List.Section style={{ marginTop: "5%" }}>
                <List.Accordion
                  key={1}
                  title="Thông tin môn học"
                  expanded={expandedIndex === 1}
                  onPress={() => handlePress(1)}
                >
                  <List.Item
                    title="Thông tin môn học"
                    titleStyle={{ fontWeight: "semibold", fontSize: 25 }}
                  />
                  <View style={{ marginLeft: "5%", marginBottom: "5%" }}>
                    <RenderHTML
                      source={{ html: outline.content }}
                      contentWidth={650}
                    />
                  </View>
                </List.Accordion>
                <List.Accordion
                  key={2}
                  title="Đánh giá môn học"
                  expanded={expandedIndex === 2}
                  onPress={() => handlePress(2)}
                >
                  {outline.assessments.map((a) => (
                    <List.Item
                      key={a.id}
                      title={`Phương thức đánh giá: ${a.method}`}
                      description={`Tỉ trọng: ${a.weight}%`}
                    />
                  ))}
                </List.Accordion>
                <List.Accordion
                  key={3}
                  title="Tài liệu tham khảo"
                  expanded={expandedIndex === 3}
                  onPress={() => handlePress(3)}
                >
                  <List.Item
                    title="Tài liệu tham khảo"
                    titleStyle={{ fontWeight: "semibold", fontSize: 25 }}
                  />
                  <View style={{ marginLeft: "5%", marginBottom: "5%" }}>
                    <RenderHTML
                      source={{ html: outline.resource }}
                      contentWidth={650}
                    />
                  </View>
                </List.Accordion>
                <List.Accordion
                  key={4}
                  title="Thông tin giảng viên"
                  expanded={expandedIndex === 4}
                  onPress={() => handlePress(4)}
                >
                  <List.Item title="Chức vụ" description="Giảng viên" />
                  <List.Item title="Họ tên" description={user.fullname} />
                  <List.Item title="Email" description={user.email} />
                </List.Accordion>
              </List.Section>
            </View>
          )}
          <View style={{ marginTop: "5%" }}>
            <Text variant="titleLarge">Nhận xét</Text>
            <Comment />
          </View>
        </ScrollView>
      </View>
    </Provider>
  );
};

export default OutlineDetails;
