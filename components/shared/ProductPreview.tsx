import { ScrollView, Text, View } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Slider } from "@/components";
import { Colors, screenWidth } from "@/constants";
import { getPercentage } from "@/utils";
const Productpage = ({ p }: { p: any }) => {
  // Final UseEffect
  useEffect(() => {
    return () => {};
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        width: screenWidth,
      }}
    >
      <ScrollView
        style={{ width: screenWidth }}
        showsVerticalScrollIndicator={false}
      >
        {/* Product images  */}
        <View
          style={{
            width: screenWidth * 0.98,
            backgroundColor: Colors.White,
            paddingVertical: 5,
          }}
        >
          <Slider
            containerStyle={{ height: 300, padding: 0 }}
            contentStyle={{
              height: 250,
              resizeMode: "contain",
              width: screenWidth * 1,
            }}
            images={p.uri}
            inActiveDotColor="#444"
            infinite={true}
            delay={2000}
            dotColor={Colors.Primary}
          />
        </View>

        {/* product title  */}

        <View style={{ marginTop: 10, alignSelf: "flex-start", padding: 10 }}>
          <Text style={{ fontSize: 28, fontWeight: "600", textAlign: "left" }}>
            {p.title}
          </Text>
        </View>

        {/* Products price  */}

        <View
          style={{
            alignSelf: "flex-start",
            padding: 10,
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
            position: "relative",
          }}
        >
          <Text
            style={{
              fontSize: 28,
              textDecorationLine: "line-through",
              color: "red",
            }}
          >
            {" "}
            ₹{p.o_price}
          </Text>
          <Text style={{ fontSize: 24, color: "green" }}> ₹{p.d_price}</Text>

          <Text
            style={{
              fontSize: 18,
              color: "green",
              marginLeft: 10,
              position: "relative",
              top: -9,
              left: -8,
            }}
          >
            {getPercentage(Number(p?.o_price), Number(p.d_price))}% OFF
          </Text>
        </View>

        {/* Product Description  */}

        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 22, marginBottom: 10 }}>Description</Text>
          <Text style={{ fontSize: 18 }}>{p.description}</Text>
          {/* Extra field Specifications  */}
          {p?.extras && (
            <>
              <Text style={{ fontSize: 22, marginVertical: 10 }}>
                Specifications
              </Text>
              {p.extras.map((item: any, index: number) => (
                <View
                  key={index}
                  style={{
                    marginBottom: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 15,
                    backgroundColor: Colors.White,
                    paddingHorizontal: 10,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{ color: "#444", fontWeight: "600", fontSize: 18 }}
                  >
                    {item.name} :
                  </Text>
                  <Text
                    style={{
                      color: "#000",
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    {item.value}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Productpage;
