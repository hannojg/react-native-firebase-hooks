import React from 'react';
import { Button } from 'react-native';
import { useCollectionData } from '@skillnation/react-native-firebase-hooks/firestore';
import firestore from '@react-native-firebase/firestore';
import { Product } from './types';
import { BasicScreen } from './components/BasicScreen';

export default function ChangeQuery() {
  const [collectionName, setCollectionName] = React.useState('invalid');

  const hookData = useCollectionData<Product>(
    firestore().collection(collectionName),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  return (
    <BasicScreen hookData={hookData}>
      <Button
        title={'Change query'}
        onPress={() => setCollectionName('products')}
      />
    </BasicScreen>
  );
}
