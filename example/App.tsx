import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ChangeQuery from './src/ChangeQuery';
import { Basic_useDocumentData } from './src/Basic_useDocumentData';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen
          name={'Basic_useDocumentData'}
          component={Basic_useDocumentData}
        />
        <Drawer.Screen name={'ChangeQuery'} component={ChangeQuery} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
