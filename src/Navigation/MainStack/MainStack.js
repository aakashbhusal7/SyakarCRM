import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabStack from './BottomStack';
import Routes from '../Routes';
import MainScreen from '../../Screens/Home';

const Stack = createStackNavigator();

export default props => {
  return (
    <Stack.Navigator headerMode="none" >
    <Stack.Screen name={Routes.MAIN_APP} component={MainScreen} />
     
    
   </Stack.Navigator>
  );
};
