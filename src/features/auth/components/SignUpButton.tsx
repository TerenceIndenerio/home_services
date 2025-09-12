import * as React from "react";
import { Button } from "tamagui";

interface SignUpButtonProps {
  title: string;
  onPress: () => void;
}

const SignUpButton: React.FC<SignUpButtonProps> = ({ title, onPress }) => {
  return (
    <Button
      size="$5"
      theme="purple"
      backgroundColor="$purple9"
      color="$background"
      fontWeight="700"
      fontSize="$5"
      letterSpacing={0.5}
      width="100%"
      paddingVertical="$3"
      paddingHorizontal="$2"
      borderRadius="$3"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.08}
      shadowRadius={8}
      elevation={2}
      onPress={onPress}
      pressStyle={{ opacity: 0.8 }}
    >
      {title}
    </Button>
  );
};

export default SignUpButton;
