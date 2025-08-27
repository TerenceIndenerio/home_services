import * as React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from "react-native";

interface InputFieldProps extends TextInputProps {
  label: string;
  required?: boolean;
  style?: ViewStyle;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  required = false,
  style,
  ...textInputProps
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>
          {label}
          {required && <Text style={styles.requiredIndicator}> *</Text>}
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder={label}
        placeholderTextColor="#A0A0A0"
        {...textInputProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 6,
  },
  labelText: {
    fontFamily: 'Inter',
    fontSize: 15,
    color: '#444',
    fontWeight: '500',
  },
  requiredIndicator: {
    fontWeight: '900',
    color: '#8C52FF',
  },
  input: {
    borderColor: '#E0E0E0',
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    fontFamily: 'Inter',
    color: '#222',
    backgroundColor: '#FAFAFA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
});

export default InputField;
