import { useState } from "react";
import { Button, Modal, Portal, TextInput } from "react-native-paper";
import Styles from "./Styles";

const OutlineEdit = ({ outline, visible, hideModal }) => {
  const containerStyle = { backgroundColor: "white", padding: 20 };

  return (
    <Portal>
      {outline && (
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
          style={Styles.modal}
        >
          <TextInput
            mode="outlined"
            label="Tiêu đề"
            value={outline.title}
            style={Styles.input}
          />
          <TextInput
            mode="outlined"
            label="Nội dung"
            value={outline.content}
            style={Styles.input}
          />
          <TextInput
            mode="outlined"
            label="Tài liệu tham khảo"
            value={outline.resource}
            style={Styles.input}
          />

          <Button></Button>
        </Modal>
      )}
    </Portal>
  );
};

export default OutlineEdit;
