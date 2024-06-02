import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Appbar,
  Button,
  Card,
  Modal,
  Portal,
  Provider,
  Text,
  TextInput,
} from "react-native-paper";
import Styles from "./Styles";
import DropDown from "react-native-paper-dropdown";
import React, { useEffect, useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";

const Outline = () => {
  const [showDropDown, setShowDropDown] = React.useState(false);
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [visible, setVisible] = React.useState(false);
  const [assessments, setAssessments] = useState([]);
  const [method, setMethod] = useState("");
  const [weight, setWeight] = useState("");

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const containerStyle = { backgroundColor: "white", padding: 20 };

  const loadCourse = async () => {
    try {
      let res = await APIs.get(endpoints["courses"]);
      setCourses(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  useEffect(() => {
    loadCourse();
  }, []);

  const courseList = courses.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const richText = React.useRef();

  const handleAddAssessment = () => {
    if (method.trim() && weight.trim()) {
      setAssessments([...assessments, { method, weight: parseInt(weight) }]);
      console.info(assessments);
      setMethod("");
      setWeight("");
    } else {
      alert("Hãy nhập phương thức và tỉ trọng");
    }
  };

  const renderAssessment = ({ item, index }) => (
    <View>
      <TouchableOpacity>
        <Card style={Styles.card}>
          <Card.Content>
            <Text>{index + 1}</Text>
            <Text>Phương thức: {item.method}</Text>
            <Text>Tỉ trọng: {item.weight}%</Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </View>
  );

  return (
    <Provider>
      <Appbar.Header>
        <Appbar.Content title="Thêm đề cương" />
        <Appbar.Action icon="plus" />
      </Appbar.Header>

      <ScrollView style={Styles.container}>
        <KeyboardAvoidingView>
          <Text style={Styles.label}>Môn học</Text>
          <DropDown
            mode={"outlined"}
            visible={showDropDown}
            showDropDown={() => setShowDropDown(true)}
            onDismiss={() => setShowDropDown(false)}
            list={courseList}
            value={course}
            setValue={setCourse}
          />
          <Text style={Styles.label}>Tiêu đề:</Text>
          <TextInput
            mode="outlined"
            placeholder="Nhập tiêu đề của đề cương ở đây..."
          />
          <Text style={Styles.label}>Số tín chỉ:</Text>
          <TextInput
            mode="outlined"
            placeholder="Nhập số tín chỉ..."
            keyboardType="numeric"
          />
          <Text style={Styles.label}>Nội dung:</Text>

          <RichToolbar editor={richText} />
          <RichEditor ref={richText} />
          <Text style={Styles.label}>Đánh giá:</Text>
          <Button onPress={showModal}>Thêm đánh giá</Button>
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={containerStyle}
              style={Styles.modal}
            >
              <TextInput
                mode="outlined"
                label="Phương thức"
                value={method}
                onChangeText={setMethod}
              />
              <TextInput
                mode="outlined"
                label="Tỉ trọng %"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
              <Button onPress={handleAddAssessment}>Thêm</Button>
            </Modal>
          </Portal>
          <SafeAreaView>
            <FlatList
              data={assessments}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderAssessment}
            />
          </SafeAreaView>
          <Text style={Styles.label}>Tài liệu tham khảo:</Text>
          <RichToolbar editor={richText} />
          <RichEditor ref={richText} />
        </KeyboardAvoidingView>
      </ScrollView>
    </Provider>
  );
};
export default Outline;
