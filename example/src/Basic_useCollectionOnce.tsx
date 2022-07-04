import React from 'react';
import type { Product } from './types';
import { BasicScreen } from './components/BasicScreen';
import firestore from '@react-native-firebase/firestore';
import { useCollectionOnce } from '@skillnation/react-native-firebase-hooks/firestore';

export const Basic_useCollectionOnce: React.FC = () => {
  const hookData = useCollectionOnce(
    firestore().collection<Product>('products')
  );

  return (
    <BasicScreen
      hookData={hookData}
      transformData={(d) => ({
        size: d.size,
        empty: d.empty,
      })}
    />
  );
};
