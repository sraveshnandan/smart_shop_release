import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Categories, Colors } from "@/constants";

const ScreenWidth = Dimensions.get("screen").width;
const CategorySection = () => {
  const [activeindex, setActiveindex] = useState<number>(0);
  return (
    <View style={styles.categorySectionContainer}>
      {/* Section Heading  */}
      <Text
        style={{
          textAlign: "center",
          marginVertical: 25,
          marginLeft: 8,
          fontSize: 25,
        }}
      >
        Categories
      </Text>
      {/* Category Box  */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
        style={styles.categoryBox}
      >
        {Categories &&
          Categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveindex(index)}
              style={[
                styles.categoryImg,
                activeindex === index && {
                  borderWidth: 2,
                  borderColor: Colors.Primary,
                },
              ]}
            >
              <Image
                style={{ width: 60, height: 60 }}
                source={{ uri: item.icon }}
              />
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

export default CategorySection;

const styles = StyleSheet.create({
  categorySectionContainer: {
    width: ScreenWidth,
  },
  categoryBox: {
    paddingLeft: 10,
  },
  categoryImg: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.White,
    gap: 5,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
