import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Appbar,
  Button,
  Card,
  HelperText,
  Modal,
  Portal,
  Provider,
  Text,
  TextInput,
} from "react-native-paper";
import Styles from "./Styles";
import DropDown from "react-native-paper-dropdown";
import React, { useEffect, useState } from "react";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Outline = () => {
  const [showDropDown, setShowDropDown] = React.useState(false);
  const [courses, setCourses] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const [assessments, setAssessments] = useState([]);
  const [method, setMethod] = useState("");
  const [weight, setWeight] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [outline, setOutline] = useState({
    course: "",
    title: "",
    content: "",
    assessments: [],
    resource: "",
  });
  const [error, setError] = useState("");

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

  const addOutline = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      let res = await authApi(token).post(endpoints["add_outline"], outline);
      if (res.status === 201) {
        Alert.alert("Thành công", "Thêm đề cương thành công");
      }
    } catch (ex) {
      setError(ex.response.data);
      console.error(ex.response.data);
    }
  };
  useEffect(() => {
    loadCourse();
  }, []);

  //cập nhật field assessments trong outline mỗi khi assessmnents thay đổi
  useEffect(() => {
    setOutline((field) => ({ ...field, assessments: assessments }));
  }, [assessments]);

  const courseList = courses.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const richText = React.useRef();

  const handleAddOrEditAssessment = () => {
    if (method.trim() && weight.trim()) {
      if (isEdit && editingIndex !== null) {
        const updatedAssessment = assessments.map((item, index) =>
          index === editingIndex ? { method, weight: parseInt(weight) } : item
        );
        setAssessments(updatedAssessment);
        setEditingIndex(null);
        setIsEdit(false);
        hideModal();
      } else {
        setAssessments([...assessments, { method, weight: parseInt(weight) }]);
        hideModal();
      }

      setMethod("");
      setWeight("");
    } else {
      alert("Hãy nhập phương thức và tỉ trọng");
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setIsEdit(true);
    setMethod(assessments[index].method);
    setWeight(assessments[index].weight.toString());
    showModal();
  };

  const handleShowModal = () => {
    setIsEdit(false);
    setWeight("");
    setMethod("");
    showModal();
  };

  const handleDelete = () => {
    const updatedAssessment = [...assessments];
    updatedAssessment.splice(editingIndex, 1);
    setAssessments(updatedAssessment);
    setIsEdit(false);
    hideModal();
  };

  const change = (field, value) => {
    setOutline((current) => {
      return { ...current, [field]: value };
    });
  };

  return (
    <Provider>
      <Appbar.Header>
        <Appbar.Content title="Thêm đề cương" />
        <Appbar.Action icon="plus" onPress={addOutline} />
      </Appbar.Header>

      <ScrollView style={Styles.container}>
        <KeyboardAvoidingView>
          <Text style={Styles.label}>Môn học</Text>
          <DropDown
            mode={"outlined"}
            placeholder="Chọn môn học"
            visible={showDropDown}
            showDropDown={() => setShowDropDown(true)}
            onDismiss={() => setShowDropDown(false)}
            list={courseList}
            value={outline.course}
            setValue={(e) => change(["course"], e)}
          />
          <Text style={Styles.label}>Tiêu đề:</Text>
          <TextInput
            mode="outlined"
            placeholder="Nhập tiêu đề của đề cương ở đây..."
            value={outline["title"]}
            onChangeText={(e) => change(["title"], e)}
            key="title"
            error={!!error["title"]}
          />
          <HelperText type="error" visible={!!error["title"]}>
            Tiêu đề không được để trống !
          </HelperText>
          <Text style={Styles.label}>Nội dung:</Text>
          <RichToolbar editor={richText} />
          <RichEditor ref={richText} onChange={(e) => change(["content"], e)} />
          <HelperText type="error" visible={!!error["content"]}>
            Nội dung không được bỏ trống !
          </HelperText>
          <Text style={Styles.label}>Đánh giá:</Text>
          <HelperText type="error" visible={!!error["assessments"]}>
            {error["assessments"]}
          </HelperText>
          <Button onPress={handleShowModal}>Thêm đánh giá</Button>
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
                style={Styles.input}
              />
              <TextInput
                mode="outlined"
                label="Tỉ trọng %"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                style={Styles.input}
              />
              <Button onPress={handleAddOrEditAssessment}>
                {isEdit ? "Sửa" : "Thêm"}
              </Button>
              {isEdit && (
                <Button textColor="red" onPress={handleDelete}>
                  Xoá
                </Button>
              )}
            </Modal>
          </Portal>
          {assessments.map((item, index) => (
            <View key={index}>
              <TouchableOpacity onPress={() => handleEdit(index)}>
                <Card style={Styles.card} mode="outlined">
                  <Card.Content>
                    <Text>{index + 1}</Text>
                    <Text>Phương thức: {item.method}</Text>
                    <Text>Tỉ trọng: {item.weight}%</Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            </View>
          ))}
          <Text style={Styles.label}>Tài liệu tham khảo:</Text>
          <RichToolbar editor={richText} />
          <RichEditor
            ref={richText}
            onChange={(e) => change(["resource"], e)}
          />
          <HelperText type="error" visible={!!error["resource"]}>
            Tài liệu tham khảo không được bỏ trống !
          </HelperText>
        </KeyboardAvoidingView>
      </ScrollView>
    </Provider>
  );
};
export default Outline;
