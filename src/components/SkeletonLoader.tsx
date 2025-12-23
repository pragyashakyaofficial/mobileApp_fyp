import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

interface SkeletonLoaderProps {
  children: React.ReactNode;
  style?: any;
  [key: string]: any;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ children, style, ...props }) => {
  return (
    <SkeletonPlaceholder
      borderRadius={4}
      highlightColor="#f0f0f0"
      speed={1200}
      backgroundColor="#e0e0e0"
      style={style}
      {...props}
    >
      {children}
    </SkeletonPlaceholder>
  );
};

export const CardSkeleton = ({ height = 100 }: { height?: number }) => (
  <SkeletonLoader style={{}}>
    <View style={[styles.card, { height }]} />
  </SkeletonLoader>
);

export const ListSkeleton = ({ items = 3 }: { items?: number }) => (
  <View>
    {Array.from({ length: items }).map((_, index) => (
      <SkeletonLoader key={index} style={{}}>
        <View style={styles.listItem}>
          <View style={styles.avatar} />
          <View style={styles.content}>
            <View style={styles.title} />
            <View style={styles.subtitle} />
          </View>
        </View>
      </SkeletonLoader>
    ))}
  </View>
);

export const TextSkeleton = ({ width = '100%', height = 20 }: { width?: number | string; height?: number }) => (
  <SkeletonLoader style={{}}>
    <View style={[{ width: typeof width === 'string' ? width : `${width}px`, height }]} />
  </SkeletonLoader>
);

export const ButtonSkeleton = ({ width = 120, height = 40 }: { width?: number; height?: number }) => (
  <SkeletonLoader style={{}}>
    <View style={[{ width, height, borderRadius: 8 }]} />
  </SkeletonLoader>
);

export const DashboardSkeleton = () => (
  <View style={styles.dashboardContainer}>
    <SkeletonLoader style={{}}>
      <View style={styles.header} />
      <View style={styles.statsRow}>
        <View style={styles.statCard} />
        <View style={styles.statCard} />
        <View style={styles.statCard} />
      </View>
      <View style={styles.section} />
      <View style={styles.listSection}>
        <View style={styles.listHeader} />
        <View style={styles.listItem} />
        <View style={styles.listItem} />
      </View>
    </SkeletonLoader>
  </View>
);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    width: '60%',
    height: 16,
    marginBottom: 8,
  },
  subtitle: {
    width: '40%',
    height: 12,
  },
  dashboardContainer: {
    padding: 16,
  },
  header: {
    width: '50%',
    height: 24,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '30%',
    height: 80,
    borderRadius: 8,
  },
  section: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 24,
  },
  listSection: {
    flex: 1,
  },
  listHeader: {
    width: '40%',
    height: 18,
    marginBottom: 16,
  },
});

export default SkeletonLoader;
