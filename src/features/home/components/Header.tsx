import * as React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from "expo-router";
import SearchBar from "@/app/Search/components/SearchBar";

const Header: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <View style={styles.textContainer}>
          <Text style={styles.homeText}>Home</Text>
          <Text style={styles.addressText}>
            1176 St, 1930 Antipolo, Philippines 1st St
          </Text>
        </View>
        <Image
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/a53206a1ac514d57bc5e1f4cc3ffd204/7d363a48a598bfc3af41b8552ea9a8bf89f8bf61?placeholderIfAbsent=true",
          }}
          style={styles.profileImage}
        />
      </View>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={() => router.push('/Search/SearchMenu')}>
          <SearchBar
            Placeholder="Search for services or providers"
            value=""
            onPress={() => router.push('/Search/SearchMenu')}
            onChangeText={() => { }}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Icon name="options-outline" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    backgroundColor: "#8C52FF",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  homeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  addressText: {
    fontSize: 13,
    color: "#eee",
    marginTop: 4,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Header;
