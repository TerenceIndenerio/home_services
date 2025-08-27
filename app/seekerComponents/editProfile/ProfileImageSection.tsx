import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  imageUrl: string;
  onEdit: () => void;
  onBack: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const ProfileImageSection: React.FC<Props> = ({ 
  imageUrl, 
  onEdit, 
  onBack, 
  onRefresh,
  refreshing = false
}) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.backBtn} onPress={onBack}>
      <Icon name="arrow-back" size={22} color="#8F5CFF" />
    </TouchableOpacity>
    
    {onRefresh && (
      <TouchableOpacity 
        style={[styles.refreshBtn, refreshing && styles.refreshBtnDisabled]} 
        onPress={onRefresh}
        disabled={refreshing}
      >
        <Icon 
          name={refreshing ? "refresh" : "refresh-outline"} 
          size={20} 
          color={refreshing ? "#ccc" : "#8F5CFF"} 
        />
      </TouchableOpacity>
    )}
    
    <View style={styles.imageWrapper}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
        <Icon name="pencil" size={18} color="#8F5CFF" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
    backgroundColor: '#F3F0FF',
    borderRadius: 16,
    padding: 8,
  },
  refreshBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: '#F3F0FF',
    borderRadius: 16,
    padding: 8,
  },
  refreshBtnDisabled: {
    backgroundColor: '#f0f0f0',
  },
  imageWrapper: {
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  editBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
});

export default ProfileImageSection; 