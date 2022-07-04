import React from 'react';
import type { Product } from './types';
import { BasicScreen } from './components/BasicScreen';
import firestore from '@react-native-firebase/firestore';
import { useCollectionDataOnce } from '@skillnation/react-native-firebase-hooks/firestore';

export const Basic_useCollectionDataOnce: React.FC = () => {
  const hookData = useCollectionDataOnce(
    firestore().collection<Product>('products')
  );

  return <BasicScreen hookData={hookData} />;
};
