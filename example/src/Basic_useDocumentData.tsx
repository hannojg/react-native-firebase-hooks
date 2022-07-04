import React from 'react';
import { useDocumentData } from '@skillnation/react-native-firebase-hooks/firestore';
import { Product } from './types';
import { BasicScreen } from './components/BasicScreen';
import firestore from '@react-native-firebase/firestore';

export const Basic_useDocumentData: React.FC = () => {
  const hookData = useDocumentData(
    firestore().collection<Product>('products').doc('productA')
  );

  return <BasicScreen hookData={hookData} />;
};
