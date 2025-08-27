import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
    label: string;
    onPress?: () => void;
}

const TopServiceCard = ({ label, onPress }: Props) => (
    <TouchableOpacity style={styles.serviceCard} onPress={onPress}>
        <View style={styles.serviceImagePlaceholder}>
            <Icon name="image-outline" size={26} color="#bbb" />
        </View>
        <Text style={styles.serviceLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    serviceCard: {
        alignItems: 'center',
        width: 80,
    },
    serviceImagePlaceholder: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    serviceLabel: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        marginTop: 1,
    },
});

export default TopServiceCard