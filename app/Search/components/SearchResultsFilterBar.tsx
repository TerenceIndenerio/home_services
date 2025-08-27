import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

const FILTERS = [
    { icon: "options-outline", label: "Category" },
    { label: "Address" },
    { label: "Ratings 4.0+" },
    { label: "Sort" },
];

const SearchResultsFilterBar = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
        {FILTERS.map((f, i) => (
            <TouchableOpacity key={i} style={styles.filterChip}>
                {f.icon && <Icon name={f.icon} size={18} color="#222" style={{ marginRight: 5 }} />}
                <Text style={styles.filterChipText}>{f.label}</Text>
            </TouchableOpacity>
        ))}
    </ScrollView>
);

const styles = StyleSheet.create({
    filterBar: {
        flexDirection: "row",
        marginBottom: 8,
        marginLeft: 2,
        minHeight: 40,
        maxHeight: 40,
    },
    filterChip: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 18,
        paddingVertical: 6,
        paddingHorizontal: 14,
        marginRight: 8,
        backgroundColor: "#fff",
    },
    filterChipText: {
        fontSize: 15,
        color: "#222",
    },
});

export default SearchResultsFilterBar;