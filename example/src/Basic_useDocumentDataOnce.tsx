import React from 'react';
import { useDocumentDataOnce } from '@skillnation/react-native-firebase-hooks/firestore';
import type { Product } from './types';
import { BasicScreen } from './components/BasicScreen';
import firestore from '@react-native-firebase/firestore';

export const Basic_useDocumentDataOnce: React.FC = () => {
  const hookData = useDocumentDataOnce(
    firestore().collection<Product>('products').doc('productA')
  );

  return <BasicScreen hookData={hookData} />;
};
