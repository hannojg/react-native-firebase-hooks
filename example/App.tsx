import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ChangeQuery from './src/ChangeQuery';
import { Basic_useDocumentData } from './src/Basic_useDocumentData';
import { Basic_useDocument } from './src/Basic_useDocument';
import { Basic_useDocumentOnce } from './src/Basic_useDocumentOnce';
import { Basic_useDocumentDataOnce } from './src/Basic_useDocumentDataOnce';
import { Basic_useCollection } from './src/Basic_useCollection';
import { Basic_useCollectionData } from './src/Basic_useCollectionData';
import { Basic_useCollectionOnce } from './src/Basic_useCollectionOnce';
import { Basic_useCollectionDataOnce } from './src/Basic_useCollectionDataOnce';

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
          name={'Basic_useDocumentOnce'}
          component={Basic_useDocumentOnce}
        />
        <Drawer.Screen
          name={'Basic_useDocumentDataOnce'}
          component={Basic_useDocumentDataOnce}
        />
        <Drawer.Screen
          name={'Basic_useCollectionData'}
          component={Basic_useCollectionData}
        />
        <Drawer.Screen
          name={'Basic_useCollection'}
          component={Basic_useCollection}
        />
        <Drawer.Screen
          name={'Basic_useCollectionOnce'}
          component={Basic_useCollectionOnce}
        />
        <Drawer.Screen
          name={'Basic_useCollectionDataOnce'}
          component={Basic_useCollectionDataOnce}
        />
        <Drawer.Screen name={'ChangeQuery'} component={ChangeQuery} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
