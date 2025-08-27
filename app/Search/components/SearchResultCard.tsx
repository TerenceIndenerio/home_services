import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
    name: string;
    rating: number;
    job: string;
    address: string;
    image: string;
    onPress?: () => void;
}

const SearchResultCard = ({ name, rating, job, address, image, onPress }: Props) => (
    <View style={styles.card}>
        <Image source={{ uri: image }} style={styles.cardImage} />
        <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{name}</Text>
            <View style={styles.cardRatingRow}>
                {[1, 2, 3, 4, 5].map((n) => (
                    <Icon
                        key={n}
                        name={n <= Math.floor(rating) ? "star" : n - rating < 1 ? "star-half" : "star-outline"}
                        size={15}
                        color="#FFD700"
                        style={{ marginRight: 1 }}
                    />
                ))}
            </View>
            <Text style={styles.cardJob}>{job}</Text>
            <View style={styles.cardAddressRow}>
                <Icon name="location-outline" size={14} color="#C94A4A" style={{ marginRight: 3 }} />
                <Text style={styles.cardAddress}>{address}</Text>
            </View>
            <TouchableOpacity onPress={onPress} style={styles.cardBtn}>
                <Text style={styles.cardBtnText}>View</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "flex-start",
        borderWidth: 1,
        borderColor: "#D3C7F6",
        borderRadius: 12,
        backgroundColor: "#fff",
        padding: 16,
        marginBottom: 12,
        boxShadow: "0px 0px 8px rgba(140, 82, 255, 0.10)",
    },
    cardImage: {
        width: 64,
        height: 64,
        borderRadius: 12,
        marginRight: 14,
        backgroundColor: "#eee",
    },
    cardInfo: {
        flex: 1,
        justifyContent: "flex-start",
    },
    cardName: {
        fontWeight: "bold",
        fontSize: 17,
        color: "#222",
        marginBottom: 2,
    },
    cardRatingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 2,
    },
    cardJob: {
        fontSize: 15,
        color: "#444",
        marginBottom: 2,
    },
    cardAddressRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 7,
    },
    cardAddress: {
        fontSize: 13,
        color: "#666",
    },
    cardBtn: {
        backgroundColor: "#8C52FF",
        borderRadius: 8,
        paddingVertical: 7,
        marginTop: 3,
        alignItems: "center",
        width: 110,
    },
    cardBtnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 15,
    },
});

export default SearchResultCard;