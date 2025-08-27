import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AccountTypeOption from "./AccountTypeOption";

interface AccountTypeSelectionProps {
  onSelectAccountType?: (type: "user" | "serviceProvider") => void;
}

const AccountTypeSelection: React.FC<AccountTypeSelectionProps> = ({
  onSelectAccountType,
}) => {
  const [selectedType, setSelectedType] = useState<
    "user" | "serviceProvider" | null
  >(null);

  const handleSelectType = (type: "user" | "serviceProvider") => {
    setSelectedType(type);
    if (onSelectAccountType) {
      onSelectAccountType(type);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Select an account type</Text>
      </View>
      <View style={styles.optionsContainer}>
        <AccountTypeOption
          imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/ddb4d2d8909d44954fd5b8734cb16723cc37a8ce?placeholderIfAbsent=true"
          label="User"
          onPress={() => handleSelectType("user")}
          isSelected={selectedType === "user"}
        />
        <AccountTypeOption
          imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/33a2e00f1da757dd2200e36eee06aacc424f7d53?placeholderIfAbsent=true"
          label="Service Provider"
          onPress={() => handleSelectType("serviceProvider")}
          isSelected={selectedType === "serviceProvider"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingTop: 50,
    paddingRight: 20,
    paddingBottom: 50,
    paddingLeft: 20,
  },
  titleContainer: {
    marginBottom: 117,
  },
  title: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 24,
    color: "#8C52FF",
    textAlign: "center",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
});

export default AccountTypeSelection;
