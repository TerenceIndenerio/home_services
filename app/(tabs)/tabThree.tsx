import * as React from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Dimensions,
    RefreshControl,
} from "react-native";

import AccountProfile from "../AccountProfile/AccountProfileScreen";

const screenWidth = Dimensions.get("window").width;

const HomeScreen: React.FC = () => {
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        
        
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    return (
        <SafeAreaView style={styles.container}>

            {}
            

            {}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                horizontal={false}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#8B5CF6"]}
                        tintColor="#8B5CF6"
                    />
                }
            >
                <View style={styles.contentWrapper}>
                    <AccountProfile />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        position: "relative",
        overflow: "hidden",
    },
    headerWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        zIndex: 10,
        elevation: 5,
    },
    scrollContent: {
        paddingBottom: 100,
        flexGrow: 1,
        width: screenWidth,
    },
    contentWrapper: {
        width: "100%",
    },
    bottomNavigation: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        zIndex: 10,
        elevation: 5,
    },
});

export default HomeScreen;
