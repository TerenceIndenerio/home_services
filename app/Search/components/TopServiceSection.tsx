import { View, Text, StyleSheet, FlatList } from "react-native";
import TopServiceCard from "./TopServiceCard";
import { router } from "expo-router";

const TopServiceSection = () => {
    const TOP_SERVICES = [
        {
            id: '1',
            title: 'Home Cleaning',
        },
        {
            id: '2',
            title: 'Carpentry',
        },
        {
            id: '3',
            title: 'Plumbing',
        },
        {
            id: '4',
            title: 'Electrical',
        },
        {
            id: '5',
            title: 'Gardening',
        },
    ];

    return (
        <View>
            <Text style={[styles.sectionTitle, { marginTop: 22, marginLeft: 18 }]}>Top services</Text>
            <FlatList
                data={TOP_SERVICES}
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.servicesWrap}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TopServiceCard
                        label={item.title}
                        onPress={() => { router.push({ pathname: 'Search/SearchResults', params: { query: item.title } }) }}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 10,
    },
    servicesWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 7,
        justifyContent: 'center',
        marginTop: 10,
        marginHorizontal: 6,
    },
});

export default TopServiceSection