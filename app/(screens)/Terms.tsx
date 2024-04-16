import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants";

type Props = {};

const Terms = (props: Props) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.White }}>
      <ScrollView style={{ paddingHorizontal: 15 }}>
        <View style={styles.container}>
          <Text style={styles.heading}>
            <Text style={styles.bold}>Terms and Conditions</Text>
          </Text>
          <Text>Welcome to Peepal the smart shop!</Text>

          <Text style={styles.paragraph}>
            These terms and conditions outline the rules and regulations for the
            use of Peepal's Website, located at www.peepalshop.shop.
          </Text>

          <Text style={styles.paragraph}>
            By accessing this website we assume you accept these terms and
            conditions. Do not continue to use Peepal the smart shop if you do
            not agree to take all of the terms and conditions stated on this
            page.
          </Text>

          <Text style={styles.paragraph}>
            The following terminology applies to these Terms and Conditions,
            Privacy Statement and Disclaimer Notice and all Agreements:
            "Client", "You" and "Your" refers to you, the person log on this
            website and compliant to the Company's terms and conditions. "The
            Company", "Ourselves", "We", "Our" and "Us", refers to our Company.
            "Party", "Parties", or "Us", refers to both the Client and
            ourselves. All terms refer to the offer, acceptance and
            consideration of payment necessary to undertake the process of our
            assistance to the Client in the most appropriate manner for the
            express purpose of meeting the Client's needs in respect of
            provision of the Company's stated services, in accordance with and
            subject to, prevailing law of in. Any use of the above terminology
            or other words in the singular, plural, capitalization and/or he/she
            or they, are taken as interchangeable and therefore as referring to
            same.
          </Text>

          <Text style={styles.heading}>
            <Text style={styles.bold}>Cookies</Text>
          </Text>
          <Text style={styles.paragraph}>
            We employ the use of cookies. By accessing Peepal the smart shop,
            you agreed to use cookies in agreement with the Peepal's Privacy
            Policy.
          </Text>

          <Text style={styles.paragraph}>
            Most interactive websites use cookies to let us retrieve the user's
            details for each visit. Cookies are used by our website to enable
            the functionality of certain areas to make it easier for people
            visiting our website. Some of our affiliate/advertising partners may
            also use cookies.
          </Text>

          <Text style={styles.heading}>
            <Text style={styles.bold}>License</Text>
          </Text>
          <Text style={styles.paragraph}>
            Unless otherwise stated, Peepal and/or its licensors own the
            intellectual property rights for all material on Peepal the smart
            shop. All intellectual property rights are reserved. You may access
            this from Peepal the smart shop for your own personal use subjected
            to restrictions set in these terms and conditions.
          </Text>

          <Text style={styles.paragraph}>You must not:</Text>
          <Text style={styles.listItem}>
            - Republish material from Peepal the smart shop
          </Text>
          <Text style={styles.listItem}>
            - Sell, rent or sub-license material from Peepal the smart shop
          </Text>
          <Text style={styles.listItem}>
            - Reproduce, duplicate or copy material from Peepal the smart shop
          </Text>
          <Text style={styles.listItem}>
            - Redistribute content from Peepal the smart shop
          </Text>
          {/* Rest of the content follows similar structure */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.White,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "default",
    marginVertical: 10,
    color: Colors.Primary,
  },
  bold: {
    fontWeight: "bold",
    fontFamily: "default",
  },
  paragraph: {
    marginBottom: 10,
    fontFamily: "default",
  },
  listItem: {
    marginLeft: 20,
    fontFamily: "default",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
    fontFamily: "default",
  },
});

export default Terms;
