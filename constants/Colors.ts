import { Dimensions } from "react-native";

const Colors = {
  Primary: "#f249dc",
  Bg: "#06142f",
  DarkBg: "#000",
  LightBg: "#e5e5e6",
  CardBg: "#f5f5f6",
  White: "#ffffff",
  Link: "#0ab4c1",
};

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;
export {Colors, screenHeight, screenWidth}