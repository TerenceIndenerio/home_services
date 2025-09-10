import React from "react";
import { View, Text } from "react-native";

type AboutSectionProps = {
  about: string | string[];
};

const AboutSection: React.FC<AboutSectionProps> = ({ about }) => {
  
  const content = Array.isArray(about) ? about.join(" ") : about;

  return (
    <View style={{ marginTop: 10, padding: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
        📄 About
      </Text>
      <Text
        style={{
          fontSize: 16,
          marginTop: 10,
          textAlign: "justify",
        }}
      >
        {"     "}
        {content}
      </Text>
    </View>
  );
};

export default AboutSection;
