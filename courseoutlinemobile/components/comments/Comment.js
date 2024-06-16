import { useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

const Comment = () => {
  const [comments, setComments] = useState(null);

  return (
    <View>
      {!comments ? (
        <Text>Chưa có comment nào !</Text>
      ) : (
        <Text>Comments list here !</Text>
      )}
    </View>
  );
};

export default Comment;
