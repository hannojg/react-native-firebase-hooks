import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ChangeQuery from './src/ChangeQuery';
import { Basic_useDocumentData } from './src/Basic_useDocumentData';
import { Basic_useDocument } from './src/Basic_useDocument';
import { Basic_useCollection } from './src/Basic_useCollection';
import { Basic_useCollectionData } from './src/Basic_useCollectionData';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen
          name={'Basic_useDocumentData'}
          component={Basic_useDocumentData}
        />
        <Drawer.Screen
          name={'Basic_useDocument'}
          component={Basic_useDocument}
        />
        <Drawer.Screen
          name={'Basic_useCollectionData'}
          component={Basic_useCollectionData}
        />
        <Drawer.Screen
          name={'Basic_useCollection'}
          component={Basic_useCollection}
        />
        <Drawer.Screen name={'ChangeQuery'} component={ChangeQuery} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
