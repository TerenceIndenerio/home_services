import { TouchableOpacity, StyleSheet, Text } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
    label: string;
    onPress?: () => void;
}

const PopularSearchChip = ({ label, onPress }: Props) => (
    <TouchableOpacity style={styles.chip} onPress={onPress}>
        <Text style={styles.chipText}>{label}</Text>
        <Icon name="arrow-forward" size={14} color="#222" style={{ marginLeft: 4 }} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 14,
        marginRight: 7,
        marginBottom: 7,
        backgroundColor: '#fff',
    },
    chipText: {
        fontSize: 14,
        color: '#222',
    },
});

export default PopularSearchChip;