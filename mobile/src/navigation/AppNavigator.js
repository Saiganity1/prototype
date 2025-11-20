import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedScreen from '../screens/FeedScreen';
import CreateItemScreen from '../screens/CreateItemScreen';
import ItemDetailScreen from '../screens/ItemDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
  <Stack.Screen name="Lost & Found" component={FeedScreen} />
      <Stack.Screen name="New Item" component={CreateItemScreen} />
      <Stack.Screen name="Item Detail" component={ItemDetailScreen} />
    </Stack.Navigator>
  );
}
