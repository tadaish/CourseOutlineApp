import { Appbar, Text } from "react-native-paper";
import APIs, { endpoints } from "../../configs/APIs";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

const OutlineDetails = ({ route }) => {
  const outlineId = route.params?.outlineId;
  const [outline, setOutline] = useState(null);
  const [courses, setCourses] = useState(null);

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

  useEffect(() => {
    loadOutline();
    loadCourses();
  }, [outlineId]);

  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title={"Đề cương chi tiết"} />
        <Appbar.Action icon="content-save" color="blue" />
        <Appbar.Action icon="delete" color="red" />
      </Appbar.Header>
      <ScrollView></ScrollView>
    </View>
  );
};

export default OutlineDetails;
