import React from 'react';
import { useCollection } from '@skillnation/react-native-firebase-hooks/firestore';
import { Product } from './types';
import { BasicScreen } from './components/BasicScreen';
import firestore from '@react-native-firebase/firestore';

export const Basic_useCollection: React.FC = () => {
  const hookData = useCollection(firestore().collection<Product>('products'));

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
