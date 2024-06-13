import { useNavigation } from "@react-navigation/native";

const MyUserReducer = (current, action) => {
  switch (action.type) {
    case "login":
      return action.payload;
    case "logout":
      return null;
  }
  return current;
};

export default MyUserReducer;
