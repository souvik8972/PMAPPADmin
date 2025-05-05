import React, { useCallback } from 'react';
import { ScrollView, RefreshControl } from 'react-native';

const RefreshableScrollView = ({
  children,
  onRefresh,
  refreshing,
  refreshColors = ['#D01313'],
  refreshTintColor = '#D01313',
  ...props
}) => {
  return (
    <ScrollView
      {...props}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={refreshColors}
          tintColor={refreshTintColor}
        />
      }
    >
      {children}
    </ScrollView>
  );
};

export default RefreshableScrollView;