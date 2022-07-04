import React from 'react';
import { useDocument } from '@skillnation/react-native-firebase-hooks/firestore';
import { Product } from './types';
import { BasicScreen } from './components/BasicScreen';
import firestore from '@react-native-firebase/firestore';

export const Basic_useDocument: React.FC = () => {
  const hookData = useDocument(
    firestore().collection<Product>('products').doc('productA')
  );

  return (
    <BasicScreen
      hookData={hookData}
      transformData={(d) => ({
        ...d.data(),
        id: d.id,
        path: d.ref.path,
      })}
    />
  );
};
