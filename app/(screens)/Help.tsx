import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants";
import * as Linking from "expo-linking";

type Props = {};

const Help = (props: Props) => {
  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
      <ScrollView
        style={{ paddingHorizontal: 15 }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <Text
          style={{
            fontSize: 25,
            fontFamily: "default",
            marginBottom: 20,
            color: Colors.Primary,
          }}
        >
          Our Privacy Policy
        </Text>

        {/* Sub Description  */}
        <Text
          style={{
            marginVertical: 10,
            textAlign: "center",
            fontFamily: "default",
          }}
        >
          We take your privacy seriously. This policy describes what personal
          information we collect and how we use it. We retain your personal data
          in accordance with applicable laws, for a period no longer than is
          required for the purpose for which it was collected or as required
          under any applicable law. However, we may retain data related to you
          if we believe it may be necessary to prevent fraud or future abuse, to
          enable Peepal to exercise its legal rights and/or defend against legal
          claims or if required by law or We may continue to retain your data in
          anonymised form for analytical and research purposes
        </Text>

        <Text
          style={{
            marginVertical: 10,
            textAlign: "center",
            fontFamily: "default",
          }}
        >
          We take every reasonable step to ensure that your personal data that
          we process is accurate and, where necessary, kept up to date, and any
          of your personal data that we process that you inform us is inaccurate
          (having regard to the purposes for which they are processed) is erased
          or rectified. You may access, correct, and update your personal data
          directly through the functionalities provided on the Platform. You may
          delete certain non- mandatory information by logging into our website
          and visiting Profile and Settings sections. You can also write to us
          at the contact information provided below to assist you with these
          requests.
        </Text>

        <Text
          style={{
            textAlign: "center",
            fontFamily: "default",
            marginBottom: 15,
          }}
        >
          You have an option to withdraw your consent that you have already
          provided by writing to us at the contact information provided below.
          Please mention "for withdrawal of consent" in the subject line of your
          communication. We will verify such requests before acting upon your
          request. Please note, however, that withdrawal of consent will not be
          retroactive and will be in accordance with the terms of this Privacy
          Policy, related Terms of Use and applicable laws. In the event you
          withdraw consent given to us under this Privacy
        </Text>

        <Text
          style={{
            fontFamily: "default",
            color: Colors.Primary,
            fontWeight: "800",
          }}
        >
          Mail us for any query
        </Text>

        <TouchableOpacity
          onPress={() => Linking.openURL("mailto:peepalhelpdesk@gmail.com")}
        >
          <Text
            style={{
              marginVertical: 10,
              fontFamily: "default",
              textDecorationLine: "underline",
            }}
          >
            peepalhelpdesk@gmail.com
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Help;
