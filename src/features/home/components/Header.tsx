import * as React from "react";
import { YStack, XStack, Text, Image, Button } from "tamagui";
import { TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { useAuth } from "../../auth/context/authContext";
import SearchBar from "../../../../app/Search/components/SearchBar";

const Header: React.FC = () => {
  const router = useRouter();
  const { state } = useAuth();
  const [lastName, setLastName] = React.useState<string>("");

  const getUserProfile = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      const snapshot = await getDoc(userRef);

      if (!snapshot.exists()) {
        return null;
      }

      const userData = snapshot.data();
      return userData;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  React.useEffect(() => {
    const loadUserData = async () => {
      if (!state.userDocumentId) {
        return;
      }

      try {
        const userData = await getUserProfile(state.userDocumentId);
        if (userData && userData.lastName) {
          setLastName(userData.lastName);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, [state.userDocumentId]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    let greeting = "";
    let iconName = "";

    if (hour >= 5 && hour < 12) {
      greeting = "Good Morning";
      iconName = "sunny-outline";
    } else if (hour >= 12 && hour < 18) {
      greeting = "Good Afternoon";
      iconName = "partly-sunny-outline";
    } else {
      greeting = "Good Evening";
      iconName = "moon-outline";
    }

    const fullGreeting = lastName ? `${greeting}, ${lastName}` : greeting;
    return { text: fullGreeting, icon: iconName };
  };

  const { text: greeting, icon: greetingIcon } = getGreeting();

  return (
    <YStack
      width="100%"
      backgroundColor="#8C52FF"
      paddingTop={16}
      paddingHorizontal={24}
      paddingBottom={24}
      borderBottomLeftRadius={28}
      borderBottomRightRadius={28}
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 6 }}
      shadowOpacity={0.2}
      shadowRadius={16}
      elevation={12}
      minHeight={120}
    >
      <XStack
        alignItems="center"
        justifyContent="space-between"
        marginBottom={16}
        paddingTop={8}
      >
        <XStack alignItems="center" gap={10}>
          <Icon name={greetingIcon} size={22} color="#fff" />
          <Text
            fontSize={20}
            fontWeight="600"
            color="#fff"
            lineHeight={24}
          >
            {greeting}
          </Text>
        </XStack>
        <Image
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/a53206a1ac514d57bc5e1f4cc3ffd204/7d363a48a598bfc3af41b8552ea9a8bf89f8bf61?placeholderIfAbsent=true",
          }}
          width={44}
          height={44}
          borderRadius={22}
          borderWidth={2}
          borderColor="#fff"
        />
      </XStack>
      <XStack
        alignItems="center"
        gap={16}
        paddingHorizontal={4}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: 'row',
            borderRadius: 16,
            overflow: 'hidden'
          }}
          onPress={() => router.push('/Search/SearchMenu')}
        >
          <SearchBar
            Placeholder="Search for services or providers"
            value=""
            onPress={() => router.push('/Search/SearchMenu')}
            onChangeText={() => { }}
          />
        </TouchableOpacity>
      </XStack>
    </YStack>
  );
};


export default Header;
