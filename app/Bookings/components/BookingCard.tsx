import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Button, Card, Flex, Text, WhiteSpace } from '@ant-design/react-native';

type TabType = 'Scheduled' | 'Completed' | 'Cancelled';
type Booking = {
  id: number;
  status?: string;
  penalty?: string;
  title: string;
  date: string;
  address: string;
  customer?: string;
  image: string;
  cancelledBy?: string;
  button: { label: string; type: string };
};

interface BookingCardProps {
  data: Booking;
  tab: TabType;
}

export default function BookingCard({ data, tab }: BookingCardProps) {
  return (
    <Card>
      <Card.Body>
        <Flex>
          <Flex.Item style={{ paddingRight: 4 }}>
            <Image source={{ uri: data.image }} style={styles.avatar} />
          </Flex.Item>
          <Flex.Item style={{ flex: 4 }}>
            <Flex justify="between">
              <Text style={styles.title} numberOfLines={1}>{data.title}</Text>
              {tab === 'Scheduled' && (
                <Text style={styles.statusOngoing}>On Going</Text>
              )}
              {tab === 'Cancelled' && (
                <Text style={styles.statusPenalty}>{data.status}</Text>
              )}
            </Flex>
            <WhiteSpace size="xs" />
            <Text style={styles.details}>{data.date}</Text>
            <Text style={styles.details}>{data.address}</Text>
            {tab === 'Scheduled' && (
              <Text style={styles.details}>Customer: {data.customer}</Text>
            )}
            {tab === 'Cancelled' && (
              <Text style={styles.details}>Cancelled by {data.cancelledBy} ({data.date})</Text>
            )}
            {tab === 'Cancelled' && (
              <Text style={styles.penalty}>~{data.penalty}</Text>
            )}
             <WhiteSpace size="sm" />
            <Button type={tab === 'Scheduled' ? 'default' : 'primary'} size="small">
              <Text>{data.button.label}</Text>
            </Button>
          </Flex.Item>
        </Flex>
      </Card.Body>
    </Card>
  );
}

const styles = StyleSheet.create({
    avatar: { width: 56, height: 56, borderRadius: 28 },
    title: { fontWeight: 'bold', fontSize: 15, flex: 1 },
    statusOngoing: { color: '#A259FF', fontWeight: 'bold', marginLeft: 8, fontSize: 12 },
    statusPenalty: { color: '#FF6B6B', fontWeight: 'bold', marginLeft: 8, fontSize: 12 },
    details: { color: '#555', fontSize: 13 },
    penalty: { color: '#FF6B6B', fontWeight: 'bold', fontSize: 13 },
}); 