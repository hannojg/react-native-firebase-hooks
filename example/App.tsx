import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useDocumentData } from '@skillnation/react-native-firebase-hooks/firestore';
import firestore from '@react-native-firebase/firestore';

export default function App() {
  const [product, loading, error] = useDocumentData(
    firestore().collection('products').doc('productA'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  console.log({ product, loading, error });
  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator />}
      {error && <Text>{error.message}</Text>}
      {product && <Text>{product.name}</Text>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
