import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useCollectionData } from '@skillnation/react-native-firebase-hooks/firestore';
import firestore from '@react-native-firebase/firestore';
import { Product } from './types';

export default function ChangeQuery() {
  const [collectionName, setCollectionName] = React.useState('invalid');

  const [products, loading, error] = useCollectionData<Product>(
    firestore().collection(collectionName),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  console.log({ product: products, loading, error });
  return (
    <View style={styles.container}>
      <Button
        title={'Change query'}
        onPress={() => setCollectionName('products')}
      />
      {loading && <ActivityIndicator />}
      {error && <Text>{error.message}</Text>}
      {products &&
        products.length > 0 &&
        products.map((product, i) => <Text key={i}>{product.name}</Text>)}
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
