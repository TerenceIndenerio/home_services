import * as React from "react";
import { YStack, Text, Input, XStack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";

interface InputFieldProps {
  label: string;
  required?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  placeholder?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  required = false,
  value,
  onChangeText,
  secureTextEntry = false,
  placeholder,
  iconName,
}) => {
  return (
    <YStack width="100%" marginBottom="$4">
      <Text
        fontSize="$4"
        color="$gray11"
        fontWeight="500"
        marginBottom="$1"
      >
        {label}
        {required && <Text color="$purple9" fontWeight="900"> *</Text>}
      </Text>
      <XStack
        alignItems="center"
        borderColor="$gray6"
        borderWidth={1.5}
        borderRadius="$3"
        backgroundColor="$gray2"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={0.04}
        shadowRadius={4}
        elevation={1}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color="$gray10"
            style={{ marginLeft: 12 }}
          />
        )}
        <Input
          flex={1}
          size="$4"
          padding="$3"
          fontSize="$4"
          color="$gray12"
          backgroundColor="transparent"
          borderWidth={0}
          placeholder={placeholder || label}
          placeholderTextColor="$gray8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
      </XStack>
    </YStack>
  );
};

export default InputField;
