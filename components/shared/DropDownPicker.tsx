import { Colors, screenWidth } from "@/constants";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Dropdown = ({
  items,
  onselectCategory,
}: {
  items: any;
  onselectCategory: (category: string[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectItem = (itemId: any) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((item) => item !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
      onselectCategory(selectedItems);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>Select Category</Text>
      <View style={{ backgroundColor:Colors.Primary, borderRadius:8 }}>
        <TouchableOpacity
          onPress={toggleDropdown}
          style={styles.dropdownButton}
        >
          <Text style={{ textAlign: "center", fontSize:20, color:Colors.White }}>
            {isOpen ? "Close" : "Open"} Dropdown
          </Text>

        </TouchableOpacity>
        {isOpen && (
          <View style={styles.dropdown}>
            {items.map((item: any) => (
              <TouchableOpacity
                key={item._id}
                style={[
                  styles.item,
                  selectedItems.includes(item._id) && styles.selectedItem,
                ]}
                onPress={() => handleSelectItem(item._id)}
              >
                <Text style={{ textAlign: "center" , fontWeight:"600", fontSize:18}}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: 10,
    gap: 10,
    backgroundColor: Colors.White,
    paddingVertical: 12,
  },
  dropdownButton: {
    padding: 10,
    borderColor: "#ccc",
    backgroundColor:"#2196f3",
    width: screenWidth * 0.9,

  },
  dropdown: {
    marginTop: 10,
    width: screenWidth * 0.9,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontWeight:"600"

  },
  selectedItem: {
    backgroundColor: "#eb3498",
  },
});

export default Dropdown;
