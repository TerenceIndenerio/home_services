import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { loginStyles } from "../../../../src/styles/loginStyles";

interface SocialLoginProps {
  socialIcons: {
    id: string;
    url: string;
    onPress: () => void;
  }[];
}

const SocialLogin: React.FC<SocialLoginProps> = ({ socialIcons }) => {
  return (
    <View style={loginStyles.socialContainer}>
      <View style={loginStyles.dividerContainer}>
        <View style={loginStyles.leftDivider}>
          <View style={loginStyles.dividerLine} />
        </View>
        <View>
          <Text style={loginStyles.dividerText}>or login with</Text>
        </View>
        <View style={loginStyles.rightDivider}>
          <View style={loginStyles.dividerLine} />
        </View>
      </View>
      <View style={loginStyles.socialIconsContainer}>
        {socialIcons.map((icon) => (
          <TouchableOpacity key={icon.id} onPress={icon.onPress}>
            <View style={loginStyles.socialIconWrapper}>
              <Image
                source={{ uri: icon.url }}
                style={loginStyles.socialIcon}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SocialLogin;
