import React from 'react';
import { LoadingHook } from '@skillnation/react-native-firebase-hooks/util';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type Props<T extends any> = {
  hookData: LoadingHook<T, any>;
};

export const BasicScreen = <T extends any = any>({ hookData }: Props<T>) => {
  const [data, isLoading, isError] = hookData;

  const content = (() => {
    if (isLoading) return <ActivityIndicator />;
    if (isError) return <Text>{isError.message}</Text>;
    if (!data) return <Text>No data</Text>;
    return <Text>{JSON.stringify(data, null, 2)}</Text>;
  })();

  return <View style={styles.container}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
