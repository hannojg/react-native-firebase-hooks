import React from 'react';
import { Button } from 'react-native';
import { useDocumentData } from '@skillnation/react-native-firebase-hooks/firestore';
import firestore from '@react-native-firebase/firestore';
import type { Product } from './types';
import { BasicScreen } from './components/BasicScreen';

export const ChangeQuery_useDocumentData = () => {
  const [documentPath, setDocumentPath] = React.useState('invalid/doc');

  const hookData = useDocumentData(firestore().doc<Product>(documentPath), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  return (
    <BasicScreen hookData={hookData}>
      <Button
        title={'Change document ref'}
        onPress={() => setDocumentPath('products/productA')}
      />
    </BasicScreen>
  );
};
