import { View, Text, StyleSheet, FlatList } from "react-native"
import PopularSearchChip from "./PopularSearchChip"
import { router } from "expo-router";

const PopularSearchSection = () => {
    const POPULAR_SEARCHES = [
        {
            id: '1',
            title: 'Indoor Cleaning',
        },
        {
            id: '2',
            title: 'Outdoor Cleaning',
        },
        {
            id: '3',
            title: 'Carpentry',
        },
        {
            id: '4',
            title: 'Plumbing',
        },
        {
            id: '5',
            title: 'Electrical',
        },
        {
            id: '6',
            title: 'Gardening',
        },
    ];

    return (
        <View style={styles.popularSection}>
            <Text style={styles.sectionTitle}>Popular Searches</Text>
            <FlatList
                data={POPULAR_SEARCHES}
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipWrap}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <PopularSearchChip
                        label={item.title}
                        onPress={() => { router.push({ pathname: 'Search/SearchResults', params: { query: item.title } }) }}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    popularSection: {
        backgroundColor: '#fff',
        marginHorizontal: 18,
        borderRadius: 12,
        padding: 14,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#f3f3f3',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 10,
    },
    chipWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 7,
    },
    chip: {
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        marginBottom: 8,
        boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.06)",
    },
});

export default PopularSearchSection