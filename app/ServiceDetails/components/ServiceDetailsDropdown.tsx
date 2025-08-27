import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ServiceDetailsDropdownProps {
  open: boolean;
  onToggle: () => void;
  service: string;
  category: string;
  description: string;
}

const ServiceDetailsDropdown: React.FC<ServiceDetailsDropdownProps> = ({
  open,
  onToggle,
  service,
  category,
  description,
}) => {
  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={handleToggle} activeOpacity={0.8}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name="miscellaneous-services" size={20} color="#8C52FF" style={{ marginRight: 8 }} />
          <Text style={styles.title}>Service Details</Text>
        </View>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={22} color="#8C52FF" />
      </TouchableOpacity>
      {open && (
        <View style={styles.content}>
          <View style={styles.itemRow}>
            <MaterialIcons name="build" size={18} color="#8C52FF" style={styles.icon} />
            <Text style={styles.label}>Service:</Text>
            <Text style={styles.value}>{service}</Text>
          </View>
          <View style={styles.itemRow}>
            <MaterialIcons name="category" size={18} color="#8C52FF" style={styles.icon} />
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{category}</Text>
          </View>
          <View style={[styles.itemRow, { alignItems: 'flex-start' }]}> 
            <MaterialIcons name="description" size={18} color="#8C52FF" style={styles.icon} />
            <Text style={styles.label}>Description:</Text>
            <Text style={[styles.value, { flex: 1 }]}>{description}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F7F4FF',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8C52FF',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
    marginRight: 6,
    minWidth: 80,
  },
  value: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    flexShrink: 1,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 8,
    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.06)",
  },
});

export default ServiceDetailsDropdown; 