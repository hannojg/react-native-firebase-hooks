import React, { PropsWithChildren } from 'react';
import { LoadingHook } from '@skillnation/react-native-firebase-hooks/util';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type Props<
  T extends any,
  HookData extends LoadingHook<T, any> = LoadingHook<T, any>
> = {
  hookData: HookData | [...HookData, () => Promise<void>];
  transformData?: (data: T) => any;
};

export const BasicScreen = <T extends any = any>({
  hookData,
  transformData,
  children,
}: PropsWithChildren<Props<T>>) => {
  let [_data, isLoading, isError] = hookData;
  const data = transformData && _data ? transformData(_data) : _data;

  const content = (() => {
    if (isLoading) return <ActivityIndicator />;
    if (isError) return <Text>{isError.message}</Text>;
    if (!data) return <Text>No data</Text>;
    return <Text>{JSON.stringify(data, null, 2)}</Text>;
  })();

  return (
    <View style={styles.container}>
      {content}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
