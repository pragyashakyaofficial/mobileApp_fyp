import React from 'react';
import {StyleSheet, View} from 'react-native';
import {MD3Theme} from 'react-native-paper';

import SkeletonLoader from './SkeletonLoader';

export default function PrimarySpinner() {
  const themedStyles = styles({} as MD3Theme);

  return (
    <SkeletonLoader style={{}}>
      <View style={themedStyles.container} />
    </SkeletonLoader>
  );
}

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
