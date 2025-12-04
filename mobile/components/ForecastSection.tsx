import React, { memo } from 'react';
import { View, Text, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import Colors from '@/constants/colors';

interface ForecastSectionProps<T> {
  title: string;
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  emptyText?: string;
}

function ForecastSectionInner<T>({
  title,
  data,
  renderItem,
  keyExtractor,
  emptyText = 'Không có dữ liệu dự báo',
}: ForecastSectionProps<T>) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={92} // card width (80) + marginRight (12)
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

// Memo wrapper that preserves generic type
const ForecastSection = memo(ForecastSectionInner) as typeof ForecastSectionInner;

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  listContent: {
    paddingRight: 20,
  },
  emptyContainer: {
    height: 120,
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});

export default ForecastSection;
