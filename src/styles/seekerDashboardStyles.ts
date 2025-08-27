import { StyleSheet } from 'react-native';

const colors = {
  primary: '#8B5CF6',
  background: '#F5F5F5',
  card: '#fff',
  text: '#222',
  muted: '#888',
  scheduled: '#6D28D9',
  cancelled: '#EF4444',
  completed: '#10B981',
};

const shared = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)",
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  arrow: {
    fontSize: 18,
    color: colors.muted,
    fontWeight: 'bold',
  },
});

export { colors, shared }; 