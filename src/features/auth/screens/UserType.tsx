import React, { useState } from "react";
import { View } from "react-native";
import AccountTypeSelection from "../components/AccountTypeSelection";
import ProceedButton from "../components/ProceedButton";
import { useRouter } from "expo-router";

const InputDesign: React.FC = () => {
  const [selectedType, setSelectedType] = useState<
    "user" | "serviceProvider" | null
  >(null);
  const router = useRouter();

  const handleAccountTypeSelection = (type: "user" | "serviceProvider") => {
    setSelectedType(type);
  };
  const handleProceed = () => {
    if (selectedType) {
      router.push({
        pathname: "/authentication/LoginScreen",
        params: { accountType: selectedType },
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={{ padding: 16 }}>
        <AccountTypeSelection onSelectAccountType={handleAccountTypeSelection} />
        <ProceedButton onPress={handleProceed} />
      </View>
    </View>
  );
};

export default InputDesign;
