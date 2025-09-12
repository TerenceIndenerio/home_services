import React from "react";
import { Button } from "tamagui";

interface AuthButtonProps {
  text: string;
  variant: "primary" | "secondary";
  onPress: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  text,
  variant,
  onPress,
}) => {
  return (
    <Button
      size="$4"
      theme={variant === "primary" ? "light" : "purple"}
      backgroundColor={variant === "primary" ? "$background" : "$purple9"}
      borderColor={variant === "primary" ? "$purple9" : "$background"}
      borderWidth={variant === "primary" ? 1 : 0}
      color={variant === "primary" ? "$purple9" : "$background"}
      fontWeight="700"
      fontSize="$5"
      onPress={onPress}
      pressStyle={{ opacity: 0.8 }}
    >
      {text}
    </Button>
  );
};

export default AuthButton;
