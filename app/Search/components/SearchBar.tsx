import * as React from "react";
import { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  Placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onPress?: () => void;
  onClear?: () => void;
};

const SearchBar = ({ Placeholder, value, onChangeText, onPress, onClear, }: Props) => {
  

  return (
    <View style={styles.searchInputWrapper}>
      <Icon name="search-outline" size={18} color="#888" style={{ marginLeft: 8 }} />
      <TextInput
        onPress={onPress}
        placeholder={Placeholder}
        placeholderTextColor="#999"
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear}>
          <Icon name="close-circle" size={20} color="#aaa" style={{ marginRight: 8 }} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    fontSize: 15,
    marginLeft: 7,
    color: '#222',
    paddingVertical: 0,
    paddingRight: 10,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#eee',
    marginHorizontal: 8,
    height: 44,
    boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.04)",
  },
});

export default SearchBar;
