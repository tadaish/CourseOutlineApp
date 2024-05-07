import { Text, View } from "react-native";
import MyStyles from "../../styles/MyStyles";

const Course = () => {
  return (
    <View style={MyStyles.containter}>
      <Text style={MyStyles.subject}>Danh mục khoá học</Text>
    </View>
  );
};

export default Course;
