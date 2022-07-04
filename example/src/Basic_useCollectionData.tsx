import React from 'react';
import { useCollectionData } from '@skillnation/react-native-firebase-hooks/firestore';
import { Product } from './types';
import { BasicScreen } from './components/BasicScreen';
import firestore from '@react-native-firebase/firestore';

export const Basic_useCollectionData: React.FC = () => {
  const hookData = useCollectionData(
    firestore().collection<Product>('products')
  );

  return <BasicScreen hookData={hookData} />;
};
